// The page: reads the finger, calls the core, shows what it returns.

import { pathLength, resample, roundCorners, wordTemplate } from "../core/geometry.js";
import { keyCenters } from "../core/keyboard.js";
import { parseWordList } from "../core/lexicon.js";
import { DEFAULTS, buildTemplates, recognize } from "../core/recognizer.js";
import { createKeyboardView } from "../viz/keyboard.js";

const DEMO_DURATION_MS = 650;
const DEMO_STEP_KEYS = 0.08;     // the demo swipe reports a point every 0.08 key widths, like a finger
const SHOWN_CANDIDATES = 3;

const $ = (id) => document.getElementById(id);
const centers = keyCenters();
const svg = $("keyboard");
const view = createKeyboardView(svg, centers);
const switches = { useShape: $("use-shape"), usePlace: $("use-place"), usePrior: $("use-prior") };

let lexicon = null;
let templates = null;
let stroke = [];
let drawing = false;
let result = null;
let inspected = null;

// ---------- the finger (touch, pen or mouse: Pointer Events cover all three) ----------

function toKeys(event) {
  const p = new DOMPoint(event.clientX, event.clientY).matrixTransform(svg.getScreenCTM().inverse());
  return [p.x, p.y];
}

svg.addEventListener("pointerdown", (event) => {
  if (!templates || event.button > 0) return;
  svg.setPointerCapture(event.pointerId);
  drawing = true;
  stroke = [toKeys(event)];
  view.drawStroke(stroke);
});

svg.addEventListener("pointermove", (event) => {
  if (!drawing) return;
  const events = event.getCoalescedEvents ? event.getCoalescedEvents() : [event];
  for (const e of events) stroke.push(toKeys(e));
  view.drawStroke(stroke);
});

function finishStroke() {
  if (!drawing) return;
  drawing = false;
  inspected = null;
  vote();
}
svg.addEventListener("pointerup", finishStroke);
svg.addEventListener("pointercancel", finishStroke);

// ---------- the demo finger: slides along a word's keys with rounded corners ----------

function demo(word) {
  if (!templates) return;
  const path = roundCorners(wordTemplate(word, centers));
  const points = resample(path, Math.max(2, Math.round(pathLength(path) / DEMO_STEP_KEYS)));
  const start = performance.now();
  inspected = null;
  function frame(now) {
    const shown = Math.max(1, Math.ceil(points.length * Math.min(1, (now - start) / DEMO_DURATION_MS)));
    stroke = points.slice(0, shown);
    view.drawStroke(stroke);
    if (shown < points.length) requestAnimationFrame(frame);
    else vote();
  }
  requestAnimationFrame(frame);
}

document.querySelectorAll("[data-demo]").forEach((button) => {
  button.addEventListener("click", () => demo(button.dataset.demo));
});

// ---------- the vote ----------

function settings() {
  return Object.fromEntries(Object.entries(switches).map(([key, input]) => [key, input.checked]));
}

function vote() {
  if (stroke.length === 0) return;
  result = recognize(stroke, templates, lexicon.prior, settings());
  if (!result.candidates.some((c) => c.word === inspected)) inspected = result.candidates[0]?.word ?? null;
  render();
}

for (const input of Object.values(switches)) input.addEventListener("change", vote);

// ---------- showing it ----------

const percent = (x) => `${(100 * x).toFixed(x < 0.1 ? 1 : 0)}%`;

function render() {
  const { candidates, funnel, gesture } = result;
  const focus = candidates.find((c) => c.word === inspected);
  view.drawResult({
    points: stroke,
    gesture,
    inspected: focus?.path ?? null,
    others: candidates.slice(0, SHOWN_CANDIDATES).filter((c) => c !== focus).map((c) => c.path),
    tunnelRadius: settings().usePlace ? DEFAULTS.tunnelRadiusKeys : 0,
  });
  renderVerdict(candidates);
  renderRunners(candidates);
  $("funnel").textContent = funnel.map(([name, count]) => `${count.toLocaleString("en")} ${name}`).join("  →  ");
  renderTable(candidates);
}

function renderVerdict(candidates) {
  const best = candidates[0];
  $("verdict-word").textContent = best ? best.word : "?";
  $("verdict-meta").textContent = best
    ? `${percent(best.share)} of the vote${candidates[1] ? `, ahead of ${candidates[1].word} (${percent(candidates[1].share)})` : ""}.`
    : "No word is close enough to that line. Try again, or switch a judge off.";
}

function renderRunners(candidates) {
  const list = $("runners");
  list.replaceChildren();
  for (const c of candidates.slice(0, SHOWN_CANDIDATES)) {
    const button = document.createElement("button");
    button.className = `runner${c.word === inspected ? " selected" : ""}`;
    button.innerHTML = `<span class="w"></span><span class="bar"></span><span class="n"></span>`;
    button.querySelector(".w").textContent = c.word;
    button.querySelector(".bar").style.width = `${Math.max(2, 100 * c.share)}%`;
    button.querySelector(".n").textContent = percent(c.share);
    button.addEventListener("click", () => { inspected = c.word; render(); });
    list.appendChild(button);
  }
}

function renderTable(candidates) {
  const body = $("detail-rows");
  body.replaceChildren();
  for (const c of candidates.slice(0, 8)) {
    const row = document.createElement("tr");
    const cells = [
      c.word,
      c.shapeGap === undefined ? "off" : c.shapeGap.toFixed(3),
      c.placeGap === undefined ? "off" : c.inTunnel ? "0 (in the tunnel)" : `${c.placeGap.toFixed(2)} keys`,
      Math.round(c.prior * 1e6).toLocaleString("en"),
      percent(c.share),
    ];
    for (const text of cells) {
      const td = document.createElement("td");
      td.textContent = text;
      row.appendChild(td);
    }
    body.appendChild(row);
  }
}

// ---------- start ----------

async function load() {
  const text = await (await fetch("data/words.txt")).text();
  lexicon = parseWordList(text);
  templates = buildTemplates(lexicon.words, centers);
  $("word-count").textContent = lexicon.words.length.toLocaleString("en");
  document.body.classList.add("ready");
}

load().catch(() => {
  $("verdict-meta").textContent = "The word list could not be loaded. Open the page through a web server.";
});
