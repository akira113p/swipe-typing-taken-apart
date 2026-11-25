// A simulated finger, for measuring accuracy without people. It is OUR model of a finger,
// not recorded data: each imperfection is a named knob, in key widths.

import { roundCorners } from "./demo.js";
import { pathLength, resample, wordKeys } from "./path.js";

export const FINGERS = {
  careful: { miss: 0.15, bow: 0.1, wobble: 0.02 },
  human: { miss: 0.25, bow: 0.25, wobble: 0.03 },
  sloppy: { miss: 0.35, bow: 0.35, wobble: 0.04 },
};

/** Seeded random numbers, so every run sees the same swipes. Returns uniform() and normal(). */
export function randomSource(seed) {
  let state = seed >>> 0;
  const uniform = () => {
    state = (state + 0x6d2b79f5) >>> 0; // mulberry32
    let t = Math.imul(state ^ (state >>> 15), state | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const normal = () => Math.sqrt(-2 * Math.log(uniform() + 1e-12)) * Math.cos(2 * Math.PI * uniform());
  return { uniform, normal };
}

/** Where the finger really lands when it aims at [x, y]: a random miss of typical size `miss` on each axis. */
export function aimAt([x, y], miss, random) {
  return [x + random.normal() * miss, y + random.normal() * miss];
}

/** `count` taps aimed at the point [0, 0], to show on the accuracy chart how far a finger lands. */
export function sampleTaps(miss, count, seed) {
  const random = randomSource(seed);
  return Array.from({ length: count }, () => aimAt([0, 0], miss, random));
}

/**
 * miss: how far the finger lands from each key centre. bow: how much each hop between
 * two keys curves sideways, as a share of its length. wobble: shake on every point.
 */
export function simulateSwipe(word, centers, finger, random) {
  const aims = wordKeys(word, centers).map((key) => aimAt(key, finger.miss, random));
  const path = [aims[0]];
  for (let i = 1; i < aims.length; i++) path.push(bowedMiddle(aims[i - 1], aims[i], random.normal() * finger.bow), aims[i]);
  if (path.length === 1) path.push([path[0][0] + 0.05, path[0][1]]); // a 1-letter word is a tiny slide
  const smooth = roundCorners(roundCorners(roundCorners(path)));
  const points = resample(smooth, Math.max(2, Math.round(pathLength(smooth) / 0.08)));
  return points.map(([x, y]) => [x + random.normal() * finger.wobble, y + random.normal() * finger.wobble]);
}

/** The midpoint of a hop, pushed sideways by `bow` times the hop's length. */
function bowedMiddle(a, b, bow) {
  const [dx, dy] = [b[0] - a[0], b[1] - a[1]];
  return [(a[0] + b[0]) / 2 - dy * bow, (a[1] + b[1]) / 2 + dx * bow];
}
