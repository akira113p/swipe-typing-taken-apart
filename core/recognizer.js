// The recognizer: SHARK2 (Kristensson & Zhai, UIST 2004) plus our letters judge.
//
//   1. resample the swipe into N equidistant points
//   2. prune: drop words whose first or last key is far from where the swipe started or ended
//   3. judge: shape, place and letters gaps for every word still in the race
//   4. vote: gaps and frequency become penalty points; fewer points, bigger share
//
// The recognizer only ever receives the swipe's points: nothing from the page.

import { judge, penalties, totalPenalty } from "./judges.js";
import { distance, resample } from "./path.js";
import { DEFAULTS } from "./settings.js";
import { normalizeShape } from "./shape.js";
import { toShares } from "./vote.js";

/**
 * Returns { gesture, funnel, candidates }. gesture is the resampled swipe; funnel lists
 * [stage id, words left]; candidates are sorted by their share of the vote.
 */
export function recognize(points, templates, prior, options = {}) {
  const s = { ...DEFAULTS, ...options };
  const place = resample(points, s.samplePoints);
  const swipe = { place, shape: normalizeShape(place, s.shapeSize, s.minShapeSpanKeys) };
  const funnel = [["dictionary", templates.length]];

  let alive = templates;
  if (s.usePruning) {
    alive = templates.filter((t) => endsNear(t.keys, place, s.pruneRadiusKeys));
    funnel.push(["ends", alive.length]);
  }

  const candidates = alive.map((t) => {
    const c = { word: t.word, index: t.index, keys: t.keys, path: t.place, prior: prior[t.index], ...judge(t, swipe) };
    c.penalties = penalties(c, s);
    c.points = totalPenalty(c.penalties);
    return c;
  });
  const shares = toShares(candidates.map((c) => c.points));
  candidates.forEach((c, i) => { c.share = shares[i]; });
  candidates.sort((a, b) => b.share - a.share);
  return { gesture: place, funnel, candidates };
}

/** The cheap first filter: people aim carefully at the first and the last letter. */
function endsNear(keys, swipe, radius) {
  const { startGap, endGap } = endGaps(keys, swipe);
  return startGap <= radius && endGap <= radius;
}

/** How far a word's first and last keys are from where the swipe started and ended, in keys. */
function endGaps(keys, swipe) {
  return { startGap: distance(keys[0], swipe[0]), endGap: distance(keys[keys.length - 1], swipe[swipe.length - 1]) };
}
