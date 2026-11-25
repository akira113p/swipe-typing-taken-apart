// The demo buttons' swipe: slides along a word's keys with rounded corners, like a finger.
// It is not a recorded swipe; the README says so.

import { pathLength, resample, wordKeys } from "./path.js";

const POINT_EVERY_KEYS = 0.08; // a touch screen reports a point about every 0.08 key widths

export function demoSwipe(word, centers) {
  const path = roundCorners(wordKeys(word, centers));
  return resample(path, Math.max(2, Math.round(pathLength(path) / POINT_EVERY_KEYS)));
}

/** Chaikin corner cutting: replaces each corner with two points a quarter of the way along. */
export function roundCorners(points) {
  if (points.length < 3) return points;
  const out = [points[0]];
  for (let i = 0; i < points.length - 1; i++) {
    out.push(mix(points[i], points[i + 1], 0.25), mix(points[i], points[i + 1], 0.75));
  }
  out.push(points[points.length - 1]);
  return out;
}

function mix(a, b, t) {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
}
