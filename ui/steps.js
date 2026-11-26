// Feeds the small figures in the "How it decides" cards with the last swipe and the word you inspect.

import { keyCenters, keysNear } from "../core/keyboard.js";
import { keyLetters } from "../core/path.js";
import { drawLetters, drawPlace, drawShape } from "../viz/judge-figures.js";
import { drawDictionary, drawPoints, drawPrune } from "../viz/step-figures.js";
import { millimetres, number, percent } from "./format.js";

const centers = keyCenters();
const WORD_FIGURES = ["step-dictionary", "step-shape", "step-place", "step-letters"];
const $ = (id) => document.getElementById(id);

/** state: { stroke, result, inspected }; s: the settings. */
export function renderSteps({ stroke, result, inspected }, s) {
  const { gesture, gestureShape, funnel, candidates } = result;
  drawPoints($("step-points"), stroke, gesture, [`your finger: ${stroke.length} points`, `${gesture.length} points, evenly spaced`]);
  const near = (point) => (s.usePruning ? keysNear(point, centers, s.pruneRadiusKeys) : []);
  const zones = { start: near(gesture[0]), end: near(gesture[gesture.length - 1]) };
  drawPrune($("step-prune"), centers, gesture, zones, pruneText(funnel, s));

  const word = candidates.find((c) => c.word === inspected);
  if (!word) {
    WORD_FIGURES.forEach((id) => $(id).replaceChildren()); // no word left to show (hidden by css/charts.css)
    return;
  }
  drawDictionary($("step-dictionary"), centers, word, `${word.word}: ${keyLetters(word.word).join(" → ")}`);
  // The same units as the vote table: the shape as a share of the drawing's size, distances in mm on a phone.
  drawShape($("step-shape"), gestureShape, word.shape,
    ["your swipe", word.word, `on top: differs by ${percent(word.shapeGap / s.shapeSize)}`]);
  drawPlace($("step-place"), centers, gesture, word, `${word.word}: off by ${millimetres(word.placeGap)} on average`);
  drawLetters($("step-letters"), centers, gesture, word, s.sigmaLettersKeys,
    `${word.word}: letters missed by ${millimetres(word.letterGap)} on average`);
  // A judge that is switched off is still measured, but its figure fades like its bell curve.
  $("step-shape").classList.toggle("chart-off", !s.useShape);
  $("step-place").classList.toggle("chart-off", !s.usePlace);
  $("step-letters").classList.toggle("chart-off", !s.useLetters);
}

function pruneText(funnel, s) {
  const total = number(funnel[0][1], 0);
  if (!s.usePruning) return `pruning off: all ${total} words go to the judges`;
  return `${number(funnel[1][1], 0)} of ${total} words kept`;
}
