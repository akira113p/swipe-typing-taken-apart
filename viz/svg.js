// Tiny helpers for building SVG by hand (no library).

const SVG_NS = "http://www.w3.org/2000/svg";

/** Creates an SVG element with attributes and appends it to `parent`. */
export function el(name, attrs, parent) {
  const node = document.createElementNS(SVG_NS, name);
  for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, value);
  parent.appendChild(node);
  return node;
}

/** A text label. anchor: "start", "middle" or "end". */
export function label(parent, x, y, text, className = "chart-label", anchor = "start") {
  const node = el("text", { x, y, class: className, "text-anchor": anchor }, parent);
  node.textContent = text;
  return node;
}

/** [[x, y], ...] → "x,y x,y" for a polyline. */
export function toPoints(path) {
  return path.map(([x, y]) => `${x.toFixed(3)},${y.toFixed(3)}`).join(" ");
}

/** Empties an SVG chart and gives it a fixed coordinate box (it then scales with the page). */
export function resetChart(svg, width, height) {
  svg.replaceChildren();
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
}

/**
 * An arrowhead at the end of a path, pointing the way it was drawn: the recognizer compares point i
 * with point i, so a line read backwards is a different line ("on" and "no" share one segment).
 * It follows the last step that actually moves, because a finger often ends with repeated points.
 */
export function arrowHead(parent, path, className, size) {
  const tip = path[path.length - 1];
  const from = path.findLast(([x, y]) => Math.hypot(tip[0] - x, tip[1] - y) > size / 4);
  if (!from) return;
  const length = Math.hypot(tip[0] - from[0], tip[1] - from[1]);
  const [dx, dy] = [(tip[0] - from[0]) / length, (tip[1] - from[1]) / length];
  const back = [tip[0] - dx * size, tip[1] - dy * size];
  const wing = (side) => [back[0] - side * dy * size * 0.6, back[1] + side * dx * size * 0.6];
  el("polygon", { points: toPoints([tip, wing(1), wing(-1)]), class: className }, parent);
}
