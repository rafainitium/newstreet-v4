/**
 * Shared project vocabulary. The stage ramp is data — it drives the dot on the
 * card, the marker on the map, and the tag on the project page — so its labels
 * live in one place rather than being restated at each call site.
 */
export const stageLabel = (stage) =>
  ({
    'pre-development': 'Pre-Development',
    'under-construction': 'Under Construction',
    completed: 'Completed',
  })[stage] ?? stage;

/** A figure is publishable at `figure` scale only if it is actually a number. */
export const isNumeric = (value) => /^[\d][\d,.]*\+?$/.test(String(value).trim());
