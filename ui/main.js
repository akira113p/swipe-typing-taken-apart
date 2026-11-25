// The page: reads the finger, calls the core, shows what it returns.

import { keyCenters } from "../core/keyboard.js";
import { parseWordList } from "../core/lexicon.js";
import { recognize } from "../core/recognizer.js";
import { buildTemplates } from "../core/templates.js";
import { drawKeys } from "../viz/keys.js";
import { createOverlay } from "../viz/overlay.js";
import { WORDS_PER_POINT, setUpAccuracy } from "./accuracy.js";
import { buildControls, readSettings, watchControls } from "./controls.js";
import { stopDemo, wireDemoButtons } from "./demo.js";
import { number } from "./format.js";
import { buildOverview } from "./overview.js";
import { attachPointer } from "./pointer.js";
import { renderResult } from "./render.js";
import { fillText } from "./sections.js";

const $ = (id) => document.getElementById(id);
const centers = keyCenters();
const svg = $("keyboard");
const overlay = createOverlay(drawKeys(svg, centers));
const state = { lexicon: null, templates: null, stroke: [], result: null, inspected: null };
const drawing = {
  onDraw(points) { state.stroke = points; overlay.drawStroke(points); },
  onEnd(points) { state.stroke = points; state.inspected = null; vote(); },
};

function vote() {
  if (state.stroke.length === 0 || !state.templates) return;
  state.result = recognize(state.stroke, state.templates, state.lexicon.prior, readSettings());
  const words = state.result.candidates.map((c) => c.word);
  if (!words.includes(state.inspected)) state.inspected = words[0] ?? null;
  render();
}

const inspect = (word) => { state.inspected = word; render(); };
const render = () => renderResult(state, overlay, inspect);

// N and the smallest shape change every word's prepared line, so the lines are built again.
const prepareWords = () => { state.templates = buildTemplates(state.lexicon.words, centers, readSettings()); };

async function start() {
  buildOverview();
  fillText({ words: "10,000", count: WORDS_PER_POINT });
  buildControls();
  attachPointer(svg, { canStart: () => state.templates !== null, onDraw: (p) => { stopDemo(); drawing.onDraw(p); }, onEnd: drawing.onEnd });
  wireDemoButtons(centers, drawing, () => state.templates !== null);
  watchControls((rebuild) => { if (!state.lexicon) return; if (rebuild) prepareWords(); vote(); });
  setUpAccuracy(() => ({ ...state, centers, settings: readSettings() }));
  $("verdict-meta").textContent = "Loading the dictionary…";
  state.lexicon = parseWordList(await (await fetch("data/words.txt")).text());
  prepareWords();
  fillText({ words: number(state.lexicon.words.length, 0), count: WORDS_PER_POINT });
  $("verdict-meta").textContent = "Swipe a word, or tap one of the examples.";
  document.body.classList.add("ready");
}

start().catch(() => { $("verdict-meta").textContent = "The word list could not be loaded. Open the page through a web server."; });
