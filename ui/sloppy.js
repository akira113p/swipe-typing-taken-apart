// The example under the accuracy chart, hidden until you point at a level: the test word swiped by that level's
// finger, over its ideal line, and what the keyboard reads. A mouse leaving the chart hides it; a click or tap keeps it.

import { SLOPPINESS_LEVELS_KEYS as LEVELS, fingerAt } from "../core/accuracy.js";
import { randomSource, simulateSwipe } from "../core/finger.js";
import { KEY_WIDTH_MM, toMillimetres } from "../core/keyboard.js";
import { wordKeys } from "../core/path.js";
import { recognize } from "../core/recognizer.js";
import { drawSloppyExample } from "../viz/sloppy-example.js";
import { number } from "./format.js";
import { buildSloppyLegend } from "./legend.js";
import { LEVEL_NAMES } from "./text/accuracy.js";

const WORD = "hello";
const SEED = 9; // the same random draws at every level, only bigger: the swipe drifts further level by level
const $ = (id) => document.getElementById(id);
const view = { level: null, kept: false, context: null }; // level: the one pointed at, null = hidden

/** Call once the dictionary is ready. context() returns { lexicon, centers, settings, templates } as they are now. */
export function setUpSloppy(context) {
  view.context = context;
  buildSloppyLegend($("sloppy-legend"));
  const chart = $("accuracy-chart");
  chart.addEventListener("pointermove", (event) => pick(event, false));
  chart.addEventListener("pointerdown", (event) => pick(event, true));
  chart.addEventListener("pointerleave", () => { if (!view.kept) pickLevel(null); });
  // A changed setting can change the reading. The timeout lets the control copy its value first.
  const refresh = () => setTimeout(show, 0);
  for (const type of ["input", "change"]) document.addEventListener(type, (event) => { if (event.target.dataset.key) refresh(); });
  document.addEventListener("click", (event) => { if (event.target.closest("[data-reset]")) refresh(); });
}

/** A touch is captured by the chart, so the level under the finger is looked up by position. */
function pick(event, keep) {
  const group = document.elementFromPoint(event.clientX, event.clientY)?.closest("[data-level]");
  if (!group) return;
  view.kept ||= keep;
  if (Number(group.dataset.level) !== view.level) pickLevel(Number(group.dataset.level));
}

function pickLevel(level) {
  view.level = level;
  const chart = $("accuracy-chart");
  chart.dataset.picked = level ?? ""; // read again by viz/accuracy-chart.js whenever the chart is redrawn
  chart.querySelectorAll("[data-level]").forEach((g) => g.classList.toggle("picked", Number(g.dataset.level) === level));
  show();
}

function show() {
  $("sloppy").hidden = view.level === null;
  $("sloppy-hint").hidden = view.level !== null;
  if (view.level === null) return;
  const { lexicon, centers, settings, templates } = view.context();
  const swipe = simulateSwipe(WORD, centers, fingerAt(LEVELS[view.level]), randomSource(SEED));
  const read = recognize(swipe, templates, lexicon.prior, settings).candidates[0]?.word ?? "nothing";
  const verdict = read === WORD ? `<b class="read-right">${read} ✓</b>` : `<b class="read-wrong">${read} ✗</b>`;
  $("sloppy-word").innerHTML = `Test word: <b>${WORD}</b>. With your settings the keyboard reads ${verdict}`;
  const keys = wordKeys(WORD, centers);
  const text = `${LEVEL_NAMES[view.level]} finger: about ${number(toMillimetres(LEVELS[view.level]), 1)} mm off each key`;
  drawSloppyExample($("sloppy-example"), { centers, keys, ideal: keys, swipe, text, keyMm: number(KEY_WIDTH_MM, 1) });
}
