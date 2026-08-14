/**
 * How the firm describes its own method.
 *
 * This is authored content, not extracted — there is no V3 page to derive it
 * from. It lives here rather than in a page because more than one route states
 * it: the home page summarises the lifecycle and the investors page carries it
 * in full. Two copies of six phases drift within a quarter, and a phase list
 * that disagrees with itself across two pages is worse than either version.
 */

/** Numbered wherever it appears, because the sequence itself is the information. */
export const lifecycle = [
  {
    phase: 'Opportunity sourcing',
    body: 'Off-market and pre-marketed sites surfaced through daily market tracking and long-standing broker relationships.',
  },
  {
    phase: 'Underwriting',
    body: 'Market rents, forward projections, and other critical assumptions are tested against comparable assets in the same submarket and set to a conservative baseline.',
  },
  {
    phase: 'Capitalization',
    body: "Debt and equity are structured to support the project's business plan, timeline, and long-term objectives.",
  },
  {
    phase: 'Development',
    body: 'Our vertical platform allows for entitlement, design, and construction managed in-house with direct accountability for schedule and budget.',
  },
  {
    phase: 'Asset management',
    body: 'Asset performance is managed throughout the hold period, with a focus on leasing, operations, and long-term value.',
  },
  {
    phase: 'Realization',
    body: 'At the realization stage, we evaluate refinancing or sale as the appropriate exit strategy.',
  },
];

/**
 * The firm's stated values, supplied by the client. These are no longer drafts
 * and should not be rewritten to fit the site's voice.
 *
 * Note what they are about: how the team works, not how the firm invests. The
 * four placeholders they replaced described investment posture — hold periods,
 * submarkets, accountability for underwriting — which the lifecycle, the
 * principles and the differentiators already cover. Four is the count the
 * layout expects.
 */
export const values = [
  {
    title: 'Open exchange',
    body: 'We challenge ideas, ask questions, and welcome disagreement. The best answer matters more than who brought it to the table.',
  },
  {
    title: 'Adaptability',
    body: 'We stay flexible as circumstances change. We’re willing to learn, take on unfamiliar problems, and do what the situation requires.',
  },
  {
    title: 'Ownership',
    body: 'We take responsibility for our work and its outcomes. We follow through, communicate clearly, and hold ourselves and each other to a high standard.',
  },
  {
    title: 'High standards',
    body: 'We care about doing things well. We expect strong performance, pay attention to the details, and continuously look for ways to improve.',
  },
];

/**
 * The Newstreet advantage. Stated in summary on the home page and in full on
 * the About page, from this one list.
 */
export const differentiators = [
  {
    title: 'Selective by design',
    body: 'We pursue only the opportunities that meet our investment criteria. By remaining selective, we can commit capital with greater confidence.',
  },
  {
    title: 'Local expertise',
    body: 'We know our markets intimately, drawing on deep local relationships, experience, and a proven track record to identify opportunities with conviction.',
  },
  {
    title: 'Information advantage',
    body: "Our proprietary market intelligence platforms give us a clearer view of off-market opportunities, pricing, and market dynamics before they're broadly recognized.",
  },
  {
    title: 'Institutional discipline',
    body: 'Every investment is measured against the same underwriting standards, regardless of market conditions. Consistency, not optimism, is what protects capital over time.',
  },
];

/**
 * Deal sourcing — the firm's proprietary infrastructure, and the Newstreet
 * advantage on the About page.
 *
 * These are three inputs to ONE function, not three separate claims, which is
 * why the section states what they produce together rather than leaving them
 * as a list of capabilities.
 *
 * TWO inputs, not three. An on-the-ground research entry sat here and the
 * client removed it; the section's markup counts these, so a third added later
 * has to bring the column modifier and the lede's count with it.
 *
 * These are the client's own words. An earlier draft deliberately withheld what
 * the automated signals track, on the grounds that naming unconfirmed data
 * sources would invent the one thing this section exists to prove — that
 * caution is now spent, because the client has named them: non-performing
 * loans, distress signals, and loan maturities. Do not generalise them back
 * out.
 */
export const sourcing = [
  {
    title: 'Proprietary intelligence',
    body: 'We build proprietary tools that continuously track non-performing loans, owner distress signals, loan maturities, and other indicators across our target markets. This gives us an ongoing data flow of potential opportunities before they reach the broader market.',
  },
  {
    title: 'Deep relationships',
    body: 'Our network is built over years of working with brokers, owners, lenders, and other market participants both within and beyond our target markets. These relationships give us access to opportunities and information that often never reach the open market.',
  },
];

/**
 * What has to be true before capital is committed.
 *
 * The first two are the client's own criteria. The last two are the language
 * already published beside the portfolio map, so this list states nothing the
 * site has not already committed to. NOTHING numeric may be added here that is
 * not supplied by the firm — an underwriting threshold invented to fill a row
 * is the single most damaging thing this page could publish.
 */
export const criteria = [
  {
    term: 'High demand, constrained supply',
    body: 'We invest in high-demand neighborhoods where limited new supply supports long-term rent growth and asset value.',
  },
  {
    term: '150–200 bps of spread',
    body: 'We underwrite a yield-on-cost spread of 150 to 200 basis points above the exit cap rate, creating a margin between development cost and stabilized value.',
  },
  {
    /* Sentence case, like the other three — the set is read as one list and a
       single Title Case term breaks it. */
    term: 'Entitlement risk',
    body: 'We prioritize sites that are entitled or where entitlement work is substantially complete.',
  },
  {
    term: 'One underwriting standard',
    body: 'Every opportunity is evaluated against the same underwriting process and standards before capital is committed.',
  },
];

/**
 * The principles are NOT numbered where they are rendered. The wireframe marks
 * them 01–03, but they carry no sequence — a reader does not apply Conviction
 * before Discipline. In this system a number means order, and order is the
 * lifecycle's content, not this list's.
 */
export const principles = [
  {
    title: 'Conviction & focus',
    body: "We're selective about the opportunities we pursue. Every deal must fit within our investment criteria, designed to protect capital, reduce risk, and create long-term value for our investors.",
  },
  {
    title: 'Consistency & execution',
    body: 'We seek a consistent standard of excellence from pre-development through delivery. It carries through every decision and detail of the finished project.',
  },
  {
    title: 'Institutional discipline',
    body: 'We approach every project with disciplined, conservative underwriting. Input from experts across key disciplines ensures our assumptions reflect current market conditions.',
  },
];
