# Newstreet — V4

**A test build.** This is a redesign of newst.com, iterated on by the external
media team before anything goes near the live site. It is not the live site and
must not present itself as one: `site` is deliberately unset in
`astro.config.mjs`, so every page ships `noindex, nofollow` and no canonical
URL. Setting `site` to a real origin turns both back on — that is the switch to
flip on launch, and nothing else changes.

`newstreet-v4/` is the site;
`PRODUCT.md` and `DESIGN.md` govern what it says and how it looks, and they are
meant to be read before changing either.

## Running it

```bash
cd newstreet-v4
npm install
npm run dev
```

That serves the site at `http://localhost:4321`. A production build is:

```bash
cd newstreet-v4
npx astro build
```

## One thing to know before you build

`npm run build` runs three steps — `data`, `images`, then `astro build` — and the
first two read from **`NEWST V3/`, the old site, which is not in this repo.** It
holds most of the project photography and renders, and it is archive material
rather than something the new site serves.

That does not stop you working:

- `npm run dev` and `npx astro build` both work from a clean clone. The generated
  image derivatives in `newstreet-v4/public/img/` and the extracted data in
  `newstreet-v4/src/data/` are committed, so nothing needs regenerating to run
  or ship the site.
- `npm run data`, `npm run images`, and the full `npm run build` need the V3
  folder alongside this one. Ask Rafa for it if you need to re-extract project
  copy or re-encode images.

## Deploying

Vercel, connected to this repo. Import it once and every push to `main`
redeploys.

1. <https://vercel.com/new> → import `rafxaa/newstreet-v4`
2. Set **Root Directory** to `newstreet-v4` — the Astro project is a subfolder
3. Leave the rest alone. `vercel.json` already overrides the build command to
   `npx astro build`, which matters: Vercel's default is `npm run build`, and
   that regenerates data and images from the V3 archive this repo does not
   contain. Without the override the build fails on missing sources.
4. Add `RESEND_API_KEY` under Settings → Environment Variables, or the contact
   form deploys in its error state.

The first build gives a `*.vercel.app` URL that is shareable immediately.

### GitHub Pages (what is live now)

<https://rafxaa.github.io/newstreet-v4/> — rebuilt on every push to `main` by
`.github/workflows/pages.yml`. Pages serves from a subdirectory, so the workflow
runs `scripts/rebase-for-pages.mjs` over the built output to move every
root-absolute path under it. The source stays root-relative; only the preview is
adjusted. Note the contact form cannot work here — Pages is static, so there is
no serverless runtime for `api/contact.js`.

## Where things live

| Path | What it is |
| --- | --- |
| `newstreet-v4/src/pages/` | One file per route |
| `newstreet-v4/src/components/` | Shared objects — nav, footer, cards, map, partner rail |
| `newstreet-v4/src/styles/` | `tokens.css` (the scale) and `base.css` (every shared object) |
| `newstreet-v4/src/lib/` | Authored content: team bios, firm principles, partners |
| `newstreet-v4/src/data/` | **Generated.** Project records, press, image manifest |
| `newstreet-v4/scripts/` | The extractors that write `src/data/` |
| `newstreet-v4/assets/` | V4's own imagery — anything shot or exported for this site |
| `newstreet-v4/data/press.xlsx` | The press index. Add a row to publish; set `Featured` to choose the lead |

**Do not hand-edit `src/data/*.json`** — it is regenerated and your edit is
erased with nothing left to say why. Authored copy that has to survive
extraction goes in the override maps at the top of
`scripts/extract-project-pages.mjs`.

## Contact form

The form posts to `newstreet-v4/api/contact.js`, a Vercel serverless function
that mails through Resend. It needs `RESEND_API_KEY` in the deploy environment.
There is no serverless runtime under `astro dev`, so the form shows its error
state locally — that state names the direct address, so a failure still routes
the reader somewhere real.
