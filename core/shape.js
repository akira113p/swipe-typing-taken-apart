// The ruler shared by the shape judge and the place judge.

import { distance } from "./path.js";

/**
 * SHARK2 equation 2: scale so the larger side of the bounding box equals `size`, then
 * move the centroid to (0, 0). Afterwards only the SHAPE is left. `minSpan` is our
 * addition: a tap is never blown up to full size, or finger shake would look like a shape.
 */
export function normalizeShape(points, size, minSpan = 0) {
  const xs = points.map((p) => p[0]);
  const ys = points.map((p) => p[1]);
  const width = Math.max(...xs) - Math.min(...xs);
  const height = Math.max(...ys) - Math.min(...ys);
  const scale = size / Math.max(width, height, minSpan, Number.EPSILON);
  const cx = mean(xs) * scale;
  const cy = mean(ys) * scale;
  return points.map(([x, y]) => [x * scale - cx, y * scale - cy]);
}

/**
 * SHARK2 equation 1: the average distance between point i of one path and point i of
 * the other. Both paths must have the same number of points (see resample).
 */
export function meanPointDistance(u, t) {
  let sum = 0;
  for (let i = 0; i < u.length; i++) sum += distance(u[i], t[i]);
  return sum / u.length;
}

function mean(values) {
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}
