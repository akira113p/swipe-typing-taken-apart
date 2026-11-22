// Pure geometry on paths. A path is an array of [x, y] points, in key widths.

const distance = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);

/**
 * The ideal path of a word: straight lines between the centres of its keys.
 * Repeated letters ("too", "hello") are collapsed, because sliding from a key to the
 * same key does not move the finger. That is why "to" and "too" share a path.
 */
export function wordTemplate(word, centers) {
  const keys = [...word].filter((letter, i) => i === 0 || letter !== word[i - 1]);
  return keys.map((letter) => centers[letter]);
}

export function pathLength(points) {
  let total = 0;
  for (let i = 1; i < points.length; i++) total += distance(points[i - 1], points[i]);
  return total;
}

/**
 * n points at equal distances along the path. Why: a finger reports points unevenly
 * (dense where it slows down). Equal spacing lets us compare point i of the swipe
 * with point i of every word.
 */
export function resample(points, n) {
  const total = pathLength(points);
  if (points.length === 1 || total === 0) return Array.from({ length: n }, () => [...points[0]]);
  const out = [];
  let segment = 1;
  let walked = 0;                      // path length before the start of `segment`
  for (let k = 0; k < n; k++) {
    const target = (total * k) / (n - 1);
    while (segment < points.length - 1 && walked + distance(points[segment - 1], points[segment]) < target) {
      walked += distance(points[segment - 1], points[segment]);
      segment++;
    }
    const a = points[segment - 1];
    const b = points[segment];
    const len = distance(a, b);
    const t = len === 0 ? 0 : Math.min(1, Math.max(0, (target - walked) / len));
    out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]);
  }
  return out;
}

/**
 * SHARK2 equation 2: scale so the larger side of the bounding box equals `size`, then
 * move the centroid to (0, 0). Afterwards only the SHAPE is left. `minSpan` is our
 * addition: a tap is never blown up to full size, or finger shake would look like a shape.
 */
export function normalizeShape(points, size, minSpan = 0) {
  const xs = points.map((p) => p[0]);
  const ys = points.map((p) => p[1]);
  const largest = Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys), minSpan);
  const scale = largest > 0 ? size / largest : 1;
  const cx = (xs.reduce((s, x) => s + x, 0) / xs.length) * scale;
  const cy = (ys.reduce((s, y) => s + y, 0) / ys.length) * scale;
  return points.map(([x, y]) => [x * scale - cx, y * scale - cy]);
}

/**
 * SHARK2's alpha(i): lowest weight in the middle, rising linearly to both ends, summing
 * to 1. Why: people aim carefully at the first and last letter and get sloppy in between.
 */
export function endsWeights(n) {
  if (n === 1) return [1];
  const middle = (n - 1) / 2;
  const w = Array.from({ length: n }, (_, i) => 1 + Math.abs(i - middle) / middle);
  const sum = w.reduce((s, x) => s + x, 0);
  return w.map((x) => x / sum);
}

/** SHARK2 equation 1: the average distance between corresponding points. */
export function meanPointDistance(u, t) {
  let sum = 0;
  for (let i = 0; i < u.length; i++) sum += distance(u[i], t[i]);
  return sum / u.length;
}

/**
 * SHARK2 equations 5-6: how far the points of `a` stick out of a tube of `radius` around
 * the points of `b`. Zero means every point of `a` lies inside the tube.
 */
export function outsideTunnel(a, b, radius) {
  let sum = 0;
  for (const p of a) {
    let nearest = Infinity;
    for (const q of b) nearest = Math.min(nearest, distance(p, q));
    sum += Math.max(nearest - radius, 0);
  }
  return sum;
}

/** Weighted sum of corresponding-point distances (the place gap outside the tunnel). */
export function weightedPointDistance(u, t, weights) {
  let sum = 0;
  for (let i = 0; i < u.length; i++) sum += weights[i] * distance(u[i], t[i]);
  return sum;
}

/** Corner cutting, used only to round the demo swipe the way a finger would. */
export function roundCorners(points) {
  if (points.length < 3) return points;
  const out = [points[0]];
  for (let i = 0; i < points.length - 1; i++) {
    const [a, b] = [points[i], points[i + 1]];
    out.push([0.75 * a[0] + 0.25 * b[0], 0.75 * a[1] + 0.25 * b[1]]);
    out.push([0.25 * a[0] + 0.75 * b[0], 0.25 * a[1] + 0.75 * b[1]]);
  }
  out.push(points[points.length - 1]);
  return out;
}
