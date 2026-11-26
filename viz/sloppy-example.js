// Under the accuracy chart: one word swiped by the simulated finger of one sloppiness level,
// over the word's ideal line, so you can see how far the swipe drifts. It draws; it decides nothing.

import { KEY_HEIGHT_KEYS } from "../core/keyboard.js";
import { caption, dots, faintKeys, line, startFigure } from "./mini.js";
import { el } from "./svg.js";

// The ruler sits right of "m", where the bottom row leaves the keyboard empty. In key widths, like the drawing.
const RULER = { left: 8.75, y: 2.6 * KEY_HEIGHT_KEYS, tick: 0.12 };

/** keys: the word's key centres; ideal: its line; swipe: the simulated finger's points; keyMm: one key in mm. */
export function drawSloppyExample(svg, { centers, keys, ideal, swipe, text, keyMm }) {
  startFigure(svg);
  faintKeys(svg, centers);
  dots(svg, keys, "target", 0.35); // its keys, marked as on the big keyboard
  line(svg, ideal, "ideal");
  line(svg, swipe, "swipe");
  dots(svg, [swipe[0]], "swipe-start", 0.12);
  ruler(svg, `${keyMm} mm`);
  caption(svg, text);
}

/** A bar one key wide with its length written under it, so the drift can be read in millimetres. */
function ruler(svg, text) {
  const { left, y, tick } = RULER;
  const right = left + 1;
  el("line", { x1: left, y1: y, x2: right, y2: y, class: "ruler" }, svg);
  for (const x of [left, right]) el("line", { x1: x, y1: y - tick, x2: x, y2: y + tick, class: "ruler" }, svg);
  el("text", { x: left + 0.5, y: y - 0.25, class: "mini-caption" }, svg).textContent = "1 key";
  el("text", { x: left + 0.5, y: y + 0.55, class: "mini-caption" }, svg).textContent = text;
}
