---
name: Newstreet V4
description: An institutional offering document rendered for the screen — monochrome, banded, and set at reading size.
colors:
  ink: "#0e0e0e"
  ink-soft: "#4a4a4a"
  ink-faint: "#8a8a8a"
  ink-hover: "#333333"
  paper: "#FFFFFF"
  paper-band: "#f4f4f4"
  dark: "#141414"
  dark-band: "#1e1e1e"
  on-dark: "#f4f4f4"
  on-dark-soft: "#9a9a9a"
  rule: "rgba(0,0,0,0.12)"
  rule-strong: "rgba(0,0,0,0.24)"
  rule-on-dark: "rgba(255,255,255,0.16)"
  stage-pre: "#a8a8a8"
  stage-construction: "#6a6a6a"
  stage-completed: "#0e0e0e"
typography:
  wordmark:
    fontFamily: "Nohemi, sans-serif"
    fontSize: "21px"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "-0.075em"
  figure:
    fontFamily: "'Libre Caslon Display', Georgia, serif"
    fontSize: "clamp(42px, 5.2vw, 72px)"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "-0.01em"
  display:
    fontFamily: "'Libre Caslon Display', Georgia, serif"
    fontSize: "clamp(26px, 2.6vw, 38px)"
    fontWeight: 400
    lineHeight: 1.18
    letterSpacing: "-0.005em"
  display-sm:
    fontFamily: "'Libre Caslon Display', Georgia, serif"
    fontSize: "clamp(19px, 1.5vw, 22px)"
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: "-0.005em"
  body:
    fontFamily: "'Libre Franklin', system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.62
    letterSpacing: "0"
  body-sm:
    fontFamily: "'Libre Franklin', system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.62
    letterSpacing: "0"
  label:
    fontFamily: "'Libre Franklin', system-ui, sans-serif"
    fontSize: "10px"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "0.18em"
rounded:
  none: "0"
  pill: "999px"
spacing:
  hair: "4px"
  xs: "8px"
  sm: "12px"
  md: "20px"
  lg: "32px"
  xl: "56px"
  band: "clamp(64px, 8vw, 120px)"
  gutter: "clamp(20px, 4vw, 64px)"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "18px 32px"
  button-primary-hover:
    backgroundColor: "{colors.ink-hover}"
    textColor: "{colors.paper}"
  button-primary-on-dark:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "18px 32px"
  link-action:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    padding: "0"
---

# Design System: Newstreet V4

## Overview

Newstreet's site is built as **an institutional offering document rendered for the screen**, not as a developer marketing page. The reference world is the printed material an LP actually reads before committing capital: offering memoranda, annual reports, ruled financial tables. That world is monochrome, dense, and set at reading size — its authority comes from disclosure and precision rather than from scale, color, or motion.

**Mode: Persuade.** The visitor is an LP or prospective investor doing due diligence. Success is that they request information.

It refuses the multifamily-developer defaults: lifestyle adjectives, amenity photography standing in for substance, and an oversized hero making a vague promise. Project imagery is welcome — the hero is a carousel of the firm's own work — but every image is captioned with what it actually is.

**Inherited from V3 and binding:** the navigation's transparent-to-dark scroll transition, and the Nohemi wordmark. Nothing else. V3's hero — a centred 96px `forma-djr-deck` headline over drone video — was retired because it made the first viewport read as a different firm than the page beneath it.

### Building a new section

Four decisions, in order. Everything else follows from them.

1. **Ground** — alternate from the previous band. Never two of the same adjacent.
2. **Layout** — Split, Paired, or Stacked header. Chosen by what sits beneath the header, not by taste. See Layout.
3. **Kicker** — only if the section belongs to a named division. Most sections open on the heading.
4. **Rule** — only at the band edge, the foot of a stacked header, and between list rows.

## Colors

**The palette is monochrome. There is no accent hue anywhere on the site — black, white, and neutral grays only.** This is a brand commitment, not a stylistic preference, and it holds for data, states, indicators, hover, focus, and selection as much as for text and ground.

Every value is a true neutral: red, green, and blue channels are equal in every token. A near-black with a blue cast or a gray with a warm cast both violate this — subtly, but visibly across large fields.

| Role | Token | Use |
|---|---|---|
| Text, full strength | `ink` | Headings, figures, titles. Never grayed. |
| Text, secondary | `ink-soft` | Body copy in supporting position |
| Text, metadata | `ink-faint` | Dates, captions, as-of notes, kickers |
| Ground | `paper` / `paper-band` | Alternating section bands |
| Ground, inverted | `dark` / `dark-band` | Close and footer only — two dark regions per page maximum |
| Hairline | `rule` / `rule-on-dark` | The three permitted positions in Layout |

**The primary action takes the highest contrast available**, so it inverts by ground: `ink` on light bands, `paper` on dark. In a monochrome system contrast is the only emphasis there is — spend it on the one action that matters.

**Stage indicators are a value ramp, not a hue set.** `stage-pre` (light) → `stage-construction` (mid) → `stage-completed` (ink). The ramp itself encodes progression toward completion. It maps one-to-one onto the portfolio's `data-stage` values and may not be reused for anything else.

If a new state needs distinction, use value, weight, rule, or position. Never reach for a hue.

**Verify mechanically.** In the browser, walk every element's computed `color`, `backgroundColor`, `borderColor`, and `outlineColor`; anything where `max(r,g,b) - min(r,g,b) > 6` is a violation. The correct result is zero.

## Typography

Three families, tightly scoped. Nohemi is brand-binding and must not spread beyond the wordmark.

| Face | Scope |
|---|---|
| `Libre Caslon Display` | All display type and all published figures |
| `Libre Franklin` | All body copy, labels, tables, UI |
| `Nohemi` | The wordmark only — nav and footer |

Murecho, Inter, and forma-djr-deck are removed. The Adobe Typekit dependency went with forma-djr-deck; restoring that face means restoring the kit load.

| Role | Size | Used for |
|---|---|---|
| `figure` | 42–72px | Published numbers. The largest type on the site. |
| `display` | 26–38px | Section headings |
| `display-sm` | 19–22px | Column headings, list titles |
| `body` | 14px | All prose |
| `body-sm` | 13px | Captions, footer, metadata |
| `label` | 10px | Kickers, nav, buttons, column headers, stage tags |

Rules:

- **Set small.** The authority of this world comes from restraint at reading size, not from scale.
- **A figure must be clearly larger than a heading** — 72px against 38px reads as the primary claim; sized close to a heading it reads as a caption. Figures always carry a unit label and an as-of date.
- **Labels are letterspaced small caps in Franklin** at `0.18em`, and always set `line-height: 1`. The 1.62 body line-height inflates a 10px label into a 16px line box, which silently drives container heights.
- Tracking floor is `-0.01em`, used only by figures. Display type sits near `-0.005em` — do not tighten toward V3's `-0.075em`, which is what made the old site read as tech-forward. The wordmark keeps that tracking because it is the logo.
- Body measure caps at 68ch.

## Layout

**A 12-column grid** inside a `gutter` page inset, with content capped at 1440px.

**Sections are bands, not boxes.** Each is a full-width band of `paper` or `paper-band` with a `rule` hairline on its top edge. Alternation is structural — it signals a change of subject, so never place two same-ground bands adjacent. The alternation starts at the first section *after* the introduction: the intro is the only band before anything has alternated, which is what makes it read as the page's opening statement.

### Rules are horizontal only

A hairline is allowed in exactly three places, and nowhere else:

1. **The band edge** — on the ground break, marking the section boundary.
2. **The foot of a stacked header** — separating it from the full-width content it introduces.
3. **Between list rows** — press, news, any dated index.

**Vertical rules are banned.** Horizontal *and* vertical rules together turn a page into a table, which was the original eyesore. Multi-column groups — figure rows, phase grids, column sets — are held apart by `gap` alone.

### Three section layouts

Chosen by what sits beneath the header, never by taste.

- **Split** — kicker in columns 1–3, content in columns 6–12. Use when the section is text with no full-width content beneath it. The wide open middle is the composition; it is not space waiting to be filled.
- **Paired** — image in columns 1–6, text in columns 8–12, vertically centred. The split layout with its open left column filled. The kicker moves inline above the heading rather than sitting alone on the left. **Use the shared `.paired` / `.paired__figure` / `.paired__text` classes — never hand-roll the geometry.** Two paired sections built separately drift on column span, alignment, and kicker placement, then read as different patterns doing the same job. The only legitimate per-section override is `object-position`, for a specific photograph's crop.
- **Stacked header** — kicker, heading, and intro stacked together on the left, capped at 46ch, with an optional action link at the far right and a rule at the foot. Use whenever a full-width grid or list follows. A split header above full-width content reads as a mismatch: its right-hand alignment answers to nothing below it.

### Rhythm and images

- `band` padding at section level, `xl` between blocks, `md` inside groups. More space above a heading than below it.
- Sections are exactly as tall as their content needs. Density is the point; whitespace is earned, not applied uniformly.
- **Images are contained, not full-bleed.** A photograph occupies grid columns within its band. Running one to the viewport edge makes it the loudest thing on the page, and the hero already holds that role.
- Breakpoints: **1100 / 900 / 640.** At 1100 content shifts to columns 5–12; below 900 split and paired sections stack and the kicker moves inline above the heading; below 640 figure rows become a two-column grid, never a horizontal scroll.

## Elevation & Depth

**There is effectively no elevation.** This is a printed document; depth is expressed by ground color and rule, not by shadow. No drop shadows, no glass, no gradient text.

**No soft dark form behind type, by any mechanism.** The ban covers the effect, not the property: a `text-shadow`, a `filter: drop-shadow`, and a radial gradient positioned under a lockup are the same halo, and the last two have both shipped here by passing the letter of the rule above. **Legibility over imagery comes from grading the whole frame evenly, then measuring** — a flat mute at a single alpha, plus edge weighting that is clear through the middle. A scrim whose shape tracks the shape of the type is a drop shadow.

Where a label genuinely cannot sit on the image — a name over live map tiles — it gets a **flat ground**, not a glow: paper, square, tight padding, the same device as the map mark's paper ring.

**Set the alpha from a measurement of the asset, not by eye.** Sample the region the type occupies and take the 95th percentile of relative luminance; white type wants ≥4.5:1 against it. On the home hero that is 0.61, which is what puts the mute at `0.46`.

The single exception is the navigation bar, inherited from V3: on scroll a translucent dark bar (`rgba(18,18,18,0.78)`) with a 16px backdrop blur slides down from above, and a hairline expands from centre to full width. That blur is a specific inherited effect, not a licence to use glass elsewhere.

**Nothing animates a layout property** — no width, height, padding, or margin transitions anywhere. The nav is a fixed height for exactly this reason. Motion is limited to `opacity` and `transform`.

## Shapes

Everything is square. `rounded.none` is the default and applies to buttons, inputs, images, and media. The only exception is `rounded.pill`, reserved for the fund tag inherited from V3 — which lives on the project page, not on a card, and is the one rounded object on the site.

Images sit flush within their column — no radius, no border. Stage indicators are 5px square dots, not circles.

**No glass outside the nav.** `backdrop-filter` belongs to the inherited nav bar and nowhere else; a blurred chip floating on a photograph is the V3 habit this system replaced.

## Components

### Established

- **Nav** — fixed height (58px), white text over the hero; `.is-scrolled` triggers the inherited dark bar and expanding hairline, and nothing else changes. Four top-level items maximum: Portfolio, Firm, Press, and the Investor Relations action. Firm is a dropdown holding About the Firm, Investment Strategy, and Team; it opens on hover and `:focus-within`, keeps `aria-expanded` in sync, and closes on Escape. **Investment Strategy has no route of its own and opens the investors page at the top** — it pointed at `#lifecycle`, and a nav item that drops a reader into the middle of a page whose hero they never saw reads as a mis-load rather than as precision. The nav and the footer carry the same label, so they carry the same destination.

  **A band arrived at by anchor clears the nav.** The bar is fixed, and a fragment link scrolls its target to viewport 0 — which buries the band's kicker and the top of its heading underneath it. `.band[id]` takes `scroll-margin-top: var(--nav-height)` off the same token the first-band layout clearance reads, so the two cannot drift. It belongs to the band, not to the handful of links that point at one. **The wordmark is the tallest element in the bar** — no nav item may exceed it, since a taller item silently sets the bar height.
- **Hero** (home only) — full-bleed carousel of four project images, 6s hold and 1.6s cross-fade. No wordmark, no headline, no tagline. The only type is a caption naming the asset, at the lower left on the page grid, with a **line timer** beside it filling left to right and restarting on each advance. Captions identify, they do not sell: `1165 N Clark St.`, `The Arris — Interior`. Overlay is weighted top and bottom only, for the nav and the caption. Reduced motion holds the first frame and hides the timer.
- **Snapshot** — the figure display. Compact stacked header (kicker left, as-of date right, rule at the foot), then four cells each a `figure` number over a `label` caption, with a derivation note beneath. **The cells hug their content and distribute across the full measure** — first flush to the left margin, last flush to the right, `gap` as the minimum separation rather than a fixed one. Equal-width cells cannot do this: the labels are unequal, so a short last label leaves the right margin open and the whole row reads as left-aligned against the project grid above and below it, which does reach both edges. Labels sit on one line. It sits **below** the firm introduction, never above it — the visitor meets the firm before its numbers.
- **Section kicker** — a `label` naming a division. One per section maximum, and only where the section genuinely belongs to one.
- **List** — press, news, any dated index. Row = stacked date/outlet, title, trailing arrow, separated by a hairline and a hover ground.
- **Project card** — image at 4:5, name at `display` scale, location, stage dot, all set on the page ground beneath the image. **No unit, story, or square-foot figures on the card**, and no fund tag; those belong on the project page. **Type never sits over the photograph.** V3's index put white type on a gradient scrim over each tile, which made an index of the same projects read as a different site than the home page that shows them. **Use the shared `ProjectCard` component — never hand-roll a card.**

  **The card is not one large anchor.** The name carries the link and its `::after` covers the card, so hovering anywhere runs the name's hover and the card still holds exactly one link. Wrapping the whole card in an anchor would rule out ever adding a second one — an anchor inside an anchor is invalid.

  **Hover: a rule wipes in under the name, left to right, and the supporting type darkens.** The rule is drawn as a `background-image` gradient animated on `background-size`, not as a bordered or positioned pseudo-element — `background-size` is not a layout property, so nothing around it moves, which the no-animated-layout rule requires. The name itself does not change color: it is already `ink` and has nowhere darker to go, so the location and stage carry the darkening and the card reads as coming forward. The rule hangs on the **name**, not on the link — a placeholder has a name and no link, and gets the identical hover. Only the navigation is withheld; a dead tile sitting in a live grid reads as a broken one.

- **Coming Soon card** — an asset the firm holds whose address it has not released. Same card and the same hover; the only thing withheld is the link. It counts in the published totals like any other asset, because it is one. Placeholders sort after named assets in every index — scattered mid-grid they read as gaps in the record rather than as the end of it. Which placeholders are published is declared in `PLACEHOLDERS` in `scripts/extract-projects.mjs`; V3 carries more of them than the site shows.

- **Project page** — one template at `src/pages/projects/[slug].astro`, driven entirely by `project-detail.json`. **Nothing on this route is hand-written per project**, which is what keeps nine pages from drifting into nine designs. V3's sequence is kept — hero, summary, facts, gallery, close — and what changed is what came out.

  Removed from V3, each for a stated reason: the **counting animation** on the figures (they are facts, not a reveal); the **vendor logos** beside the project team (colored marks in a monochrome system, and the names carry the information); the **lightbox** (nothing in a render needs opening full-screen); and the gallery's **hover zoom** (it promises a click that is not there once the lightbox is gone).

  **The hero is full-bleed and full-height** — the project is the page's subject, so it holds the role the carousel holds on the home page. Caption at the lower left on the page grid, overlay weighted top and bottom only. Height is `100svh` before `100vh` so mobile browser chrome cannot push the caption off-screen. This and the home hero are the only full-bleed images on the site.

  **The team and the figures are two blocks, side by side, each under its own heading** — who built it on the left, what it is on the right, held apart by gap and never by a rule. This is V3's arrangement and it is load-bearing: folding the text rows ("Retail Tenant", "Hotel Brand") in with the team dissolves both, and the team stops being a group a reader can pick out. Those rows are project facts and belong with the figures. Stacked full width instead of paired, the whole section reads as one undifferentiated table.

  Team rows **stack** (role above party) because a firm name is not a value to compare down a column. Figure rows **range right**, so the values land on a shared right edge — that edge is what the eye runs down, and it is what makes the section scannable at a glance.

  **Project figures are set at `display` scale, not `figure` scale.** `figure` is reserved for the firm's published headline numbers in the home Snapshot; these are spec values, large enough to pull the eye down the column without claiming to be the largest type on the site. A non-numeric value drops to `display-sm` — a tenant name must not read as a number.

- **Gallery** — `src/components/Gallery.astro`. A **horizontal rail**, and the one place on the site where a section is read by scrolling sideways. V3 scrolled its renders and V4's first pass replaced that with a two-column grid; the grid was the wrong trade and the rail is the rule. A set of eight renders in a grid becomes a tall stack the reader falls through on the way to the Close, and it puts the images in a column of decreasing interest. In a rail the set is one gesture, and the reader who stops after two has still seen the section rather than skipped it.

  **What makes it a set is a shared height, not a shared ratio.** Every card is one height and every image keeps its native proportion — a portrait tower stays a portrait, a street view stays wide. The forced 3:2 crop that preceded this flattened the one thing a tower render is about. The card is sized *by* the image: height is fixed, width falls out of the intrinsic ratio `Photo` already writes onto the tag, so nothing has to be declared per project and nothing shifts on load. Note that `base.css` caps every image at its container's width, which here would squash the wide frames — the rail's images set `max-width: none`.

  **The rail bleeds to the viewport edge, and the first card lands on the page grid.** A rail that stops short of the edge reads as a grid that ran out of room; one the edge cuts off reads as a set that continues. The left padding is `calc(var(--gutter) + max(0px, (100% - 1440px) / 2))` so the first image shares its left edge with the section header and every other edge on the site, and `scroll-padding-inline` repeats it — snap positions are measured from the snapport, not the padding box, so without it every card after the first snaps a gutter left of the grid. Snap is `x mandatory` with `scroll-snap-stop: always`, so a hard flick lands on the next image rather than three downstream.

  **It stays on `paper`, where V3's gallery was dark.** The Close is this page's dark band; a dark gallery immediately above it merges the two into one unbroken field and the Close stops reading as the page's final move.

  **Controls are square, and they appear only when they do something.** No circles — the system's stage mark and primary action are both rectangles — and they invert on hover on the same principle as `.action`. At either end the button disables in place rather than disappearing, which would shift the pair sideways every time the reader reaches an edge. The buttons and the progress line are hidden until the script confirms the rail overflows: a project with one render has nothing to page through. This is progressive enhancement on the same terms as the portfolio map — the rail is a real scroll container by touch, trackpad, and arrow key before any script runs.

  **The buttons step an intended index; they never ask where the rail currently is.** A smooth scroll takes a few hundred milliseconds, and a reader clicking twice inside that window is normal. Deriving the next card from a live `scrollLeft` reads a position still in flight, concludes the next card is the one already being travelled to, and restarts the same animation — the rail sticks on the second image however often it is clicked. The index is re-derived from the rail only once a scroll has *settled*, which is also what keeps it right when the reader pans by hand.

  **Position is shown on the same hairline the home hero uses for its slide timer**, here carrying distance instead of time. Its width is the share of the set on screen, so it reports how much is left as well as where the reader is, and it is driven by `transform` alone — a scroll indicator must not animate a layout property.

- **The map runs on one route: About the Firm.** It closed the portfolio index too, under "Concentrated by design", and that band is out — the index *is* the record this page exists to show, and plotting it again geographically restated the grid and pushed it further from the foot of the page. `ProjectMap` keeps `portrait` and `collapsible` on: a 3:4 frame, and criteria that expand. The tall frame is the Chicago assets' own proportion — they span roughly 3.7× further north–south than east–west along the lakefront, so a square wastes its width and leaves the markers in a ribbon down the middle. Should a second route ever want a map, it renders this component with these props; two maps that behave differently is the thing to avoid.

- **The map band** — a `paper` band: the map in the Paired figure slot, and the heading, lede, and criteria in the text slot. **The marker is the stage indicator** — the same square on the same value ramp as the cards and the filter, read from the tokens at runtime so the two cannot drift. A reader who has learned the ramp once needs no second legend.

  **The map is ours, not rented.** Leaflet renders it over free OpenStreetMap-derived tiles, so it needs no API key, no billing account, and no per-load fee. Google was evaluated and rejected on the design system, not on price: its logo, Terms link, and controls cannot be restyled or removed under the Maps ToS, and only its billed JavaScript API can apply a style at all — the free embed iframe cannot be styled and cannot carry custom markers. Owning the render is what makes the zoom control square and inked instead of a rounded white chip with a shadow.

  **Tiles are forced neutral** with `filter: grayscale(1)` on the tile pane. A basemap's water and parkland always carry a faint cast, and the filter holds the palette no matter what the provider ships, including after they restyle without telling us. Two further hues had to be run down by hand: Leaflet paints every anchor inside the map `#0078A8`, which inherits straight into the markers, and its flag mark is set `display: inline !important` so it cannot be hidden — it is desaturated instead, which keeps the mark and drops the hue.

  **Progressive enhancement, not a spinner.** The server renders `MapSchematic` — a real SVG map — and Leaflet replaces it on load. With JavaScript off or the tile host unreachable, the schematic *is* the map, so it has to stand on its own.

  **Attribution is required by the tile licence.** The OpenStreetMap and CARTO credits stay. Set them quietly; never hide them.

  **Wheel zoom is engaged, not always on.** Scroll zoom stays disabled until the map is clicked or focused, and stands down when the pointer leaves. Always-on scroll zoom traps the reader — they scroll down the page, the cursor crosses the map, and the page stops moving while the map zooms instead. A quiet label says so and retires itself once the map is live.

  Two Leaflet specifics worth knowing before editing this component:

  - It promotes the canvas element **itself** to `.leaflet-container` rather than adding a child, so container styling belongs on `.map__canvas` directly. A `.map__canvas .leaflet-container` descendant selector silently matches nothing.
  - It stacks its panes at `z-index: 400` and its controls at `800–1000`, far above the nav's `100`, so the zoom buttons scroll straight through the navigation bar. `isolation: isolate` on `.map__canvas` confines the lot in one line — do not remove it, and do not try to fix it by lowering Leaflet's z-indexes one at a time.

- **Geography is authored, and approximate.** `src/data/geo.json` holds a latitude and longitude per asset, derived from the street addresses printed on the V3 project pages using the Chicago street grid. It is accurate to about a building and is **not survey data** — the caption says so on the page, and it must keep saying so. An asset with no entry appears nowhere, which for the Coming Soon placeholders is the entire point.

  **The map answers to the filters.** It shows exactly the set the grid shows and reframes to it — a map displaying every asset while the grid is filtered to Investments would put the two in plain contradiction on the same screen. The filter script dispatches `portfolio:filter` with the visible slugs and the map listens; the map also reads the grid directly on load, so it is correct whichever of the two scripts runs first. The no-JavaScript schematic cannot filter and shows the Chicago assets whole — acceptable, because without JavaScript the grid does not filter either.

  **Every located asset is plotted; the Chicago extent is the opening view, not the contents.** Nashville, Michigan City and Aurora all carry markers — `fitBounds` simply frames the Chicago subset, because fitting all nine opens on a view of the Midwest in which no individual asset reads. The fixed-viewBox schematic is the one exception, since it can only draw what fits its frame.

  **The caption names the out-of-market cities, and that naming is load-bearing.** It is the only in-page signal that markers exist beyond the opening view, so it is built from `geo.json` rather than typed — add or drop an out-of-market asset and the sentence follows. Remove it and the map silently loses three assets. It belongs in the caption rather than in the highlights beside the map: the highlights are the firm's criteria, and this is instruction on how to read the map.

  **Labels appear only when they can be read.** Below zoom 12 the Chicago assets sit within a few pixels of each other and their names stack into a smear, so the marks speak alone and the type returns on the way back in. The name stays on each marker's `aria-label` throughout.

- **Crops are art direction, declared per project.** Every render frames its building differently — roofline height, horizontal mass, how much sky sits above it — so a shared 4:5 frame alone does not make a row of cards agree. `src/data/crops.json` holds a `position` and a `scale` per slug, tuned by eye against the live grid. It is authored, not extracted: it never comes from `projects.json`, and `projects.json` never gains a crop field.
- **Projects grid** — the layout for any index of work, on the home page's featured set and the portfolio index alike: three equal columns held apart by `gap`, 2-up below 900 and 1-up below 640. It is the `.projects` class in `base.css` and it is the *only* geometry a project index gets. Uneven or alternating tile widths are not available: a mosaic makes the largest tile read as the most important asset, which is a claim the record does not make.
- **Portfolio index** — two bands. A **Split** introduction states what the record is and how to read it, its counts derived from `projects.json`; then a `tint` band whose first element is the filter bar, followed by the projects grid. **The index band carries no header of its own.** The introduction above already names the page, and the view toggle already says which set is on screen — a heading there restated one or the other. Filters are stage × asset type as expandable groups with a developments/investments toggle at the left, selection shown by an underline rather than a filled chip, and a reset that appears only once something is selected. An empty result is stated in words beneath the grid; nothing else counts results.
- **Leadership** — Paired layout, team photograph at native 3:2 with no crop. **No names or roles beneath the photograph.** A row of names under a row of faces reads as captions and will misidentify people the moment the photo changes; attribution belongs on the Team page.
- **Team** — `src/pages/team.astro`, and **the one place names attach to faces**. Half-height hero, then the people. The hero image is the team itself — the one subject this page can open on without changing the subject — so the hero carries the `h1` and names the page.

  **The people band carries no header of its own**, on the same principle as the portfolio index: the hero above already names the page, and a heading over the three cards would only restate it. A Split introduction stood between the two and is out pending copy; if it returns, it returns as a Split band above the people, flush to the hero, and the people band gives up `flush-top`. **The partners close About the Firm, not this page**: a second set of names beneath the three the page exists to give competes with them, and the marks are an argument about the firm rather than about who is in the room.

  Three cards on one shape, headshots at a shared **4:5** — they arrive at different crops, and a shared frame is the only thing that makes three portraits read as one team — held at `center 22%` because faces sit high in a portrait and centring drops foreheads.

  **Bios are verbatim from V3** and live in `src/lib/team.js`. This is the one page where a person's own description of themselves is the content, so it is not rewritten into a house voice. They sit behind the shared disclosure at label scale: V3 marked each member with a `+`, and this is that affordance built as the system's object rather than a bespoke one.

- **Press** — `src/pages/press.astro`. Half-height hero, a **lead article**, then the **List** pattern grouped by year, then a media Close.

  **`newstreet-v4/data/press.xlsx` is the editorial control, and it lives with V4.** It is not archive material like the V3 photography — it is a living document the firm edits to decide what the site shows — so it belongs to the project that publishes it. Add a row to publish, delete a row to remove, set **`Featured`** to `yes` to choose the lead. The V3 path remains only as a warning-loud fallback; two hand-edited copies of one file is a trap.

  **The lead is set as copy, not as a bigger row** — outlet and date, headline at display scale, and the sheet's `Excerpt`, which the index rows deliberately do not carry. It is pulled *out* of the year index rather than repeated in it: the same headline twice on one screen reads as a mistake, not as emphasis. No row marked Featured and the page simply runs without a lead; more than one and the most recent wins.

  **The sheet's `Image` column is deliberately unused.** It holds the publisher's own photograph, usually hotlinked from their CDN — fragile to serve, theirs to licence rather than ours, and against the rule that every image on this site comes from the local manifest. Third-party coverage is the one claim on the site the firm does not make itself, so the page gets out of its way: no pull quotes, no logo wall, no excerpting. **Every row leaves the site** — new tab, `rel="noopener"`, an outbound `↗` rather than the site's own `→`, and a visually hidden "opens in a new tab". Counts and outlet names are derived from `press.json`; nothing is hand-typed. V3 loaded press from an xlsx in the browser, so none of it was server-rendered or indexable — this is built at build time and is.

- **Contact** — `src/pages/contact.astro`. Half-height hero, then the Split grid: the firm's own details in the open left column, the form in the main column. **No Close band** — the page is the close, and a second action here would compete with the one that matters. V3's four inquiry routes are kept, because a firm serving four audiences from one inbox should say which is which, and the routing is what makes the reply feel addressed.

- **Form** — the objects live in `base.css`, and this is the surface that was deferred until the contact page needed it.

  **A field is a label over a rule.** No boxes: a bordered input is a rectangle drawn around nothing, and this system already holds that an edge comes from a ground change or a horizontal hairline. Focus doubles the rule with an inset shadow rather than a border-width change — border-width is a layout property, and this system does not animate one. Required fields are unmarked and **optional ones say so**; an asterisk on four of five fields is noise.

  **The palette has no error hue, by brand commitment — so errors are carried by weight, rule, and position.** The rule goes to full-strength ink, the label stops being faint, and the message sits directly beneath the field it belongs to. Nothing here may ever depend on color alone, because there is no color to depend on. Validation runs on submit, then re-checks a field only once it has already failed: nagging a reader mid-typing is worse than saying nothing.

  **Selection is an underline, not a filled chip** — the same device the portfolio filter uses. Native radios keep the keyboard behaviour and the grouping for free; only the mark is ours.

  **The form posts to `/api/contact`** — V3's Vercel serverless function, ported to `newstreet-v4/api/contact.js`, which mails through Resend. It needs `RESEND_API_KEY` in the deploy environment, and there is no serverless runtime under `astro dev`, so the form shows its error state locally. That state names the direct address, so a failure still routes the reader somewhere real.

- **About the Firm** — `src/pages/about.astro`. The investors page's shape on purpose: half-height hero, then bands alternating ground. The sequence is **values → advantage → markets → partners**, and it is an argument rather than an inventory: the advantage is what the values produce, the criteria are the values written as numbers, and the partners are the parties who have done the work those criteria select.

  **The advantage band is the firm's proprietary infrastructure, and it is one claim rather than a list.** Two inputs — market intelligence and broker relationships — feed a single sourcing function, and **the lede states what they produce together before the columns arrive**. That claim used to close the band instead, in a paragraph beneath the pair; carried in both places it was one sentence said twice, so the closing line is gone and the lede holds it. It is the page's one `dark` band because it is the strongest differentiating claim on the site.

  The markets band reuses **`ProjectMap`**, the same component the portfolio index closes on. With no filter grid on the page it falls through to plotting every located asset, so the two maps cannot drift into two different maps. The underwriting criteria sit in its `highlights` slot and the band exits to `/portfolio`.

  **The lede states the principles; the criteria below are the detail.** It once ended by counting them — "an asset has to clear all four of the following" — which tied the prose to the length of a list it does not own. The copy now names the principles in its own words and the `highlights` slot stands on its own, so a criterion can be added or dropped without a sentence elsewhere going wrong. The band is also where the site says the firm expands beyond Chicago; `/portfolio`'s map band already allows for it ("opportunistic when exceptional opportunities emerge beyond them"), so the two agree.

  **Partners are the firm's own published list**, carried over from V3's home-page carousel and held in `src/lib/partners.js` — not assembled here, because PRODUCT.md forbids implying relationships that do not exist. Every mark links to the party's own site: a logo with nothing behind it is decoration, and a reader should be able to check.

  They run as a **rail**, and they are `src/components/Partners.astro` — a component, not page markup, because the set is one object and two hand-kept copies of it drift. A host page decides one thing, `ground`, since bands alternate and the band above sets which value it takes. Fifteen marks stacked in a block read as a logo wall; along one line they read as a list of firms. It scrolls by touch, trackpad, arrow key, and the shared `.rail-btn` control — **never on its own**. V3 auto-scrolled this carousel; nothing on V4 moves without the reader asking, and a moving target is a poor thing to have to click.

  **The marks are trimmed upstream and bounded here.** `optimize-images.mjs` trims every partner logo to its own bounding box — six shipped as 1:1 canvases with the wordmark floating in the middle, which at a fixed height renders a few unreadable pixels. Even trimmed they run from 0.72:1 to nearly 18:1, so the frame bounds **both** height and width and lets `object-fit: contain` decide; a locked height alone would render the widest several times the width of the narrowest. Marks drawn in a light colour are forced black rather than given a ground of their own.

  **The Close is contact, not the investor package.** A reader here is deciding whether to talk to the firm; the offering lives on the investors page, which this Close links to as a secondary action. One primary action still, as everywhere.

  **`firm.js` is the source for values, the advantage, and the criteria** — the home page states the advantage in summary from the same list.

  **Two things on this page are drafts and must not launch as written**: the four values are placeholders in the firm's voice, and the hero image is a stand-in. Both are marked in place.

- **Investor Relations** — `src/pages/investors.astro`, the page the whole site funnels toward and the destination of the site's one primary action. Six bands, alternating ground so no two neighbours share one: introduction (Split), the lifecycle, the principles, reporting, the FAQ, and the Close. No hero image — this is a document, not a pitch, and it opens on the same Split introduction the portfolio index opens on.

  **The sequence is principles → lifecycle → reporting → FAQ, and the order is the argument.** The principles come first because the lifecycle reads as a set of steps until you know what each step is being judged against; reporting follows the process because it is what the process produces; the FAQ cleans up what the three sections left open. Reporting uses the **Paired** layout — the asset on the left, what you are told about it on the right, with the deliverable groups stacked under the prose in the text column.

  **`#lifecycle` and `#request` are link targets other pages depend on.** Every project page links `/investors#request`, and the home page's lifecycle section links `/investors#lifecycle`. Neither id may be renamed without following its inbound links.

  Built from the client's wireframes with three departures, each confirmed before building rather than taken quietly. The wireframe's **vertical rules between columns** are dropped — this system holds columns apart by space, and that ban is what keeps a page from reading as a table grid. The wireframe's **bordered boxes** around the four reporting groups are dropped for a hairline over each group's label: a horizontal rule opening a set is the system's device, a box around a column is not. And the principles lose their **01–03 marks**, because in this system a number means order — that is the whole reason the lifecycle carries one — and the principles have no order to state.

  **The primary action is `mailto:info@newst.com`, not a form.** The address is the one published across all six V3 pages. A Request Information form would mean establishing inputs, validation, and error states — a surface this system has not defined, on the one page that cannot afford to look provisional. The mailto is the honest interim, and it is a real action rather than a dead button.

- **Columns and Phases** — the two objects any set of peers uses, both in `base.css` so no page can grow its own. `.columns` is an **unnumbered** set (the Newstreet difference at 4-up, the investment principles at 3-up via `.columns--3`); `.phases` is a set **in order**, and the number is the only thing that separates them. The phase copy itself lives in `src/lib/firm.js` and is imported by both the home summary and the investors page — six phases stated twice become two different six phases within a quarter.

- **Disclosure** — `.disclose` in `base.css`; native `<details>`/`<summary>`, never a scripted accordion. It opens with no JavaScript, is keyboard operable for free, and prints open. Rows are separated by hairlines and the **whole row is the control**, so the target is the full width rather than the glyph. The mark is **drawn, not typed**: two 1px bars, the upper one rotating from 90° to 0° so a `+` becomes a `−`. A glyph swap cannot rotate, and this system animates transforms rather than swapping content.

  **One object, two scales.** The investors page runs it twice — the FAQ at question scale and the reporting list at label scale via `.disclose--compact` — and it is defined once precisely because a page may carry more than one. Two accordions that behave differently on the same page are two interactions the reader has to learn.

  **Where a set is collapsed, the first row opens by default.** A column of closed rows shows the reader nothing about what a row contains and reads as an empty section. FAQ answers state only what the firm has already committed to elsewhere — a question a page cannot answer honestly does not get a drafted answer.

- **Close** — the page's final action. Lede on the left (kicker, heading, body, no button) and an inset well on the right carrying the sign-up copy and the single primary action. The well is a **darker ground, not a bordered card** — the ground change carries its edge.
- **Primary action** — solid rectangle, `label` type, inverting by ground. **One per page**, and it lives in the Close. Everything else is a `link-action` with a trailing arrow.
- **Asset roots** — V4 owns `newstreet-v4/assets/`, and it is the only root that grows. `NEWST V3/` is the old site kept as **reference material**: the build still reads its archive photography, but nothing new is filed there and nothing in it is served. `optimize-images.mjs` searches V4 first, so dropping a file at the same relative path in `assets/` replaces a V3 original everywhere it is used without editing a single reference. Originals are never served — `public/img/` holds only generated derivatives, and derivatives are **never upscaled**, so a full-bleed hero needs a source of 2400px or wider to get the top tier.

- **Photo** — the only way an image is rendered. Reads the manifest from `scripts/optimize-images.mjs` and emits AVIF with a WebP fallback, a width-based `srcset`, and real `width`/`height` so nothing shifts on load. **Never write a raw image tag or a `/img/` path.** Pass a `sizes` that matches the slot — a wrong `sizes` silently ships a 1600px file into a 400px box. Referencing an image absent from the manifest fails the build rather than shipping a broken box.

### Not yet established

The home page did not need these. Decide them deliberately when the route that needs them is built, and record the decision here.

- **Tables** — a real data table (returns, schedules) beyond the List pattern.
- **Empty and loading states** — none defined.

## Do's and Don'ts

**Do**

- Publish computed figures. Every number derives from `src/data/projects.json` at build time and carries an as-of date. Round **down** and append `+` so the headline never overstates.
- Let a section be exactly as tall as its content needs.
- Keep the open left column open when the layout is Split.
- Caption documentary photographs — a dated, located record earns a caption; atmosphere does not. **No hero carries a credit line.** Every hero on the site is city photography rather than a Newstreet record, which is exactly the atmosphere case: the place names under the titles were captioning frames that had not earned one, and each was a small claim the page did not need to make. What the frame is still gets said in the alt text. `.hero__credit` is gone from `base.css` with them.

**Don't**

- **No full stop on a heading.** Section headings ran as closed declaratives — "How we work." / "Concentrated by design." — and a heading is a label, not a sentence: the stop asks the reader to finish a thought that the paragraph beneath is about to start. Headings that are genuinely two beats keep the period *between* them and still drop the final one ("Local principles. National opportunity"). Prose keeps its punctuation; this is headings only, `h1` through `h3`.
- **No kicker over every section.** V3 does this and so does the reference wireframe; it is grammar nobody chose.
- **No `01 / 02 / 03` numbering** on prose sets and card rows. The exception is the **row list** (`.disclose--rows` and the home page's `.stages`): those are numbered throughout — lifecycle, underwriting criteria, reporting groups, and FAQ alike — so the pattern reads as one object wherever it appears rather than as two lists that look almost the same. Numbers there are drawn by a CSS counter, never typed into markup. Note this is a house style, not a claim of sequence: only the lifecycle is genuinely ordered.
- **No split header above full-width content.** Stack it. A Split *band* — text only, with the grid in the next band down — is a different thing and is allowed; that is how the portfolio index opens.
- **No same-size card rows** as page structure. Use spaced columns.
- **No hero-metric template** — big number, small label, accent, four across. Use the Snapshot.
- No stock photography. Project imagery is the firm's own renders and site photography, or the slot stays empty.
- No counting animations on figures. They are facts, not a reveal.
- **Never hand-type a portfolio number into markup.**
- **Nothing is served from the V3 tree.** `public/` holds only generated derivatives, two Nohemi weights, and favicons. Exposing the source folder shipped 177MB of unreferenced originals.
