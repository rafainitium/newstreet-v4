/**
 * Converts the press spreadsheet into build-time JSON.
 *
 * V3 shipped press.xlsx to the browser and parsed it client-side with a ~450KB
 * CDN copy of xlsx.js, so the firm's strongest third-party proof was invisible to
 * search engines and blocked on JavaScript. Reading it here costs the visitor
 * nothing and makes the coverage server-rendered.
 */
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as XLSX from 'xlsx';

const here = dirname(fileURLToPath(import.meta.url));

/**
 * THE SPREADSHEET IS THE EDITORIAL CONTROL, and it now lives with V4.
 *
 * It is not archive material like the V3 photography — it is a living document
 * the firm edits to decide what appears on the site, so it belongs to the
 * project that publishes it. The V3 path stays as a fallback only so an older
 * checkout does not fail silently; it warns loudly, because two copies of a
 * file someone edits by hand is a trap.
 */
const V4_SOURCE = resolve(here, '../data/press.xlsx');
const V3_SOURCE = resolve(here, '../../NEWST V3/press.xlsx');
const SOURCE = existsSync(V4_SOURCE) ? V4_SOURCE : V3_SOURCE;
const OUT = resolve(here, '../src/data/press.json');

if (SOURCE === V3_SOURCE) {
  console.warn(
    '  ! reading the V3 copy of press.xlsx — move it to newstreet-v4/data/press.xlsx',
  );
}

const book = XLSX.read(readFileSync(SOURCE));
const sheet = book.Sheets[book.SheetNames[0]];
const rows = XLSX.utils.sheet_to_json(sheet, { raw: false, defval: '' });

const pick = (row, ...names) => {
  for (const name of names) {
    const key = Object.keys(row).find(
      (k) => k.trim().toLowerCase() === name.toLowerCase(),
    );
    if (key && String(row[key]).trim()) return String(row[key]).trim();
  }
  return '';
};

/** Excel serial dates and free-text dates both appear in this sheet. */
const normalizeDate = (raw) => {
  if (!raw) return null;
  if (/^\d{5}$/.test(raw)) {
    const parsed = XLSX.SSF.parse_date_code(Number(raw));
    if (parsed) {
      return new Date(Date.UTC(parsed.y, parsed.m - 1, parsed.d))
        .toISOString()
        .slice(0, 10);
    }
  }
  const date = new Date(raw);
  return Number.isNaN(date.getTime()) ? null : date.toISOString().slice(0, 10);
};

/** Anything a person would reasonably type in the column to mean yes. */
const truthy = (value) => /^(y|yes|true|x|1|✓)$/i.test(value.trim());

const articles = rows
  .map((row) => ({
    title: pick(row, 'title', 'headline', 'article'),
    outlet: pick(row, 'outlet', 'source', 'publication'),
    url: pick(row, 'url', 'link'),
    date: normalizeDate(pick(row, 'date', 'published')),
    /* Carried through for the lead article. The list rows do not show it — the
       List pattern is date, outlet, title — but the featured piece is set as a
       block of copy and the excerpt is what makes it read as one. */
    excerpt: pick(row, 'excerpt', 'summary', 'description') || null,
    featured: truthy(pick(row, 'featured', 'feature', 'lead')),
    project: pick(row, 'project', 'property') || null,
    ...(() => {
      const raw = pick(row, 'image', 'render', 'photo');
      const isUrl = /^https?:\/\//i.test(raw);
      return {
        image: raw && !isUrl ? decodeURIComponent(raw) : null,
        imageUrlDropped: isUrl,
      };
    })(),
  }))
  .filter((a) => a.title)
  .sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''));

/* A REMOTE Image is dropped and a LOCAL one is kept.
 *
 * The column already means both — the sheet's own Instructions say "a filename
 * in the same folder as the website, OR a full image URL". A URL is the
 * publisher's photograph on the publisher's CDN: fragile to serve, theirs to
 * licence rather than ours, and outside the manifest every image here comes
 * from. A path is our own render, which is the whole point.
 *
 * Left blank, the lead falls back to the render on the `Project` row's record,
 * so the sheet only has to name an image when the default is not the one the
 * firm wants. */
const remote = articles.filter((a) => a.imageUrlDropped);

const featured = articles.filter((a) => a.featured);
const outlets = [...new Set(articles.map((a) => a.outlet).filter(Boolean))].sort();

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify({ outlets, articles }, null, 2) + '\n');

console.log(
  `press.json — ${articles.length} articles across ${outlets.length} outlets` +
    (featured.length === 0
      ? '\n  ! no row marked Featured — the page will run without a lead article'
      : featured.length > 1
        ? `\n  ! ${featured.length} rows marked Featured — the most recent leads`
        : `\n  featured: ${featured[0].title}` +
          `\n  lead image: ${featured[0].image ?? `falling back to the ${featured[0].project ?? 'project'} record`}`) +
    (remote.length > 0
      ? `\n  ! ${remote.length} row(s) point Image at a publisher URL — ignored.` +
        '\n    Use a path to one of our own renders, e.g. Arris/Renders/Hero Render.jpg'
      : ''),
);
