// From penalty points to shares of the vote.

/**
 * SHARK2 equation 7 turned into penalty points. The paper gives each gap x a likelihood
 * from a bell curve with mean 0: exp(-½(x/σ)²) / (σ√2π). Its minus-log is ½(x/σ)² plus a
 * constant. The constant is the same for every word, so it cancels in the shares; we drop it.
 * Bigger sigma = a more forgiving judge: the same gap costs fewer points.
 */
export function bellPenalty(gap, sigma) {
  return 0.5 * (gap / sigma) ** 2;
}

/** The bell curve itself, scaled to 1 at a gap of 0 (for drawing it). */
export function bellHeight(gap, sigma) {
  return Math.exp(-bellPenalty(gap, sigma));
}

/**
 * Penalty points become shares that add up to 1: share ∝ e^(-points).
 * So one extra point means e ≈ 2.7 times fewer votes. Why points and not plain
 * probabilities: multiplying three small likelihoods and a frequency gives numbers so
 * small that a computer rounds them to zero; adding their logs does not. Starting from the
 * best word keeps e^() in range and changes nothing after dividing by the total.
 */
export function toShares(points) {
  const best = Math.min(...points);
  const weights = points.map((p) => Math.exp(best - p));
  const total = weights.reduce((sum, w) => sum + w, 0);
  return weights.map((w) => w / total);
}
