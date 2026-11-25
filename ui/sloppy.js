// The example under the accuracy chart: point at a level (or slide a finger along them) and the test word,
// swiped by that level's simulated finger, appears over its ideal line, with what the keyboard reads.

import { SLOPPINESS_LEVELS_KEYS as LEVELS, fingerAt } from "../core/accuracy.js";
import { randomSource, simulateSwipe } from "../core/finger.js";
import { toMillimetres } from "../core/keyboard.js";
import { wordKeys } from "../core/path.js";
import { recognize } from "../core/recognizer.js";
import { drawSloppyExample } from "../viz/sloppy-example.js";
import { number } from "./format.js";
import { LEVEL_NAMES } from "./text/accuracy.js";

const WORD = "hello";
const SEED = 9; // the same random draws at every level, only bigger: the swipe drifts further level by level
const $ = (id) => document.getElementById(id);
let level = 2; // "average" until the reader points at another
let getContext;

/** Call once the dictionary is ready. context() returns { lexicon, centers, settings, templates } as they are now. */
export function setUpSloppy(context) {
  getContext = context;
  const chart = $("accuracy-chart");
  chart.addEventListener("pointermove", pick);
  chart.addEventListener("pointerdown", pick);
  // A changed setting can change the reading. The timeout lets the control copy its value first.
  const refresh = () => setTimeout(show, 0);
  document.addEventListener("input", (event) => { if (event.target.dataset.key) refresh(); });
  document.addEventListener("change", (event) => { if (event.target.dataset.key) refresh(); });
  document.addEventListener("click", (event) => { if (event.target.closest("[data-reset]")) refresh(); });
  show();
}

/** A touch is captured by the chart, so the level under the finger is looked up by position. */
function pick(event) {
  const group = document.elementFromPoint(event.clientX, event.clientY)?.closest("[data-level]");
  if (!group || Number(group.dataset.level) === level) return;
  level = Number(group.dataset.level);
  show();
}

function show() {
  const { lexicon, centers, settings, templates } = getContext();
  const chart = $("accuracy-chart");
  chart.dataset.picked = level; // read again by viz/accuracy-chart.js whenever the chart is redrawn
  chart.querySelectorAll("[data-level]").forEach((g) => g.classList.toggle("picked", Number(g.dataset.level) === level));
  const swipe = simulateSwipe(WORD, centers, fingerAt(LEVELS[level]), randomSource(SEED));
  const read = recognize(swipe, templates, lexicon.prior, settings).candidates[0]?.word ?? "nothing";
  const verdict = read === WORD ? `<b class="read-right">${read} ✓</b>` : `<b class="read-wrong">${read} ✗</b>`;
  $("sloppy-word").innerHTML = `Test word: <b>${WORD}</b>. With your settings the keyboard reads ${verdict}`;
  const keys = wordKeys(WORD, centers);
  const text = `${LEVEL_NAMES[level]} finger: about ${number(toMillimetres(LEVELS[level]), 1)} mm off each key`;
  drawSloppyExample($("sloppy-example"), { centers, keys, ideal: keys, swipe, text });
}
