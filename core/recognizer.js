// The SHARK2 recognizer (Kristensson & Zhai, UIST 2004) with word frequency as the prior.
//
//   1. resample the swipe into N equidistant points
//   2. prune: drop words whose first or last key is far from where the swipe started or ended
//   3. shape judge: compare normalized shapes (size and position ignored)
//   4. place judge: compare positions on the keys (inside the tunnel = 0)
//   5. turn each gap into a likelihood with a Gaussian, drop anything beyond 2 sigma
//   6. multiply the judges and P(w)^lambda, normalize to shares of the vote
//
// The recognizer only ever receives the swipe's points: nothing from the page.

import {
  endsWeights, meanPointDistance, normalizeShape, outsideTunnel, resample, weightedPointDistance, wordTemplate,
} from "./geometry.js";

// The paper does not publish these values; they were tuned on simulated swipes
// (see the Python lab: 90% first place with a sloppy finger, 95% with a perfect one).
export const DEFAULTS = {
  samplePoints: 48,          // N
  shapeSize: 1,              // L: the larger side of the normalized box
  minShapeSpanKeys: 0.5,     // smaller swipes are not blown up (taps)
  sigmaShape: 0.12,          // in units of the normalized box
  sigmaPlaceKeys: 0.5,       // the paper's example: one key radius
  tunnelRadiusKeys: 0.5,     // a tunnel one key wide
  pruneRadiusKeys: 1.25,
  priorWeight: 0.25,         // lambda: 1 (plain Bayes) let common words swamp the geometry
  usePruning: true,
  useShape: true,
  usePlace: true,
  usePrior: true,
};

const SQRT_2PI = Math.sqrt(2 * Math.PI);

/** SHARK2 equation 7 with mean 0: a gap becomes a likelihood. Bigger sigma = more forgiving. */
export function gaussian(x, sigma) {
  return Math.exp(-0.5 * (x / sigma) ** 2) / (sigma * SQRT_2PI);
}

/** Every word's ideal path, resampled and normalized once. */
export function buildTemplates(words, centers, settings = DEFAULTS) {
  return words.map((word) => {
    const place = resample(wordTemplate(word, centers), settings.samplePoints);
    return { word, place, shape: normalizeShape(place, settings.shapeSize, settings.minShapeSpanKeys) };
  });
}

/**
 * Returns { funnel, candidates } where funnel lists [stage id, count]: how many words were still in the race after
 * each step, and candidates are sorted by their share of the vote.
 */
export function recognize(points, templates, prior, options = {}) {
  const s = { ...DEFAULTS, ...options };
  const u = resample(points, s.samplePoints);
  const uShape = normalizeShape(u, s.shapeSize, s.minShapeSpanKeys);
  const weights = endsWeights(s.samplePoints);
  const funnel = [["dictionary", templates.length]];

  let alive = templates.map((t, index) => ({ index, t }));
  if (s.usePruning) {
    alive = alive.filter(({ t }) => near(t.place[0], u[0], s.pruneRadiusKeys)
      && near(t.place[t.place.length - 1], u[u.length - 1], s.pruneRadiusKeys));
    funnel.push(["ends", alive.length]);
  }

  if (s.useShape) {
    for (const c of alive) {
      c.shapeGap = meanPointDistance(uShape, c.t.shape);
      c.shapeLikelihood = gaussian(c.shapeGap, s.sigmaShape);
    }
    alive = alive.filter((c) => c.shapeGap <= 2 * s.sigmaShape);
    funnel.push(["shape", alive.length]);
  }
  if (s.usePlace) {
    for (const c of alive) {
      c.inTunnel = outsideTunnel(u, c.t.place, s.tunnelRadiusKeys) === 0
        && outsideTunnel(c.t.place, u, s.tunnelRadiusKeys) === 0;
      c.placeGap = c.inTunnel ? 0 : weightedPointDistance(u, c.t.place, weights);
      c.placeLikelihood = gaussian(c.placeGap, s.sigmaPlaceKeys);
    }
    alive = alive.filter((c) => c.placeGap <= 2 * s.sigmaPlaceKeys);
    funnel.push(["place", alive.length]);
  }

  // SHARK2 equations 8-9: each judge's likelihoods become shares, then they are multiplied.
  for (const c of alive) c.score = 1;
  for (const [used, key] of [[s.useShape, "shapeLikelihood"], [s.usePlace, "placeLikelihood"]]) {
    if (!used) continue;
    const total = alive.reduce((sum, c) => sum + c[key], 0);
    for (const c of alive) c.score *= total > 0 ? c[key] / total : 0;
  }
  if (s.usePrior) for (const c of alive) c.score *= prior[c.index] ** s.priorWeight;
  const total = alive.reduce((sum, c) => sum + c.score, 0);
  const candidates = alive
    .filter((c) => c.score > 0)
    .map((c) => ({
      word: c.t.word, index: c.index, share: c.score / total, prior: prior[c.index],
      shapeGap: c.shapeGap, placeGap: c.placeGap, inTunnel: c.inTunnel, path: c.t.place,
    }))
    .sort((a, b) => b.share - a.share);
  funnel.push(["vote", candidates.length]);
  return { gesture: u, funnel, candidates };
}

function near(a, b, radius) {
  return Math.hypot(a[0] - b[0], a[1] - b[1]) <= radius;
}
