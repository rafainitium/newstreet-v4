/**
 * Extracts the per-project detail content out of V3's project pages.
 *
 * extract-projects.mjs lifts the portfolio *index* out of projects.html. This
 * lifts what only exists on the individual pages — the summary copy, the project
 * team, the published figures, and the gallery — so the V4 project route is
 * driven by data instead of nine hand-built pages.
 *
 * All nine V3 pages share one structure, which is what makes this parseable.
 * A page that stops matching fails loudly here rather than shipping a project
 * page with silently missing sections.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, resolve, posix } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
/* V3 is where the pages being extracted live — this stays the parse root. */
const V3 = resolve(here, '../../NEWST V3');
/* Where an image may live, in the order `optimize-images.mjs` searches: V4's
   own `assets/` first, then the V3 archive. Kept in step with that script; if
   the two ever disagree, this check passes files the build cannot resolve. */
const ASSET_ROOTS = [resolve(here, '../assets'), V3];
const OUT = resolve(here, '../src/data/project-detail.json');

const { projects } = JSON.parse(readFileSync(resolve(here, '../src/data/projects.json'), 'utf8'));

const decode = (raw = '') =>
  raw
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&rsquo;/g, "'")
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–')
    .replace(/\s+/g, ' ')
    .trim();

const one = (html, re) => {
  const m = html.match(re);
  return m ? decode(m[1]) : null;
};

/** V3's image paths are relative to the project's own folder. */
const resolveImage = (folder, src) =>
  posix.join(folder, decodeURIComponent(src.replace(/^\.\//, '')));

/**
 * HERO OVERRIDES — an editorial choice that has to outlive extraction.
 *
 * Everything else on this route is taken from V3 precisely so nine project
 * pages cannot drift into nine hand-maintained pages. A hero is the one field
 * where V3's choice is sometimes simply worse: it opens 319 Peabody on the
 * tower against a dusk sky, which is the same subject the card, the gallery
 * and the portfolio index already lead with, while the courtyard renders show
 * the thing a reader has not seen.
 *
 * Declared here rather than edited into `project-detail.json`, because that
 * file is generated and a hand edit to it is erased by the next `npm run
 * data` with nothing to say why.
 *
 * The image must already be one V3 ships — this redirects the choice, it does
 * not introduce new material. Alt text is written here because V3's was
 * written for a different frame.
 */
const HERO_OVERRIDES = {
  '319Peabody': {
    src: '319Peabody/232865_N15_medium.jpg',
    alt: 'The landscaped plaza beneath 319 Peabody, its timber soffit carried on branching columns above planting and seating',
  },
  /* V3 opens this page on `1165Blurred.jpg` — the building deliberately
     obscured, which was the only frame available while the deal was quiet. It
     is the one project page on the site whose subject a reader cannot see.
     This photograph is the building itself and lives in `assets/`, V4's own
     root, so it takes precedence without touching the V3 original. */
  '1165Clark': {
    src: '1165Clark/1165-n-clark-exterior.png',
    alt: '1165 N Clark Street seen from the east at sunset — a red brick building over a curved glass ground floor with a CVS pharmacy, its top floor set back behind planted terraces',
  },
};

/**
 * GALLERY ADDITIONS — frames V3's page does not carry.
 *
 * The gallery is extracted from V3's markup, which is right for the archive
 * imagery and useless for anything shot since. Entries here are appended after
 * the extracted set, so V3's order is preserved and the new frame reads as the
 * most recent rather than displacing the sequence the page was built around.
 */
const GALLERY_ADDITIONS = {
  '1165Clark': [
    {
      src: '1165Clark/1165-n-clark-exterior.png',
      alt: '1165 N Clark Street seen from the east at sunset — a red brick building over a curved glass ground floor with a CVS pharmacy, its top floor set back behind planted terraces',
    },
  ],
};

/**
 * SUMMARY OVERRIDES — the authored two-paragraph project description.
 *
 * Declared here for the same reason the hero override is: `project-detail.json`
 * is generated, and a hand edit to it is erased by the next `npm run data` with
 * nothing left to say why.
 *
 * EVERY PROJECT NOW READS TO ONE SHAPE. V3 wrote each page's summary on its own
 * terms — some led with the site, some with the sponsor, some ran a single
 * paragraph and some three — so nine pages answered the same question nine
 * ways. The first paragraph is now the same sentence everywhere: what the
 * building is, how tall, what type, where, and what it contains. The second is
 * the only place a project speaks for itself, and it is deliberately short:
 * what distinguishes THIS site, structure, or programme, and nothing that
 * repeats paragraph one or restates firm positioning.
 *
 * Nothing here is invented. Every figure traces to `projects.json` or to V3's
 * own copy, with two exceptions supplied directly by the firm: the Arris
 * stepped-back façade, and the emphasis on Wells Street traffic at 200 W Ohio.
 *
 * `summaryTitle` is NOT overridden — the two-line title is still V3's.
 */
const SUMMARY_OVERRIDES = {
  Arris: [
    'The Arris is a five-story mixed-use multifamily development at 606 W Wrightwood Avenue in Lincoln Park, Chicago. The project includes 48 total units, ground-floor retail anchored by Foxtrot Cafe & Market, and select residential amenities.',
    'The building takes the wedge-shaped corner where Clark meets Wrightwood, a geometry that allows a stepped-back façade with larger terraces above. Of the 48 residences, 38 are market-rate and 10 affordable, with 10 parking spaces below.',
  ],
  '1165Clark': [
    '1165 N Clark is a seven-story mixed-use multifamily development at 1165 N Clark Street in the Gold Coast, Chicago. The project includes 71 total units, commercial space anchored by CVS and Michigan State University Federal Credit Union, and select residential amenities.',
    'An office-to-residential conversion, where commercial floor plates yield expansive layouts and oversized private terraces that new construction on a Gold Coast parcel could not economically deliver. With the CTA Red Line at the door, the result has little direct competition in the submarket.',
  ],
  '200WO': [
    '200 W Ohio is a five-story mixed-use multifamily development at 200 W Ohio Street in River North, Chicago. The project includes 48 total units, 4,800 square feet of ground-floor retail, and select residential amenities.',
    'Retail runs the length of the Wells Street frontage, where the foot traffic is and where the storefronts carry the most visibility. Residences sit above, with amenities extending onto a landscaped outdoor terrace.',
  ],
  /* Keys, not units: there is no residential count here, and the template's
     unit sentence cannot be filled with a number that does not exist. */
  424: [
    '424 S Wabash is a 24-story hotel development at 424 S Wabash Avenue in the Loop, Chicago. The project includes 340 hotel keys operating under Marriott’s Tribute Portfolio, full-service hospitality program, and 203,624 gross square feet.',
    'The Tribute Portfolio flag lets the hotel keep its own identity rather than a chain template, on a corridor that has gained residential density faster than hospitality to serve it. The tower stands within walking distance of the Loop’s office core, Grant Park, and multiple CTA lines; Newstreet’s role here is as investor rather than developer.',
  ],
  '319Peabody': [
    '319 Peabody is a 53-story mixed-use tower at 319 Peabody Street in SoBro, Nashville. The project includes 405 hotel keys and 104 luxury condominiums, 400 below-grade parking spaces, and approximately 867,000 gross square feet.',
    'At 665 feet, the tower rises where SoBro meets Rutledge Hill, stacking hospitality and for-sale residential in a single structure. Parking sits below grade so the street level can carry retail, amenities, and public gathering space, with a rooftop pool and bar above.',
  ],
  /* One sentence in the second paragraph, by choice — the site's own story is
     the whole of what distinguishes this one. */
  '5thpine': [
    'Fifth + Pine is an eight-story mixed-use multifamily development at 5th Street and Pine Street in Michigan City, Indiana. The project includes approximately 500 total apartments, 40,000 square feet of retail anchored by a full-service grocery store, and structured parking.',
    'A $200 million redevelopment reclaiming the former Memorial Hospital site, a full city block vacant long enough to become a gap in the downtown.',
  ],
  '100NB': [
    'East Bank Apartments is a five-story multifamily development at 100 N Broadway in downtown Aurora, Illinois. The project includes 258 total units, 343,421 gross square feet, and select residential amenities.',
    'The first ground-up residential development in downtown Aurora in more than two decades. The site sits along the Fox River beside the Aurora Transportation Center and RiverEdge Park, putting residents on the line into Chicago and inside the city’s growing entertainment district.',
  ],
  626: [
    '626 S Wabash is a 19-story multifamily development at 626 S Wabash Avenue in the South Loop, Chicago. The project includes 368 total units, approximately 20,000 square feet of indoor and outdoor amenity space, and 210,000 gross square feet.',
    'Twenty thousand square feet of amenity space is the differentiator at this scale, in a submarket where new supply competes on shared space as much as on unit finish. Grant Park, the Museum Campus, and several CTA lines are all within a short walk.',
  ],
  '1810NW': [
    '1810 North Wells is a four-story mixed-use multifamily development at 1810 N Wells Street in Old Town, Chicago. The project includes 18 total units, 5,100 square feet of street-level retail, 18 parking spaces, and a shared courtyard.',
    'An adaptive reuse assembled from what was already on the site: two existing buildings, a two-story coach house, and a garage partially demolished to carry a new rooftop addition. Preserving the North Wells street-wall set the terms, answered in contemporary brick and metal rather than imitation.',
  ],
};

/**
 * ADDRESS OVERRIDES — where V3's page prints the wrong street number.
 *
 * Empty, and the empty map is the note: 200 W Ohio briefly carried an override
 * to 320 W Ohio St. That address is the FIRM'S OFFICE, not this project's, and
 * it belongs in the footer and on the contact page where it now sits. Applied
 * here it put the project at a number a block and a half from the corner its
 * own name, its V3 title ("Ohio & Wells"), and its retail frontage all
 * describe.
 */
const ADDRESS_OVERRIDES = {};

const detail = {};
const problems = [];

for (const project of projects) {
  if (!project.legacyHref) continue;

  const file = resolve(V3, project.legacyHref);
  if (!existsSync(file)) {
    problems.push(`${project.slug}: ${project.legacyHref} not found`);
    continue;
  }

  const html = readFileSync(file, 'utf8');
  const folder = posix.dirname(project.legacyHref);

  // ---- Hero -------------------------------------------------
  const hero = html.match(/<img class="proj-hero__img"[^>]*src="([^"]*)"[^>]*alt="([^"]*)"/);

  // ---- Summary ----------------------------------------------
  /* The title is two lines split by a <br>; V3 closes it with </h1> on an <h2>.
     The break is authored, so it is kept as two strings rather than decoded
     into one — `decode` collapses whitespace and would lose it. */
  const titleBlock = html.match(/class="summary__title[^"]*"[^>]*>([\s\S]*?)<\/h[12]>/);
  const titleLines = titleBlock
    ? titleBlock[1]
        .split(/<br\s*\/?>/i)
        .map((line) => decode(line))
        .filter(Boolean)
    : [];
  const bodyBlock = html.match(/class="summary__body[^"]*"[^>]*>([\s\S]*?)<\/div>/);
  const paragraphs = bodyBlock
    ? [...bodyBlock[1].matchAll(/<p[^>]*>([\s\S]*?)<\/p>/g)].map((m) => decode(m[1])).filter(Boolean)
    : [];

  /* ---- Project team -----------------------------------------
     Parsed a row at a time, not as three parallel lists: not every row has a
     logo — a project can list a role before the party is appointed — so zipping
     flat lists would attach the wrong mark to the wrong firm. */
  const team = [...html.matchAll(/class="team-row[ "][\s\S]*?class="team-row__name"[^>]*>([\s\S]*?)<\/div>/g)]
    .map((match) => {
      const block = match[0];
      const logo = block.match(/class="team-row__logo"[^>]*>\s*<img[^>]*src="([^"]*)"/);
      return {
        role: one(block, /class="team-row__role"[^>]*>([\s\S]*?)<\/div>/),
        name: decode(match[1]),
        logo: logo ? resolveImage(folder, logo[1]) : null,
      };
    })
    .filter((row) => row.role && row.name);

  // ---- Published figures ------------------------------------
  // Label and value alternate; the value is a div, or an anchor when it is text.
  const figures = [
    ...html.matchAll(
      /class="numbers-row__label"[^>]*>([\s\S]*?)<\/div>[\s\S]*?class="numbers-row__value[^"]*"[^>]*>([\s\S]*?)<\/(?:div|a)>/g,
    ),
  ].map((m) => ({ label: decode(m[1]), value: decode(m[2]) }));

  // ---- Gallery ----------------------------------------------
  const gallerySection = html.match(/<section class="gallery"[\s\S]*?<\/section>/);
  const gallery = gallerySection
    ? [...gallerySection[0].matchAll(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"/g)].map((m) => ({
        src: resolveImage(folder, m[1]),
        alt: decode(m[2]),
      }))
    : [];

  gallery.push(...(GALLERY_ADDITIONS[project.slug] ?? []));

  const website = html.match(/class="team-leasing[^"]*"[^>]*href="([^"]*)"/);

  detail[project.slug] = {
    address:
      ADDRESS_OVERRIDES[project.slug] ??
      one(html, /class="proj-hero__addr"[^>]*>([\s\S]*?)<\/div>/),
    city: one(html, /class="proj-hero__city"[^>]*>([\s\S]*?)<\/div>/),
    hero:
      HERO_OVERRIDES[project.slug] ??
      (hero ? { src: resolveImage(folder, hero[1]), alt: decode(hero[2]) } : null),
    summaryTitle: titleLines,
    summary: SUMMARY_OVERRIDES[project.slug] ?? paragraphs,
    team,
    figures,
    gallery,
    website: website ? website[1] : null,
  };

  if (!detail[project.slug].summary.length) problems.push(`${project.slug}: no summary copy`);
  if (!figures.length) problems.push(`${project.slug}: no figures`);
  if (!gallery.length) problems.push(`${project.slug}: no gallery`);

  /* Photo throws at build on an image missing from the manifest, so a bad path
     has to surface here — where it names the project — rather than as a broken
     build three steps later.

     BOTH ROOTS, IN THE ORDER `optimize-images.mjs` SEARCHES THEM. This checked
     the V3 tree alone, which was true while every project image was archive
     material. An override that points at a file in `assets/` — V4's own root,
     and the only one that should grow from here — is a real file the optimizer
     will find and this check would have called missing. The two must agree on
     where an image can live, or one of them is wrong. */
  const logos = team.filter((row) => row.logo).map((row) => ({ src: row.logo }));
  for (const image of [detail[project.slug].hero, ...gallery, ...logos].filter(Boolean)) {
    if (!ASSET_ROOTS.some((root) => existsSync(resolve(root, image.src)))) {
      problems.push(`${project.slug}: image not on disk — ${image.src}`);
    }
  }
}

if (problems.length) {
  console.error('project-detail.json — structure changed:\n  ' + problems.join('\n  '));
  process.exit(1);
}

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify(detail, null, 2) + '\n');

const count = (key) => Object.values(detail).reduce((n, d) => n + d[key].length, 0);
console.log(
  `project-detail.json — ${Object.keys(detail).length} projects, ` +
    `${count('figures')} figures, ${count('team')} team rows, ${count('gallery')} gallery images`,
);
