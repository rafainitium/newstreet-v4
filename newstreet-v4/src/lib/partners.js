/**
 * Firms Newstreet has worked with, carried over from V3's home-page carousel.
 *
 * This is the firm's own published partner list, not one assembled here — the
 * distinction matters, because PRODUCT.md forbids implying relationships that
 * do not exist. Every entry was already live on newst.com with a link to the
 * party's own site, and the links are kept: a mark with nothing behind it is
 * decoration, and a reader should be able to check.
 *
 * `dark` marks the logos drawn in a light colour, which vanish on paper unless
 * they are forced black.
 *
 * V3 also carried a per-logo `scale`, compensating for marks that shipped as
 * square canvases with the wordmark floating in the middle. That is handled
 * upstream now — `optimize-images.mjs` trims every partner mark to its own
 * bounding box, so the derivative IS the wordmark and no per-logo nudging is
 * needed. Six of these were 1:1 canvases before the trim.
 */
export const partners = [
  { name: 'ENC Construction & Development', logo: 'Companies/ENC.png', url: 'https://enccd.com/' },
  {
    name: 'Pappageorge Haymes Partners',
    logo: 'Companies/PH.png',
    url: 'https://www.pappageorgehaymes.com/',
  },
  { name: 'FGMK', logo: 'Companies/fgmk-logo.svg', url: 'https://www.fgmk.com/' },
  { name: 'ESA Design', logo: 'Companies/ESA-LOGO_2018_C-01-01.png', url: 'https://esadesign.com/' },
  { name: 'Wintrust', logo: 'Companies/Wintrust.png', url: 'https://www.wintrust.com/' },
  { name: 'Thompson Coburn', logo: 'Companies/Cobourn.png', url: 'https://www.thompsoncoburn.com/' },
  { name: 'McGuireWoods', logo: 'Companies/McGuire.png', url: 'https://www.mcguirewoods.com/' },
  { name: 'SCB', logo: 'Companies/scb.png', url: 'https://www.scbchicago.com/' },
  {
    name: 'Integra Realty Resources',
    logo: 'Companies/IRR.svg',
    url: 'https://www.irr.com/',
    dark: true,
  },
  {
    name: 'CBCS Claims',
    logo: 'Companies/cbcsHoriz.webp',
    url: 'https://www.cbcsclaims.com/',
    dark: true,
  },
  {
    name: 'Sarnoff Property Tax',
    logo: 'Companies/Sarnoff-Property-Tax-footer-logo.webp',
    url: 'https://sarnoffpropertytax.com/',
    dark: true,
  },
  {
    name: 'Pioneer Environmental Services',
    logo: 'Companies/FINALPioneerLogo.webp',
    url: 'https://pioneer-environmental-services.com/',
    dark: true,
  },
  {
    name: 'The Lux Design Group',
    logo: 'Companies/Lux.webp',
    url: 'https://www.theluxdesigngroup.com/',
    dark: true,
  },
  {
    name: 'Taft',
    logo: 'Companies/taft-logo.39c14ef.svg',
    url: 'https://www.taftlaw.com/',
  },
  {
    name: "D'Accord",
    logo: 'Companies/Daccord-Chicago-Logo-Full.png',
    url: 'https://www.daccordllc.com/',
  },
];
