// Paths are arrays of [x, y] points, measured in key widths.

export function distance(a, b) {
  return Math.hypot(a[0] - b[0], a[1] - b[1]);
}

/**
 * The keys a word visits, in order. Repeated letters ("too", "hello") are collapsed,
 * because sliding from a key to the same key does not move the finger.
 * That is why "to" and "too" share a path.
 */
export function wordKeys(word, centers) {
  const letters = [...word].filter((letter, i) => i === 0 || letter !== word[i - 1]);
  return letters.map((letter) => centers[letter]);
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
  if (total === 0) return Array.from({ length: n }, () => [...points[0]]);
  const out = [];
  let segment = 1;
  let walked = 0; // path length before the start of `segment`
  for (let k = 0; k < n; k++) {
    const target = (total * k) / (n - 1);
    while (segment < points.length - 1 && walked + segmentLength(points, segment) < target) {
      walked += segmentLength(points, segment);
      segment++;
    }
    out.push(pointAlong(points[segment - 1], points[segment], target - walked));
  }
  return out;
}

function segmentLength(points, segment) {
  return distance(points[segment - 1], points[segment]);
}

/** The point `along` key widths from a towards b, never past either end. */
function pointAlong(a, b, along) {
  const len = distance(a, b);
  const t = len === 0 ? 0 : Math.min(1, Math.max(0, along / len));
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
}
