// The shapes a flowchart is made of: boxes, cylinders, straight arrows and wrapped text.

import { el, label, toPoints } from "./svg.js";

export const LID = 11; // half the height of a cylinder's top ellipse
const HEAD = 9; // arrowhead length; it is as wide as it is long

export function box(parent, [x, y, width, height], className) {
  el("rect", { x, y, width, height, rx: 3, class: className }, parent);
}

/** The usual picture of stored data: a can seen slightly from above. */
export function cylinder(parent, [x, y, width, height]) {
  const arc = (sweep, dx) => `a ${width / 2} ${LID} 0 0 ${sweep} ${dx} 0`;
  const body = `M ${x} ${y + LID} ${arc(1, width)} v ${height - 2 * LID} ${arc(1, -width)} z`;
  el("path", { d: body, class: "d-box" }, parent);
  el("path", { d: `M ${x} ${y + LID} ${arc(0, width)}`, class: "d-edge" }, parent);
}

/** A line through the points of `path` with a head on the last one. tone: a judge's name, for its colour. */
export function arrow(svg, { path, tone }) {
  const group = el("g", { class: tone ? `tone-${tone}` : "" }, svg);
  el("polyline", { points: toPoints(path), class: "d-edge" }, group);
  const [[fromX, fromY], [x, y]] = path.slice(-2);
  const [dx, dy] = [Math.sign(x - fromX), Math.sign(y - fromY)]; // segments are straight: this is the direction
  const [backX, backY] = [x - HEAD * dx, y - HEAD * dy];
  const [sideX, sideY] = [(HEAD / 2) * dy, (HEAD / 2) * dx];
  const corners = [[x, y], [backX + sideX, backY - sideY], [backX - sideX, backY + sideY]];
  el("polygon", { points: toPoints(corners), class: "d-head" }, group);
}

export function write(parent, x, y, text, className, size, anchor) {
  label(parent, x, y, text, className, anchor).setAttribute("font-size", size);
}

/** Greedy line breaking (SVG has none): words join a line while it stays within maxChars. */
export function wrap(text, maxChars) {
  const lines = [];
  for (const word of text.split(" ")) {
    const joined = `${lines.at(-1)} ${word}`;
    if (lines.length > 0 && joined.length <= maxChars) lines[lines.length - 1] = joined;
    else lines.push(word);
  }
  return lines;
}
