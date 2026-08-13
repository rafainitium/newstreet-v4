# V4 image sources

**Put new photography and renders here.** This is V4's own asset root and the
only one that should grow.

`../../NEWST V3/` is the old site, kept as reference. Its imagery is still read
by the build, but nothing new gets filed there and nothing in it is served
directly.

## How it works

`scripts/optimize-images.mjs` searches this folder **first**, then falls back to
the V3 tree. Dropping a file at the same relative path here overrides the V3
original without editing a single reference — e.g. `assets/626/Aerial.jpg`
replaces `NEWST V3/626/Aerial.jpg` everywhere it is used.

Originals live here and are never served. The build emits AVIF and WebP
derivatives into `public/img/` and writes `src/data/images.json`; pages only
ever reference the manifest, through the `Photo` component.

## Adding an image

1. Drop the file in, in a folder that names its subject — `Media/` for imagery
   not tied to one asset, `626/`, `Arris/` and so on for a specific building.
2. If it is **not** already referenced by a project record, add its path to
   `EXTRA_SOURCES` in `scripts/optimize-images.mjs`. Referencing an image that
   is in neither the records nor `EXTRA_SOURCES` fails the build rather than
   shipping a broken box.
3. Run `npm run images`.

Filenames are slugified, so spaces, `+`, and capitals are all fine.

## Size

Derivatives are generated at 400 / 800 / 1200 / 1600 / 2400 / 3200px and are
**never upscaled** — the widths are capped to your source. A full-bleed hero
wants a source **3200px wide or more**: a 1440px window on a 2× display asks for
2880 device pixels, so anything smaller is stretched by the browser. Past
~3600px is wasted; the script downsizes anyway.

The 3200 tier is only ever chosen by a 2× display, which draws it at about half
its nominal size, so it is compressed harder than the 1600–2400 tiers on
purpose. Do not read that as the top tier mattering least — it is the one a
retina laptop actually gets.

Upload the uncompressed original. AVIF and WebP compression happens here, and
pre-compressing first only costs quality.
