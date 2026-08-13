# Hand-cropped card frames

Drop a file here and the portfolio card uses it **exactly as delivered** — no
`object-position`, no zoom, no `crops.json`. The framing decision is the file.

## Spec

| | |
|---|---|
| **Aspect** | **4:5** — this is fixed in CSS and not negotiable per card |
| **Size** | **1600 × 2000** (1200 × 1500 is the floor) |
| **Format** | JPEG or PNG, **uncompressed / max quality** |
| **Name** | the project's slug, exactly — case matters |

Upload the original. AVIF and WebP are generated here at four widths, so
pre-compressing only costs quality.

1600 × 2000 is sized for the real slot: the card is `31vw` in the three-column
grid, so a 1600px window draws it near 500px CSS — about 1000 device pixels on
a 2× display, with headroom.

## Filenames

```
Arris.jpg        The Arris
1165Clark.jpg    1165 N Clark
200WO.jpg        200 W Ohio
424.jpg          424 S Wabash
319Peabody.jpg   319 Peabody
5thpine.jpg      Fifth + Pine
100NB.jpg        East Bank Apartments
626.jpg          626 S Wabash
1810NW.jpg       1810 North Wells
6935ND.jpg       Coming Soon — confidential, keep the blur
332SM.jpg        Coming Soon — confidential, keep the blur
```

## After uploading

```
node scripts/optimize-images.mjs --only=cards/
```

Seconds, not minutes — it touches only this folder. `npm run images` rebuilds
everything and is what ships.

## Why this folder exists at all

The rest of `assets/` overrides a V3 original by matching its relative path.
That cannot work for cards: **seven of the eleven card renders are also the
hero or a gallery frame on that project's own page**, so replacing the file at
its V3 path would re-crop the project page too, at an aspect it was never cut
for.

A frame here is read by the card and nothing else. Delete it and the card falls
straight back to the project render plus its `crops.json` entry — both are left
in place, so this is reversible per project.

Partial coverage is fine. Crop the ones that need it and leave the rest.
