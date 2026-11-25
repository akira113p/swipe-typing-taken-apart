// Under the accuracy chart: one word swiped by the simulated finger of one sloppiness level,
// over the word's ideal line, so you can see how far the swipe drifts. It draws; it decides nothing.

import { caption, dots, faintKeys, line, startFigure } from "./mini.js";

/** keys: the word's key centres; ideal: its line; swipe: the simulated finger's points. */
export function drawSloppyExample(svg, { centers, keys, ideal, swipe, text }) {
  startFigure(svg);
  faintKeys(svg, centers);
  dots(svg, keys, "target", 0.35); // its keys, marked as on the big keyboard
  line(svg, ideal, "ideal");
  line(svg, swipe, "swipe");
  dots(svg, [swipe[0]], "swipe-start", 0.12);
  caption(svg, text);
}
