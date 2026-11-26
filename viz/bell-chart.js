// The bell charts: each judge's bell curve, with the leading words placed on it by their gap.

import { bellHeight } from "../core/vote.js";
import { number } from "../ui/format.js";
import { placeLabels } from "./label-space.js";
import { el, label, resetChart, toPoints } from "./svg.js";
import { drawTicks } from "./ticks.js";

const PANEL_WIDTH = 200;
const HEIGHT = 172;
const PLOT = { left: 42, right: 190, top: 48, bottom: 126 }; // left: room for "100%"
const CURVE_STEPS = 60;

/**
 * One small SVG per judge inside `box`, so the page can put them side by side or one under the other
 * (css/charts.css). judges: [{ title, sigma, on, words: [{ word, gap, focus }], unit }]. Gaps and sigma are in
 * the core's units; unit = { perCore, name, digits, axis } shows them as the vote table does (mm or %).
 */
export function drawBells(box, judges) {
  box.replaceChildren();
  for (const judge of judges) {
    const svg = el("svg", { class: judge.on ? "bell-panel" : "bell-panel chart-off" }, box);
    resetChart(svg, PANEL_WIDTH, HEIGHT);
    drawPanel(svg, judge);
  }
}

function drawPanel(g, { title, sigma, on, words, unit }) {
  const xMax = Math.max(3 * sigma, ...words.map((w) => w.gap * 1.1));
  const x = (gap) => PLOT.left + (gap / xMax) * (PLOT.right - PLOT.left);
  const y = (h) => PLOT.bottom - h * (PLOT.bottom - PLOT.top);
  label(g, PLOT.left, 16, on ? title : `${title} (off)`, "chart-title");
  const curve = Array.from({ length: CURVE_STEPS + 1 }, (_, k) => (k / CURVE_STEPS) * xMax);
  el("polyline", { points: toPoints(curve.map((gap) => [x(gap), y(bellHeight(gap, sigma))])), class: "bell" }, g);
  el("line", { x1: PLOT.left, y1: PLOT.bottom, x2: PLOT.right, y2: PLOT.bottom, class: "axis" }, g);
  el("line", { x1: PLOT.left, y1: PLOT.top, x2: PLOT.left, y2: PLOT.bottom, class: "axis" }, g);
  label(g, 2, 34, "score ↑", "chart-small");
  label(g, PLOT.left - 4, PLOT.top + 4, "100%", "chart-small", "end");
  label(g, PLOT.left - 4, PLOT.bottom + 4, "0%", "chart-small", "end");
  drawTicks(g, xMax * unit.perCore, (shown) => x(shown / unit.perCore), PLOT.bottom);
  label(g, PLOT.right, HEIGHT - 4, unit.axis, "chart-small", "end");
  el("line", { x1: x(sigma), y1: PLOT.top - 6, x2: x(sigma), y2: PLOT.bottom, class: "sigma-line" }, g);
  const sigmaText = `σ = ${number(sigma * unit.perCore, unit.digits)}${unit.name}`;
  label(g, x(sigma) + 3, PLOT.top - 8, sigmaText, "chart-small");
  const sigmaBox = { left: x(sigma), top: PLOT.top - 20, right: x(sigma) + 8 + sigmaText.length * 6.6, bottom: PLOT.top - 4 };
  const dots = words.map((w) => ({ ...w, x: x(w.gap), y: y(bellHeight(w.gap, sigma)), text: w.word }));
  drawWords(g, dots.sort((a, b) => b.focus - a.focus), sigmaBox);
}

/** dots: the inspected word first, so its label gets the place right beside its dot. Its dot is painted last, on top. */
function drawWords(g, dots, sigmaBox) {
  const area = { left: PLOT.left + 2, right: PANEL_WIDTH - 2, top: PLOT.top - 20, bottom: PLOT.bottom - 2 };
  const spots = placeLabels(dots, area, [sigmaBox]);
  dots.forEach((d, k) => label(g, ...spots[k], d.word, d.focus ? "chart-small chart-focus" : "chart-small"));
  for (const d of [...dots].reverse()) {
    el("circle", { cx: d.x, cy: d.y, r: d.focus ? 5 : 3.5, class: d.focus ? "bell-dot bell-focus" : "bell-dot" }, g);
  }
}
