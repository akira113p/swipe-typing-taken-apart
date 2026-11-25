// The example under the accuracy chart: point at a level (or slide a finger along them) and a "hello"
// swiped by that level's simulated finger appears, over the word's ideal line.

import { SLOPPINESS_LEVELS_KEYS as LEVELS, fingerAt } from "../core/accuracy.js";
import { randomSource, simulateSwipe } from "../core/finger.js";
import { keyCenters, toMillimetres } from "../core/keyboard.js";
import { wordKeys } from "../core/path.js";
import { drawSloppyExample } from "../viz/sloppy-example.js";
import { number } from "./format.js";
import { LEVEL_NAMES } from "./text/accuracy.js";

const WORD = "hello";
const SEED = 9; // the same random draws at every level, only bigger: the swipe drifts further level by level
const START_LEVEL = 2;
const centers = keyCenters();
const keys = wordKeys(WORD, centers);
const chart = document.getElementById("accuracy-chart");

function show(i) {
  if (chart.dataset.picked === String(i)) return;
  chart.dataset.picked = i; // read again by viz/accuracy-chart.js whenever the chart is redrawn
  chart.querySelectorAll("[data-level]").forEach((g) => g.classList.toggle("picked", g.dataset.level === String(i)));
  const swipe = simulateSwipe(WORD, centers, fingerAt(LEVELS[i]), randomSource(SEED));
  const text = `${LEVEL_NAMES[i]} finger: about ${number(toMillimetres(LEVELS[i]), 1)} mm off each key`;
  drawSloppyExample(document.getElementById("sloppy-example"), { centers, keys, ideal: keys, swipe, text });
}

/** A touch is captured by the chart, so the level under the finger is looked up by position. */
function pick(event) {
  const level = document.elementFromPoint(event.clientX, event.clientY)?.closest("[data-level]");
  if (level && chart.contains(level)) show(Number(level.dataset.level));
}

chart.addEventListener("pointermove", pick);
chart.addEventListener("pointerdown", pick);
show(START_LEVEL);
