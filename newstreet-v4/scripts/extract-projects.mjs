/**
 * Extracts the portfolio out of the V3 static site into structured JSON.
 *
 * V3 stores every project as hand-written markup inside projects.html, which means
 * the portfolio can't be counted, filtered server-side, or reused across pages.
 * This lifts it into data once so V4 can derive its own numbers instead of
 * hardcoding them.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const SOURCE = resolve(here, '../../NEWST V3/projects.html');
const OUT = resolve(here, '../src/data/projects.json');

const html = readFileSync(SOURCE, 'utf8');

const attr = (block, name) => {
  const m = block.match(new RegExp(`${name}="([^"]*)"`));
  return m ? m[1] : '';
};

const text = (block, cls) => {
  const m = block.match(new RegExp(`class="${cls}"[^>]*>([^<]*)<`));
  return m ? m[1].trim() : '';
};

/** Splits "47.5K" / "48" into a number plus its original display string. */
const parseStat = (raw) => {
  const cleaned = raw.trim();
  const multiplier = /k$/i.test(cleaned) ? 1000 : 1;
  const numeric = parseFloat(cleaned.replace(/[^0-9.]/g, ''));
  return {
    display: cleaned,
    value: Number.isFinite(numeric) ? Math.round(numeric * multiplier) : null,
  };
};

/**
 * V3 presents the portfolio as two grids. Which grid a card sits in is a
 * *presentation* grouping and is not the same as its involvement — 424 S Wabash
 * sits in the developments grid but is flagged investor. The investments grid's
 * cards carry no data-involvement at all, so view has to be read from position.
 */
/** V3 spells the same stage two ways — 'construction' and 'under-construction'. */
const normalizeStage = (raw) => (raw === 'construction' ? 'under-construction' : raw);

/**
 * V3 ships three unnamed "Coming Soon" tiles — assets the firm holds but whose
 * address it has not released. They carry no href, no figures, and no asset
 * type, so the only thing identifying one is the folder its image sits in.
 *
 * Listing a folder here publishes that tile; 230 is deliberately absent. `view`
 * is declared rather than read from position because 332SM sits in V3's
 * investments grid but belongs with the developments.
 */
const PLACEHOLDERS = {
  '6935': { slug: '6935ND', view: 'developments' },
  '332SM': { slug: '332SM', view: 'developments' },
};

const investmentsAt = html.indexOf('id="investmentsGrid"');
const viewFor = (index) =>
  investmentsAt !== -1 && index > investmentsAt ? 'investments' : 'developments';

// Each project is one <a class="pcard ..."> ... </a>.
const cardStarts = [...html.matchAll(/<a class="pcard/g)].map((m) => m.index);
const cards = html.split(/<a class="pcard/).slice(1);

const projects = cards.flatMap((chunk, i) => {
  const block = chunk.slice(0, chunk.indexOf('</a>'));
  const href = attr(block, 'href');
  const image = attr(block, 'src');

  // A "Coming Soon" tile has no destination. It is still a real asset, so it is
  // published when listed above — with a null href, since there is no page.
  if (!href || href === '#') {
    const declared = PLACEHOLDERS[image.split('/')[1] ?? ''];
    if (!declared) return [];

    return [
      {
        ...declared,
        name: text(block, 'pcard__label-title'),
        location: text(block, 'pcard__label-address'),
        stage: normalizeStage(attr(block, 'data-stage')),
        involvement: attr(block, 'data-involvement') || null,
        type: attr(block, 'data-type'),
        fund: text(block, 'pcard__fund-pill') || null,
        image,
        href: null,
        legacyHref: null,
        stories: null,
        units: null,
        sqft: null,
        sqftDisplay: null,
      },
    ];
  }

  const stats = {};
  const statRe = /class="stat__value">([^<]*)<\/div>\s*<div class="stat__label">([^<]*)</g;
  for (const [, value, label] of block.matchAll(statRe)) {
    stats[label.trim().toLowerCase().replace(/\s+/g, '')] = parseStat(value);
  }

  const slug = href.split('/')[0];

  return [
    {
      slug,
      name: text(block, 'pcard__label-title'),
      location: text(block, 'pcard__label-address').replace(/\s*·\s*/, ' · '),
      view: viewFor(cardStarts[i]),
      stage: normalizeStage(attr(block, 'data-stage')),
      involvement: attr(block, 'data-involvement') || null,
      type: attr(block, 'data-type'),
      fund: text(block, 'pcard__fund-pill') || null,
      image: attr(block, 'src'),
      href: `/projects/${slug.toLowerCase()}`,
      legacyHref: href,
      stories: stats.stories?.value ?? null,
      units: stats.units?.value ?? null,
      sqft: stats.sqft?.value ?? null,
      sqftDisplay: stats.sqft?.display ?? null,
    },
  ];
});

/**
 * V3's document order is kept, except that an unnamed placeholder never
 * outranks a named asset — two "Coming Soon" tiles scattered mid-grid read as
 * gaps in the record rather than as the end of it. Sort is stable.
 */
const ordered = projects.sort((a, b) => Number(a.href === null) - Number(b.href === null));

// The figures V4 publishes are computed here, never typed by hand.
const inPipeline = ordered.filter((p) => p.stage !== 'completed');
const sum = (list, key) => list.reduce((total, p) => total + (p[key] ?? 0), 0);

const totals = {
  projects: projects.length,
  units: sum(projects, 'units'),
  sqft: sum(projects, 'sqft'),

  // "Pipeline" excludes completed assets — what the firm is actively building out.
  pipelineUnits: sum(inPipeline, 'units'),
  pipelineSqft: sum(inPipeline, 'sqft'),
  activeDevelopments: inPipeline.length,

  developments: projects.filter((p) => p.view === 'developments').length,
  investments: projects.filter((p) => p.view === 'investments').length,
  completed: projects.filter((p) => p.stage === 'completed').length,
  underConstruction: projects.filter((p) => p.stage === 'under-construction').length,
  preDevelopment: projects.filter((p) => p.stage === 'pre-development').length,
};

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify({ totals, projects }, null, 2) + '\n');

console.log(
  `projects.json — ${projects.length} projects, ` +
    `${totals.units.toLocaleString()} units, ${totals.sqft.toLocaleString()} sq ft`,
);
