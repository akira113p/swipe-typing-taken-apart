// The accuracy test: the same simulated swipes, read with your settings and with the defaults.
// It runs one word at a time, so the chart and the word wall fill in while you watch.

import { SLOPPINESS_LEVELS_KEYS as LEVELS, shareRight, swipeTest, testAtLevel } from "../core/accuracy.js";
import { DEFAULTS } from "../core/settings.js";
import { buildTemplates } from "../core/templates.js";
import { drawAccuracy } from "../viz/accuracy-chart.js";
import { addWord, clearWall } from "../viz/word-wall.js";
import { LEVEL_NAMES } from "./text/accuracy.js";
export const WORDS_PER_POINT = 100;
const WORDS_PER_FRAME = 4; // swipes tested between two repaints: fast, but still visible
const $ = (id) => document.getElementById(id);
const status = (text) => { $("accuracy-status").textContent = text; };
const nextFrame = () => new Promise((resolve) => setTimeout(resolve, 0));
const series = [
  { name: "your settings", className: "acc-yours", rates: [] },
  { name: "default settings", className: "acc-default", rates: [] },
];
const draw = () => drawAccuracy($("accuracy-chart"), LEVELS, LEVEL_NAMES, series);
let defaultResults = null; // the defaults never change, so their run is done once and kept
const testAt = ({ lexicon, centers }, templates, options, i) =>
  testAtLevel(i, { words: lexicon.words, prior: lexicon.prior, templates, centers, options, count: WORDS_PER_POINT });

/** getContext() returns { lexicon, centers, settings, templates } as they are right now. */
export function setUpAccuracy(getContext) {
  draw();
  const outdated = () => { if (series[0].rates.length) status("Settings changed: run the test again."); }; // by any control
  document.addEventListener("input", (event) => { if (event.target.dataset.key) outdated(); });
  document.addEventListener("click", (event) => { if (event.target.closest("[data-reset]")) outdated(); });
  $("run-accuracy").addEventListener("click", () => run(getContext()));
}

async function run(context) {
  if (!context.lexicon) return;
  $("run-accuracy").disabled = true;
  if (!defaultResults) {
    status("Testing the default settings first…");
    await nextFrame(); // let the message show before the work starts
    const bank = buildTemplates(context.lexicon.words, context.centers, DEFAULTS);
    defaultResults = LEVELS.map((_, i) => [...swipeTest(testAt(context, bank, DEFAULTS, i))]);
  }
  [series[0].rates, series[1].rates] = [[], defaultResults.map(shareRight)];
  draw(); // the defaults line first, then yours grows level by level
  clearWall($("word-wall"), LEVEL_NAMES);
  for (let i = 0; i < LEVELS.length; i++) {
    const results = [];
    for (const result of swipeTest(testAt(context, context.templates, context.settings, i))) {
      addWord($("word-wall"), i, { ...result, defaultGuess: defaultResults[i][results.length].guess });
      results.push(result);
      if (results.length % WORDS_PER_FRAME === 0) {
        status(`${LEVEL_NAMES[i]} finger: “${result.word}” read as “${result.guess ?? "nothing"}”`);
        await nextFrame();
      }
    }
    series[0].rates[i] = shareRight(results);
    draw();
  }
  status(`Done: ${WORDS_PER_POINT} words per level, the same swipes for both lines.`);
  $("run-accuracy").disabled = false;
}
