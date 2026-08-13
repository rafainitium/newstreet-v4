import geo from '../data/geo.json';

/**
 * The Chicago frame. It is the map's OPENING VIEW, not the limit of what it
 * holds: every located asset gets a marker, and the ones outside this box are
 * simply beyond the initial framing until the reader zooms out. One view cannot
 * show Wrightwood Ave and Nashville at a scale where either means anything, so
 * the map opens where the portfolio is concentrated.
 *
 * The fixed-viewBox schematic is the exception — it can only draw what fits its
 * frame, so it plots `plotted` alone.
 *
 * An asset with no entry in geo.json appears nowhere. For the Coming Soon
 * placeholders that is the point.
 */
export const EXTENT = { west: -87.7, east: -87.58, north: 41.945, south: 41.855 };

const within = (g) =>
  g.lat <= EXTENT.north && g.lat >= EXTENT.south && g.lng >= EXTENT.west && g.lng <= EXTENT.east;

export const locate = (projects) => {
  const located = projects
    .map((project) => ({ project, geo: geo[project.slug] }))
    .filter((entry) => entry.geo);

  return {
    /** Everything with coordinates — every one of these gets a marker. */
    all: located,
    /** Inside the Chicago frame: the schematic's contents, and what the tile map opens on. */
    plotted: located.filter((entry) => within(entry.geo)),
    /** Outside it: plotted all the same, and listed so they are findable without hunting. */
    elsewhere: located.filter((entry) => !within(entry.geo)),
  };
};

export { stageLabel } from './project.js';
