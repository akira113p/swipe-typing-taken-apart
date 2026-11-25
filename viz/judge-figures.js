// The small figures of the three judges in "How it decides": what each one compares.
// They draw what the core computed (core/judges.js); they decide nothing.

import { el } from "./svg.js";
import { caption, dots, faintKeys, line, pairs, startFigure, WIDTH } from "./mini.js";

const SHAPE_SCALE_KEYS = 3; // one shape unit (the normalized box) drawn as 3 key widths
const PANEL_MIDDLE_KEYS = 2.1; // vertical centre of the three shape panels

/** Your swipe and the word, each shrunk to the same box; then one on top of the other. */
export function drawShape(svg, swipeShape, wordShape, [swipeText, wordText, bothText]) {
  startFigure(svg);
  const third = WIDTH / 3;
  const at = (panel, points) => points.map(([x, y]) => [third * (panel + 0.5) + x * SHAPE_SCALE_KEYS, PANEL_MIDDLE_KEYS + y * SHAPE_SCALE_KEYS]);
  line(svg, at(0, swipeShape), "swipe");
  line(svg, at(1, wordShape), "ideal");
  pairs(svg, at(2, swipeShape), at(2, wordShape));
  line(svg, at(2, wordShape), "ideal");
  line(svg, at(2, swipeShape), "swipe");
  [swipeText, wordText, bothText].forEach((text, i) => caption(svg, text, third * (i + 0.5)));
}

/** Your swipe and the word where they really are, point i joined to point i. */
export function drawPlace(svg, centers, swipe, word, text) {
  startFigure(svg);
  faintKeys(svg, centers);
  pairs(svg, swipe, word.path);
  line(svg, word.path, "ideal");
  line(svg, swipe, "swipe");
  caption(svg, text);
}

/** Each letter of the word and the spot of your swipe it was matched with. */
export function drawLetters(svg, centers, swipe, word, radius, text) {
  startFigure(svg);
  faintKeys(svg, centers);
  dots(svg, word.keys, "target", radius);
  line(svg, swipe, "swipe");
  word.hits.forEach(([x2, y2], j) => {
    const [x1, y1] = word.keys[Math.min(j, word.keys.length - 1)]; // a 1-letter word has two hits on one key
    el("line", { x1, y1, x2, y2, class: "hit" }, svg);
  });
  dots(svg, word.hits, "hit-spot", 0.08);
  caption(svg, text);
}
