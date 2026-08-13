/**
 * Rewrites root-absolute paths in a built `dist/` so the site can be served
 * from a subdirectory — specifically GitHub Pages at `/<repo>/`.
 *
 * WHY THIS IS A POST-BUILD STEP AND NOT `base` IN astro.config.
 *
 * The site is written to be served from the root of a domain, and this build is
 * a test preview living in a subdirectory instead.
 * Every link in the source is written from that root — `/portfolio`,
 * `/img/...`, `url(/fonts/...)` — and that is correct. Astro's `base` option
 * would rewrite the handful of URLs Astro itself generates, and leave all the
 * hand-written ones pointing at a root the preview host does not have: 26
 * internal links, 172 image srcsets, the fonts, the film. Setting `base` in the
 * config would also make the source wrong for production, which is the one
 * place it has to be right.
 *
 * So the source stays root-absolute and the PREVIEW is adjusted instead. This
 * runs after `astro build`, over the built output only, and nothing it touches
 * is committed.
 *
 * Usage:  node scripts/rebase-for-pages.mjs /newstreet-v4
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { readdir } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const DIST = resolve(here, '../dist');

const raw = process.argv[2];
if (!raw) {
  console.error('rebase-for-pages: a base path is required, e.g. /newstreet-v4');
  process.exit(1);
}
/* Normalised to a leading slash and no trailing one, so `${BASE}/x` is always
   exactly one slash regardless of how it was passed in. */
const BASE = '/' + raw.replace(/^\/+|\/+$/g, '');

/** Every file the rewrite applies to. */
const walk = async (dir) => {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(path)));
    else if (/\.(html|css|xml)$/.test(entry.name)) out.push(path);
  }
  return out;
};

/* `/` followed by anything that is not another `/` — which is what separates a
   root-absolute path from a protocol-relative URL (`//fonts.googleapis.com`).
   Absolute URLs carry a scheme and never match, so external links, the
   canonical, and the JSON-LD are all left alone. */
const ATTRS = /(\b(?:href|src|poster|data-src|content)=")\/(?!\/)/g;
const CSS_URL = /\burl\(\/(?!\/)/g;
/* srcset is a comma-separated list, so each candidate has to be found inside
   the attribute rather than at its start. */
const SRCSET = /(\bsrcset=")([^"]*)"/g;
const CANDIDATE = /(^|,\s*)\/(?!\/)/g;

let files = 0;
let edits = 0;

for (const file of await walk(DIST)) {
  const before = readFileSync(file, 'utf8');
  let after = before
    .replace(ATTRS, (_, attr) => `${attr}${BASE}/`)
    .replace(CSS_URL, `url(${BASE}/`)
    .replace(SRCSET, (_, head, list) => `${head}${list.replace(CANDIDATE, `$1${BASE}/`)}"`);

  if (after !== before) {
    writeFileSync(file, after);
    files += 1;
    edits += after.split(BASE + '/').length - before.split(BASE + '/').length;
  }
}

console.log(`rebase-for-pages — ${BASE} applied to ${edits} paths across ${files} files`);
