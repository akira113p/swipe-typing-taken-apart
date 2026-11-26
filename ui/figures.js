// Feeds the recognizer's result into the bell charts, in the units of the vote table.

import { KEY_WIDTH_MM } from "../core/keyboard.js";
import { drawBells } from "../viz/bell-chart.js";

const BELL_WORDS = 3;
const $ = (id) => document.getElementById(id);

export function renderFigures(candidates, s, inspected) {
  if (candidates.length === 0) {
    $("bell-chart").replaceChildren(); // nothing was judged, so there is nothing to chart (hidden by css/charts.css)
    return;
  }
  const top = candidates.slice(0, BELL_WORDS);
  const focus = candidates.find((c) => c.word === inspected);
  if (focus && !top.includes(focus)) top.push(focus);
  const words = (gapKey) => top.map((c) => ({ word: c.word, gap: c[gapKey], focus: c === focus }));
  // The core measures shape gaps in "box" units (the box side is shapeSize) and distances in key widths.
  const percent = { perCore: 100 / s.shapeSize, name: "%", digits: 0, axis: "shape differs by (%) →" };
  const mm = (axis) => ({ perCore: KEY_WIDTH_MM, name: " mm", digits: 1, axis });
  drawBells($("bell-chart"), [
    { title: "Shape judge", sigma: s.sigmaShape, on: s.useShape, words: words("shapeGap"), unit: percent },
    { title: "Place judge", sigma: s.sigmaPlaceKeys, on: s.usePlace, words: words("placeGap"), unit: mm("position off by (mm) →") },
    { title: "Letters judge", sigma: s.sigmaLettersKeys, on: s.useLetters, words: words("letterGap"), unit: mm("letters missed by (mm) →") },
  ]);
}
