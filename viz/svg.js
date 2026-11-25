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
