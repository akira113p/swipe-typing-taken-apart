// Feeds the small figures in the "How it decides" cards with the last swipe and the word you inspect.

import { keyCenters } from "../core/keyboard.js";
import { keyLetters } from "../core/path.js";
import { drawLetters, drawPlace, drawShape } from "../viz/judge-figures.js";
import { drawDictionary, drawPoints, drawPrune } from "../viz/step-figures.js";
import { number } from "./format.js";

const centers = keyCenters();
const MAX_DRAWN_WORDS = 8; // the leading survivors; more lines turn the pruning figure into a blur
const WORD_FIGURES = ["step-dictionary", "step-shape", "step-place", "step-letters"];
const $ = (id) => document.getElementById(id);

/** state: { stroke, result, inspected }; s: the settings. */
export function renderSteps({ stroke, result, inspected }, s) {
  const { gesture, gestureShape, funnel, candidates } = result;
  drawPoints($("step-points"), stroke, gesture, [`your finger: ${stroke.length} points`, `${gesture.length} points, evenly spaced`]);
  drawPrune($("step-prune"), centers, gesture, s.usePruning ? s.pruneRadiusKeys : 0,
    s.usePruning ? candidates.slice(0, MAX_DRAWN_WORDS).map((c) => c.path) : [], pruneText(funnel, s));

  const word = candidates.find((c) => c.word === inspected);
  if (!word) {
    WORD_FIGURES.forEach((id) => $(id).replaceChildren()); // no word left to show (hidden by css/charts.css)
    return;
  }
  drawDictionary($("step-dictionary"), centers, word, `${word.word}: ${keyLetters(word.word).join(" → ")}`);
  drawShape($("step-shape"), gestureShape, word.shape,
    ["your swipe", word.word, `on top: gap ${number(word.shapeGap, 2)}`]);
  drawPlace($("step-place"), centers, gesture, word, `${word.word}: average gap ${number(word.placeGap, 2)} keys`);
  drawLetters($("step-letters"), centers, gesture, word, s.sigmaLettersKeys,
    `${word.word}: average miss ${number(word.letterGap, 2)} keys`);
  // A judge that is switched off is still measured, but its figure fades like its bell curve.
  $("step-shape").classList.toggle("chart-off", !s.useShape);
  $("step-place").classList.toggle("chart-off", !s.usePlace);
  $("step-letters").classList.toggle("chart-off", !s.useLetters);
}

function pruneText(funnel, s) {
  const total = number(funnel[0][1], 0);
  if (!s.usePruning) return `pruning off: all ${total} words go to the judges`;
  return `kept ${number(funnel[1][1], 0)} of ${total} words`;
}
