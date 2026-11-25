// The small figures of steps 1–3 in "How it decides" (the judges are in viz/judge-figures.js),
// drawn from your swipe and the word you inspect. The numbers in the captions come from the core.

import { caption, dots, faintKeys, fit, line, startFigure, WIDTH } from "./mini.js";

/** The word's ideal line: straight from key centre to key centre. */
export function drawDictionary(svg, centers, word, text) {
  startFigure(svg);
  faintKeys(svg, centers);
  line(svg, word.path, "ideal");
  dots(svg, word.keys, "key-dot", 0.1);
  caption(svg, text);
}

/** Left: the points the finger reported. Right: the same line as N evenly spaced points. */
export function drawPoints(svg, raw, sampled, [leftText, rightText]) {
  startFigure(svg);
  const half = WIDTH / 2;
  [[raw, 0, leftText], [sampled, half, rightText]].forEach(([points, x, text]) => {
    const placed = fit(points, [x + 0.4, 0.3, half - 0.8, 3.9]);
    line(svg, placed, "swipe");
    dots(svg, placed, "sample", points === raw ? 0.045 : 0.07);
    caption(svg, text, x + half / 2);
  });
}

/** The keys a word may start on (near the swipe's start) and end on (near its end). */
export function drawPrune(svg, centers, swipe, { start, end }, text) {
  startFigure(svg);
  const tint = {};
  for (const letter of start) tint[letter] = "zone-start";
  for (const letter of end) tint[letter] = tint[letter] ? "zone-start zone-end" : "zone-end";
  faintKeys(svg, centers, tint);
  line(svg, swipe, "swipe");
  dots(svg, [swipe[0]], "start-dot", 0.16);
  dots(svg, [swipe[swipe.length - 1]], "end-dot", 0.16);
  caption(svg, text);
}
