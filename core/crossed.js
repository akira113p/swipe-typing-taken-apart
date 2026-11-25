// The keys a swipe passes over, in order. The recognizer never uses this: it is here to show,
// at the top of the page, why reading the keys under the finger would not work.

import { keyAt } from "./keyboard.js";
import { pathLength, resample } from "./path.js";

const STEP_KEYS = 0.02; // look under the finger every 0.02 key widths, so no corner of a key is skipped

/** The letters under the swipe from start to end; a key that stays under the finger counts once. */
export function keysCrossed(points) {
  const n = Math.max(2, Math.ceil(pathLength(points) / STEP_KEYS) + 1);
  const letters = [];
  for (const point of resample(points, n)) {
    const letter = keyAt(point);
    if (letter && letter !== letters.at(-1)) letters.push(letter);
  }
  return letters;
}
