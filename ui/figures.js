// Feeds the recognizer's result into the penalty chart and the bell chart.

import { drawBells } from "../viz/bell-chart.js";
import { drawPenalties } from "../viz/penalty-chart.js";

const BELL_WORDS = 3;
const $ = (id) => document.getElementById(id);

export function renderFigures(candidates, s, inspected) {
  if (candidates.length === 0) {
    // Nothing was judged, so there is nothing to chart (an empty chart is hidden by css/charts.css).
    $("penalty-chart").replaceChildren();
    $("bell-chart").replaceChildren();
    return;
  }
  drawPenalties($("penalty-chart"), candidates, inspected);
  const top = candidates.slice(0, BELL_WORDS);
  const focus = candidates.find((c) => c.word === inspected);
  if (focus && !top.includes(focus)) top.push(focus);
  const words = (gapKey) => top.map((c) => ({ word: c.word, gap: c[gapKey], focus: c === focus }));
  drawBells($("bell-chart"), [
    { title: "Shape judge", sigma: s.sigmaShape, unit: "box", on: s.useShape, words: words("shapeGap") },
    { title: "Place judge", sigma: s.sigmaPlaceKeys, unit: "keys", on: s.usePlace, words: words("placeGap") },
    { title: "Letters judge", sigma: s.sigmaLettersKeys, unit: "keys", on: s.useLetters, words: words("letterGap") },
  ]);
}
