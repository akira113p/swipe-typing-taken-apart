// The letters judge (our addition to SHARK2): did the finger pass every letter, in order?
//
// Comparing point i with point i breaks when a real finger curves or drifts: every point
// shifts a little, and "hello" and "help" end up equally far from the swipe. Here each
// letter finds its own closest spot on the swipe's line instead, so a curve between two
// letters costs nothing. The first letter is pinned to where the swipe starts and the last
// to where it ends, because that is where people aim most carefully.

const squared = (a, b) => (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2;

/** The point of segment a–b closest to p. */
function closestOnSegment(p, [a, b]) {
  const [dx, dy] = [b[0] - a[0], b[1] - a[1]];
  const length2 = dx * dx + dy * dy;
  const t = length2 === 0 ? 0 : Math.min(1, Math.max(0, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / length2));
  return [a[0] + t * dx, a[1] + t * dy];
}

/**
 * Returns { hits, gap }. hits[j] is the spot of the swipe matched to letter j; gap is the
 * root mean square miss, in key widths (0 = the swipe crossed every key centre).
 *
 * Dynamic programming over the swipe's segments: cost[i] = the smallest total squared miss
 * of letters 0..j with letter j on segment i. Letter j may only use a segment at or after
 * letter j-1's, so a running minimum is enough: letters × segments steps in all.
 */
export function letterHits(points, keys) {
  const targets = keys.length === 1 ? [keys[0], keys[0]] : keys; // a 1-letter word starts and ends on its key
  const segments = points.slice(1).map((b, i) => [points[i], b]);
  const last = segments.length - 1;
  const spot = (j, i) => {
    if (j === 0) return points[0];
    return j === targets.length - 1 ? points[points.length - 1] : closestOnSegment(targets[j], segments[i]);
  };
  let cost = segments.map((_, i) => (i === 0 ? squared(spot(0, 0), targets[0]) : Infinity));
  const cameFrom = [];
  for (let j = 1; j < targets.length; j++) {
    const isLast = j === targets.length - 1;
    const next = [];
    const from = [];
    let [best, bestAt] = [Infinity, 0];
    for (let i = 0; i <= last; i++) {
      if (cost[i] < best) [best, bestAt] = [cost[i], i];
      next.push(isLast && i < last ? Infinity : best + squared(spot(j, i), targets[j]));
      from.push(bestAt);
    }
    cameFrom.push(from);
    cost = next;
  }
  const used = [last];
  for (let j = cameFrom.length - 1; j >= 0; j--) used.unshift(cameFrom[j][used[0]]);
  return { hits: targets.map((_, j) => spot(j, used[j])), gap: Math.sqrt(cost[last] / targets.length) };
}
