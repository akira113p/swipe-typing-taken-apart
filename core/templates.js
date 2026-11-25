// Every word's ideal path, prepared once when the page loads (10,000 words in well under a second).

import { resample, wordKeys } from "./path.js";
import { DEFAULTS } from "./settings.js";
import { normalizeShape } from "./shape.js";

/**
 * For each word: its keys (for the letters judge), its path resampled to N points on the
 * real keys (place judge) and the same path normalized (shape judge).
 */
export function buildTemplates(words, centers, settings = DEFAULTS) {
  return words.map((word, index) => {
    const keys = wordKeys(word, centers);
    const place = resample(keys, settings.samplePoints);
    const shape = normalizeShape(place, settings.shapeSize, settings.minShapeSpanKeys);
    return { word, index, keys, place, shape };
  });
}
