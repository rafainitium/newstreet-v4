# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Primary: LP / equity investors.** Accredited individuals and institutions evaluating whether Newstreet is a credible steward of their capital. They arrive from a referral, an intro email, or a press mention, and they are doing due diligence — trying to understand how the firm sources, underwrites, capitalizes, executes, and exits before deciding whether to take a call. The single action that matters is requesting information / getting onto the investor list.

Secondary audiences appear in existing site content (brokers and sellers, municipalities, development partners) but their relative priority is **undecided** — the site is not currently designed to serve them as parallel tracks.

## Product Purpose

The Newstreet website is the firm's primary credibility instrument. It exists to let an investor who has never met the team understand the firm's operations and process in enough depth to trust it with capital.

Success is an investor moving from "who are these people" to "I want to be on the list" without a meeting.

Newstreet is early-stage as a firm but is deliberately not presenting as one. The site's job is to read as established and experienced — grounded in demonstrated process and real completed work rather than in momentum or ambition.

## Positioning

A Chicago-based multifamily investment and development firm that operates across the full investment lifecycle — sourcing, underwriting, capitalization, development execution, asset management, and realization — as both developer and investor, in named Chicago submarkets it knows first-hand.

The differentiating claim is **depth of disclosed process**. Peer firms of comparable size publish a portfolio and a contact form. Newstreet's position is that showing the inner workings of how decisions get made is itself the proof, and that an investor should be able to evaluate the operation from the site alone.

## Operating Context

- Investors evaluate the firm asynchronously, often before any human contact, and frequently from an emailed link.
- Existing portfolio work is tracked along three real dimensions already implemented in V3: **stage** (pre-development / under-construction / completed), **type** (multifamily / mixed-use / hotel mixed-use), and **involvement** (developer / investor). Projects are additionally grouped into two views: developments and investments.
- Press coverage is tracked in a spreadsheet (`press.xlsx`) and rendered on the site.
- Project media is organized in per-project asset folders in the repository.

## Capabilities and Constraints

**Target build (confirmed):** Astro with static output, deployed on Vercel. Chosen to eliminate the six-way duplication in V3 and to ship minimal client JavaScript — the site establishes facts rather than leaning on interactivity.

**Build pipeline.** `npm run build` runs three steps in order: `extract-projects` and `extract-press` regenerate the data records from V3, `optimize-images` regenerates image derivatives, then Astro builds. All three are deterministic, so a clean checkout reproduces the deployed site exactly. V3 remains the source of truth for content and photography; nothing in V3 is served directly.

**Inherited from V3 (`NEWST V3/`), all confirmed as real, in-use material:**
- Six independent static HTML pages: `index`, `about`, `projects`, `press`, `team`, `contact`.
- `about.html` is the canonical about page. `about-evidence.html`, `about-narrative.html`, `about-portfolio.html`, `about-test.html` are experiments and are not in use.
- ~4,980 lines of inline CSS duplicated across the six pages, each with its own `:root` token block.
- Six divergent copies of the nav markup — already drifted.
- `press.html` loads `press.xlsx` client-side via a CDN build of xlsx.js, so press content is not server-rendered or indexable.
- Deployed at newst.com. Git history exists.

**V4 is a redesign, not a rebuild.** The visual language is being replaced to align with the reference wireframe; the information architecture and layout structure that already work are not being overhauled.

- **Structure and behavior preserved** (these layouts do not need rework): navigation, portfolio grid and its filter system, press. Preserved means the arrangement, interaction, and function carry forward — not the typography, scale, spacing, or color applied to them.
- **Visual language replaced** across the entire site, including the preserved layouts: type system, type scale and size, spacing rhythm, section banding, and color.
- **The home hero carve-out was retired in July 2026.** It originally kept V3's centred `forma-djr-deck` headline verbatim. In use the first viewport read as a different firm than the page beneath it — different alignment system, 2.5× the type scale, and a different typeface. The hero now keeps V3's drone video and the "the newstreet standard of living." tagline, but its composition and type follow the new system. The tagline itself is brand and stays.
- **Navigation binding is the transparent-to-dark transition only:** fixed bar, white text over the hero; on scroll a translucent dark bar (`rgba(18,18,18,0.78)` with 16px backdrop blur) slides down from above and a hairline rule expands from center to full width. V3 also tightened padding from 24px to 16px on scroll; the client released that in V4, and the bar is now a fixed height. Everything else about the nav — type, spacing, link treatment — is open.

**Confirmed to add in V4:** market perspective, the Newstreet difference, investment lifecycle, leadership. Investment-strategy content is to be split out into an "about the firm" page.

**Typefaces.** V3 loaded four from three sources: Murecho (workhorse), Nohemi (wordmark), forma-djr-deck (hero headline), and Inter as an effectively unused `:root` fallback.

V4 runs **three**: Libre Caslon Display for all display type and published figures, Libre Franklin for body and UI, and **Nohemi for the wordmark only** — nav and footer. Nohemi remains brand-binding.

Murecho, Inter, and forma-djr-deck are removed. forma-djr-deck went when the hero was rebuilt, which also removed the Adobe Typekit dependency; kit `zoh8hpl` contained that face alone. Restoring it means restoring the kit load.

**Undecided:** whether secondary audiences get dedicated paths; whether press moves to a build-time data source; final page inventory beyond the above.

## Brand Commitments

- Name and wordmark: **Newstreet**, set lowercase as `newstreet` in the existing wordmark. Logo and favicon assets live in `logoicons/`.
- Domain: newst.com.
- Voice: grounded, factual, measured. Explicitly **not** tech-forward or start-up-coded — the firm is early-stage but is positioning on experience and discipline.
- **The brand palette is monochrome** — black, white, and neutral grays. No accent color anywhere on the site, including in data, states, and indicators. This is a firm-level commitment, not a per-page design choice.
- The home hero's visual treatment and the navigation's scroll behavior are binding (see Capabilities and Constraints). Everything else in the visual language is open to redesign.

## Evidence on Hand

All content currently on the V3 site is real material, not placeholder.

- **Named projects:** The Arris, 1165 N Clark, 200 W Ohio, 424 S Wabash, 319 Peabody, Fifth + Pine, East Bank Apartments, 626 S Wabash, 1810 North Wells. Additional asset folders exist for 100NB and a confidential project.
- **Team:** Alex Milanoski (Partner), Kyle Ruperto (Development Manager), Rafael Villasenor (Analyst) — with bios and headshots available.
- **Press:** real third-party coverage tracked in `press.xlsx` (Crain's Chicago Business, Bisnow, The Real Deal and similar).
- **Project media:** per-project photography and video assets in the repository.

**Portfolio metrics are derivable, not yet stated.** Unit counts, dollars deployed, square footage and similar figures can be computed from existing project data but are not currently published anywhere. Future work must derive them from the project records rather than inventing or rounding them.

**Absences future work must not fabricate:** no LP or lender logos, no testimonials, no third-party performance benchmarks, no AUM figure has been confirmed.

## Product Principles

1. **Process is the proof.** Depth of disclosed operating detail is the firm's differentiator; sections that explain how decisions get made earn their space over sections that assert quality.
2. **Every number traces to a project record.** Metrics are computed from real portfolio data or omitted. Nothing is rounded up to look bigger.
3. **Read established, not emerging.** Where a choice signals either momentum or durability, choose durability.
4. **One primary action.** Everything on the site funnels toward an investor requesting information; other links are secondary by default.
5. **Facts over interaction.** Interactivity must serve comprehension. Motion and cleverness are not the product.
