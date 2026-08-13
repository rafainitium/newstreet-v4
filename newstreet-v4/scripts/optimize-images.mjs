/**
 * Builds web-ready derivatives of every image the site actually references.
 *
 * V3 keeps its photography as full-resolution originals — 6000px JPEGs, 4MB PNGs —
 * and V4 previously exposed that whole tree to the browser. This emits AVIF, WebP
 * and a JPEG fallback at a handful of widths, writes a manifest, and lets the site
 * ship only the files it uses.
 *
 * Run via `npm run images`. Output is deterministic, so re-runs are cheap.
 */
import { mkdir, writeFile, readFile, rm, rename } from 'node:fs/promises';
import { existsSync, readdirSync } from 'node:fs';
import { dirname, resolve, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const here = dirname(fileURLToPath(import.meta.url));

/**
 * Two source roots, searched in order.
 *
 * `assets/` is V4's own. Anything shot or exported FOR the new site belongs
 * there — it is the only root that should grow from here on.
 *
 * `NEWST V3/` is the old site, kept as reference material. It is where the
 * existing photography and renders live, and it is read-only as far as this
 * build is concerned: nothing is written to it and nothing in it is served
 * directly. V4 does not depend on V3 to run — it depends on it for archive
 * imagery, and each of those files migrates to `assets/` when it is replaced.
 *
 * V4 is searched first, so dropping a file at the same relative path in
 * `assets/` overrides the V3 original without touching a single reference.
 */
const ASSET_ROOTS = [resolve(here, '../assets'), resolve(here, '../../NEWST V3')];
const OUT_DIR = resolve(here, '../public/img');
const MANIFEST = resolve(here, '../src/data/images.json');

/** First root that actually holds the file wins; null means nobody has it. */
const locate = (source) => {
  for (const root of ASSET_ROOTS) {
    const candidate = resolve(root, source);
    if (existsSync(candidate)) return candidate;
  }
  return null;
};

/**
 * Widths are capped to the source; nothing is ever upscaled.
 *
 * 3200 EXISTS FOR THE FULL-BLEED HEROES. A 1440px window on a 2× display asks
 * for 2880 device pixels, so a ladder topping out at 2400 meant every hero on
 * the site was being stretched by the browser — including a 15.9MP photograph
 * that had the detail to spare. Only sources that genuinely carry this many
 * pixels get the tier; the filter below never invents them.
 */
const WIDTHS = [400, 800, 1200, 1600, 2400, 3200];

/**
 * QUALITY IS SET BY HOW A TIER GETS LOOKED AT, NOT BY HOW BIG IT IS.
 *
 * The middle of the ladder is where bits matter most. 1600–2400 is what a
 * full-bleed hero is served at on an ordinary display, roughly one image pixel
 * per screen pixel, so every artifact is seen at full size — and the subject up
 * there is mostly sky, where a starved bitrate bands. Measured on this set
 * before the change, the dusk sky at 319 Peabody was landing at 0.19 bits per
 * pixel against 0.52 for its neighbours. That is not a saving, it is a stripe.
 *
 * The top tier is the opposite case and must NOT simply inherit the highest
 * number. 3200 is only ever chosen by a 2× display, which draws it at about
 * half its nominal size, so its artifacts land at half size too and it can be
 * compressed harder for the same result. Spending mid-tier quality up here
 * doubled the file for detail no eye resolves — 866KB against 468KB on the
 * press hero, for a frame nobody can see the difference in.
 *
 * Small widths stay lean: cards, rails, and headshots a few hundred pixels
 * wide have nowhere for compression to show.
 *
 * Chroma stays unsubsampled from 1600 up, for the opposite reason to all of
 * the above: renders are full of one-pixel mullions and window frames, and
 * 4:2:0 smears the colour exactly at those edges regardless of viewing size.
 */
const FULL_BLEED = 1600; // served at ~1:1 — artifacts seen at full size
const RETINA_ONLY = 3200; // only ever chosen by a 2× display

/**
 * A HAND-CROPPED CARD FRAME IS NOT A SMALL IMAGE, whatever its pixel count.
 *
 * The ladder above reads width as a proxy for how closely a tier is looked at,
 * and that proxy breaks here. A card frame is delivered pre-cut at 4:5 and its
 * TOP tier is what a 2× display draws at about 1:1 — the same viewing
 * condition a 1600px hero tier gets — but at 1200px it was falling into the
 * lean tier meant for rails and headshots: quality 50 and 4:2:0 chroma. On a
 * render, 4:2:0 is exactly wrong; these are full of one-pixel mullions and
 * window frames, which is the case the comment above already makes for holding
 * 4:4:4 from 1600 up.
 *
 * So a card's own top tier is treated as full-bleed regardless of its width.
 * The smaller rungs below it stay lean — those really are drawn small.
 */
const avifQuality = (width, fullBleed) => {
  if (width >= RETINA_ONLY) return 52;
  if (width >= FULL_BLEED || fullBleed) return 62;
  return 50;
};

const optionsFor = (ext, width, fullBleed = false) =>
  ext === 'avif'
    ? {
        quality: avifQuality(width, fullBleed),
        effort: 6,
        chromaSubsampling: width >= FULL_BLEED || fullBleed ? '4:4:4' : '4:2:0',
      }
    : {
        quality:
          width >= RETINA_ONLY ? 76 : width >= FULL_BLEED || fullBleed ? 82 : 74,
        smartSubsample: true,
      };

/* WebP carries the fallback tier. Every browser that supports <picture> also
   supports WebP, so a JPEG tier would be dead weight in the build. */
const FORMATS = ['avif'];
const FALLBACK = 'webp';

/** Images referenced outside the project record. */
const EXTRA_SOURCES = [
  '1165Clark/1165Blurred.jpg',
  'Arris/Renders/Hero Render.jpg',
  'Arris/Renders/kitchen.jpg',
  '319Peabody/232865_N20_medium.jpg',
  'Team/Gallery/P1098935.jpg',
  'Media/P1121297.jpg',
  // Headshots — the Team page is the one place names attach to faces.
  'Team/Headshots/Alex2-web.jpg',
  'Team/Headshots/Kyle.jpg',
  'Team/Headshots/rafa-web.jpg',
  'Media/Team-Photo.jpg',
  // V4-native — live in assets/, not in the V3 tree.
  'Media/Chicago Astor Street Historic District.jpg',
  'Media/pexels-harrisrigorad-25261411.jpg',
  'Media/pexels-blue-19698298.jpg',
  'Media/pexels-federated-art-241849155-12334350.jpg',
  'Media/pexels-roythephotographer-36884713.jpg',
  'Media/pexels-chaitaastic-2088233.jpg',
];

const slugify = (path) =>
  path
    .replace(extname(path), '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const projects = JSON.parse(
  await readFile(resolve(here, '../src/data/projects.json'), 'utf8'),
);

/* The project pages' heroes and galleries, so a route that renders them is not
   the thing that discovers they were never built. */
const detail = JSON.parse(
  await readFile(resolve(here, '../src/data/project-detail.json'), 'utf8'),
);

const logoSources = Object.values(detail).flatMap((entry) =>
  entry.team.map((row) => row.logo).filter(Boolean),
);

/* Partner marks, so adding one to the list is the only step. */
const { partners: partnerList } = await import('../src/lib/partners.js');
const partnerSources = partnerList.map((p) => p.logo);

/**
 * Partner logos ship as 1200×1200 canvases with the mark in a thin band across
 * the middle and the rest padding. Rendered at an inline height the mark ends up
 * a few pixels tall and unreadable, so the padding is trimmed off here and the
 * derivative is the mark's own bounding box. Photographs are never trimmed —
 * `trim` would eat a genuinely uniform sky.
 */
const TRIMMED = new Set([...logoSources, ...partnerList.map((p) => p.logo)]);

/* Press lead images are chosen in the spreadsheet, so naming one there has to
   be enough — the pipeline discovers it rather than waiting to be told twice. */
const press = JSON.parse(await readFile(resolve(here, '../src/data/press.json'), 'utf8'));
const pressSources = press.articles.map((article) => article.image).filter(Boolean);

const detailSources = Object.values(detail).flatMap((entry) => [
  ...[entry.hero, ...entry.gallery].filter(Boolean).map((image) => image.src),
  ...entry.team.map((row) => row.logo).filter(Boolean),
]);

/**
 * A PROJECT HERO IS FULL-BLEED AT 100vh, WHATEVER ITS PIXEL COUNT.
 *
 * Same correction the card frames needed, for the same reason: the ladder
 * treats width as a proxy for how closely a tier is looked at, and a hero
 * under 1600px breaks that proxy — it is the largest thing on its page while
 * being encoded for rails and headshots. 319 Peabody's plaza render is 1500px
 * and was landing at quality 50 with 4:2:0 chroma while filling the viewport.
 */
const heroSources = new Set(
  Object.values(detail)
    .map((entry) => entry.hero?.src)
    .filter(Boolean),
);

/**
 * `assets/cards/` — HAND-CROPPED CARD FRAMES, DISCOVERED RATHER THAN DECLARED.
 *
 * The project record's `image` is a render chosen for its own sake, and seven
 * of the eleven are ALSO the hero or a gallery frame on that project's page.
 * That is why a pre-cropped file cannot simply replace the original at its V3
 * path the way the rest of `assets/` overrides V3: it would re-crop the project
 * page too, at an aspect it was never cut for.
 *
 * So a card frame lives here instead, named for the project's slug, and only
 * the card reads it. Anything in this folder is picked up automatically — no
 * EXTRA_SOURCES entry — because the person cropping these is not the person
 * editing this file.
 */
const CARDS_DIR = resolve(here, '../assets/cards');
const cardSources = existsSync(CARDS_DIR)
  ? readdirSync(CARDS_DIR)
      .filter((f) => /\.(jpe?g|png|webp|avif)$/i.test(f))
      .map((f) => `cards/${f}`)
  : [];

/**
 * A CARD FRAME WHOSE NAME MATCHES NO SLUG IS A SILENT NO-OP, so it is called
 * out here. The card looks it up by slug; a near-miss like `1165.png` for
 * `1165Clark` simply never gets read, the card keeps its old crop, and nothing
 * anywhere says why. That is the one failure this folder can produce, and it
 * costs a build to notice by eye.
 */
if (cardSources.length) {
  const slugs = new Set(projects.projects.map((p) => p.slug.toLowerCase()));
  const orphans = cardSources.filter(
    (s) => !slugs.has(s.slice('cards/'.length).replace(extname(s), '').toLowerCase()),
  );
  console.log(`  cards/ — ${cardSources.length} hand-cropped frame(s)`);
  for (const o of orphans) {
    console.warn(`  ! ${o} matches no project slug — this card will NOT use it`);
  }
  console.log('');
}

// Every project image, so the portfolio route inherits the pipeline too.
const allSources = [
  ...cardSources,
  ...new Set([
    ...projects.projects.map((p) => decodeURIComponent(p.image)),
    ...detailSources,
    ...pressSources,
    ...partnerSources,
    ...EXTRA_SOURCES,
  ]),
];

/**
 * `--only=<substring>` REBUILDS ONE IMAGE INSTEAD OF ALL OF THEM.
 *
 * Swapping a single hero used to mean re-encoding all seventy-odd sources —
 * ten minutes of AVIF at effort 6 to change one file — so a two-minute
 * decision cost twenty. With a filter it is seconds.
 *
 * The full run stays the default and stays the one that ships: it is what
 * makes a clean checkout reproduce the deployed site, and it is the only mode
 * that removes derivatives whose source is gone. `--only` is the working
 * mode — it writes in place and merges into the existing manifest rather than
 * replacing it, so the entries it does not touch survive.
 */
const onlyArg = process.argv.find((a) => a.startsWith('--only='));
const only = onlyArg?.slice('--only='.length).toLowerCase();
const sources = only
  ? allSources.filter((s) => s.toLowerCase().includes(only))
  : allSources;

if (only && sources.length === 0) {
  console.error(`  ! --only=${only} matched none of the ${allSources.length} sources`);
  process.exit(1);
}
if (only) console.log(`--only=${only} → ${sources.length} of ${allSources.length} sources\n`);

/**
 * BUILD BESIDE THE LIVE FOLDER, THEN SWAP.
 *
 * This used to delete `public/img` and regenerate into the gap. Interrupt it
 * once — Ctrl-C, a cancelled task, a failing source — and the site is left
 * pointing at an emptied directory with a manifest that still promises every
 * file, which is every image on every page broken at once and no error to say
 * so. The old output now stands until the new one is complete.
 */
const STAGING = `${OUT_DIR}.building`;

/* A partial run has nothing to stage: it is adding files beside the ones
   already live, not replacing the folder, so it writes straight into it. */
const WRITE_DIR = only ? OUT_DIR : STAGING;

if (!only) {
  await rm(STAGING, { recursive: true, force: true });
}
await mkdir(WRITE_DIR, { recursive: true });

/* A partial run starts from what is already published so the entries it does
   not rebuild are still there when the manifest is written back. */
const manifest =
  only && existsSync(MANIFEST) ? JSON.parse(await readFile(MANIFEST, 'utf8')) : {};
let originalBytes = 0;
let outputBytes = 0;

for (const source of sources) {
  const absolute = locate(source);
  if (!absolute) {
    console.warn(`  ! missing from every asset root, skipped: ${source}`);
    continue;
  }

  /* A trimmed source reports the padded canvas in its own metadata, so the
     dimensions the manifest publishes have to come from the trimmed buffer —
     otherwise Photo emits a 1:1 width/height for a wordmark. */
  const trim = TRIMMED.has(source);
  const prepared = trim
    ? await sharp(absolute, { limitInputPixels: false }).trim({ threshold: 12 }).toBuffer()
    : absolute;

  const meta = await sharp(prepared, { limitInputPixels: false }).metadata();
  const slug = slugify(source);
  const widths = WIDTHS.filter((w) => w <= meta.width);
  if (widths.length === 0) widths.push(meta.width);

  /* RECOVER WHAT THE LADDER TRUNCATES.
     The rungs are fixed, so a source that lands between two of them was being
     served at the lower one and the rest of the file thrown away — a 2336px
     photograph topping out at a 1600px derivative, which is soft the moment the
     hero is wider than 1600 CSS pixels, and softer again on a 2× display. That
     is a third of the pixels the client actually supplied, discarded silently.

     So when the ladder was cut short BY the source, the source's own width goes
     on as the last rung. Only below the 3200 cap: past that the ladder is
     topping out by design, not by truncation, and a 5000px original does not
     get a 5000px tier. Still never upscales — this rung is by definition a
     width the file already has.

     The rung has to be worth an encode, so it needs to beat the rung below it
     by 15%. Measured across this set, 54 of the 59 sources that qualify clear
     that easily — a 400px cap opening up to 786, a 1600 to 2336 — while the
     five that do not are asking for a second full-size AVIF to gain 2%. */
  const largest = widths[widths.length - 1];
  if (meta.width < RETINA_ONLY && meta.width > largest * 1.15) widths.push(meta.width);

  /* A card frame's own top rung is what a 2× display draws at ~1:1, and a
     project hero fills the viewport outright. Both are encoded at full-bleed
     fidelity on their top rung regardless of how few pixels they carry. */
  const wantsFidelity = source.startsWith('cards/') || heroSources.has(source);
  const topRung = widths[widths.length - 1];

  const entry = {
    width: meta.width,
    height: meta.height,
    aspect: +(meta.width / meta.height).toFixed(4),
  };

  for (const ext of [...FORMATS, FALLBACK]) {
    const srcset = [];
    for (const width of widths) {
      const file = `${slug}-${width}.${ext}`;
      const buffer = await sharp(prepared, { limitInputPixels: false })
        .resize({ width, withoutEnlargement: true })
        .toFormat(ext, optionsFor(ext, width, wantsFidelity && width === topRung))
        .toBuffer();
      await writeFile(resolve(WRITE_DIR, file), buffer);
      outputBytes += buffer.length;
      srcset.push(`/img/${file} ${width}w`);
    }
    entry[ext] = srcset.join(', ');
  }

  // Largest fallback is the src for browsers without <picture> support.
  entry.fallback = `/img/${slug}-${widths[widths.length - 1]}.${FALLBACK}`;
  manifest[source] = entry;

  const { size } = await sharp(absolute).metadata().then(async () => ({
    size: (await readFile(absolute)).length,
  }));
  originalBytes += size;

  const root = absolute.startsWith(ASSET_ROOTS[0]) ? 'v4' : 'v3';
  console.log(`  [${root}] ${source} → ${widths.length} widths × 2 formats`);
}

/* Every derivative is written. Swap the finished folder in, then publish the
   manifest that describes it — in that order, so the manifest never promises a
   file that is not on disk. A partial run wrote in place and has no folder to
   swap, but the ordering argument is the same, so it too publishes last. */
if (!only) {
  await rm(OUT_DIR, { recursive: true, force: true });
  await rename(STAGING, OUT_DIR);
}

await mkdir(dirname(MANIFEST), { recursive: true });
await writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + '\n');

const mb = (bytes) => `${(bytes / 1024 / 1024).toFixed(1)}MB`;
console.log(
  `\nimages.json — ${Object.keys(manifest).length} sources\n` +
    `originals ${mb(originalBytes)} → derivatives ${mb(outputBytes)} ` +
    `(one width is served, not all)`,
);
