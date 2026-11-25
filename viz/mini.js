// Building blocks for the small figures in the "How it decides" cards. They are laid out in
// key widths, like the big keyboard, so the line classes of css/stage.css draw the same here.
// They draw what the core computed; they decide nothing.

import { KEYBOARD_HEIGHT_KEYS, KEYBOARD_WIDTH_KEYS, KEY_HEIGHT_KEYS } from "../core/keyboard.js";
import { el, toPoints } from "./svg.js";

const MARGIN_KEYS = 0.1;
const CAPTION_KEYS = 0.8; // room under the drawing for one line of text
const KEY_GAP_KEYS = 0.12;
export const WIDTH = KEYBOARD_WIDTH_KEYS;
export const HEIGHT = KEYBOARD_HEIGHT_KEYS;

/** Empties a figure and gives it the keyboard's coordinates plus a caption line. */
export function startFigure(svg) {
  svg.replaceChildren();
  const box = [-MARGIN_KEYS, -MARGIN_KEYS, WIDTH + 2 * MARGIN_KEYS, HEIGHT + CAPTION_KEYS + 2 * MARGIN_KEYS];
  svg.setAttribute("viewBox", box.join(" "));
}

/** Pale keys with their letters, so the lines have something to sit on. */
export function faintKeys(svg, centers) {
  const [w, h] = [1 - KEY_GAP_KEYS, KEY_HEIGHT_KEYS - KEY_GAP_KEYS];
  for (const [letter, [x, y]] of Object.entries(centers)) {
    el("rect", { x: x - w / 2, y: y - h / 2, width: w, height: h, rx: 0.15, class: "mini-key" }, svg);
    el("text", { x, y: y + 0.15, class: "mini-letter" }, svg).textContent = letter;
  }
}

/** One line of text under the drawing, centred on x. */
export function caption(svg, text, x = WIDTH / 2) {
  el("text", { x, y: HEIGHT + 0.6, class: "mini-caption" }, svg).textContent = text;
}

export function line(svg, points, className) {
  el("polyline", { points: toPoints(points), class: className }, svg);
}

export function dots(svg, points, className, r) {
  for (const [cx, cy] of points) el("circle", { cx, cy, r, class: className }, svg);
}

/** A thin line from point i of one path to point i of the other: the distances a judge averages. */
export function pairs(svg, a, b) {
  a.forEach(([x1, y1], i) => el("line", { x1, y1, x2: b[i][0], y2: b[i][1], class: "pair" }, svg));
}

/** Scales points by the same factor in x and y and centres them in the box [x, y, width, height]. */
export function fit(points, [x, y, width, height]) {
  const xs = points.map((p) => p[0]);
  const ys = points.map((p) => p[1]);
  const [left, top] = [Math.min(...xs), Math.min(...ys)];
  const [w, h] = [Math.max(...xs) - left, Math.max(...ys) - top];
  const scale = Math.min(width / Math.max(w, 1e-9), height / Math.max(h, 1e-9));
  const [dx, dy] = [x + (width - w * scale) / 2, y + (height - h * scale) / 2];
  return points.map(([px, py]) => [dx + (px - left) * scale, dy + (py - top) * scale]);
}
