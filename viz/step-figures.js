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

/** The circles around the swipe's two ends, and the words whose first and last keys fall inside. */
export function drawPrune(svg, centers, swipe, radius, kept, text) {
  startFigure(svg);
  faintKeys(svg, centers);
  for (const path of kept) line(svg, path, "runner-up");
  if (radius > 0) dots(svg, [swipe[0], swipe[swipe.length - 1]], "prune-zone", radius);
  line(svg, swipe, "swipe");
  caption(svg, text);
}
