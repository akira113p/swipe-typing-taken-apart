// The bell chart: each judge's bell curve, with the leading words placed on it by their gap.

import { bellHeight } from "../core/vote.js";
import { number } from "../ui/format.js";
import { el, label, resetChart, toPoints } from "./svg.js";

const PANEL_WIDTH = 200;
const HEIGHT = 165;
const PLOT = { left: 36, right: 190, top: 42, bottom: 130 };
const CURVE_STEPS = 60;

/** judges: [{ title, sigma, unit, on, words: [{ word, gap, focus }] }] */
export function drawBells(svg, judges) {
  resetChart(svg, PANEL_WIDTH * judges.length, HEIGHT);
  judges.forEach((judge, i) => {
    const panel = el("g", { transform: `translate(${i * PANEL_WIDTH},0)`, class: judge.on ? "" : "chart-off" }, svg);
    drawPanel(panel, judge);
  });
}

function drawPanel(g, { title, sigma, unit, on, words }) {
  const xMax = Math.max(3 * sigma, ...words.map((w) => w.gap * 1.1));
  const x = (gap) => PLOT.left + (gap / xMax) * (PLOT.right - PLOT.left);
  const y = (h) => PLOT.bottom - h * (PLOT.bottom - PLOT.top);
  label(g, PLOT.left, 16, on ? title : `${title} (off)`, "chart-title");
  const curve = Array.from({ length: CURVE_STEPS + 1 }, (_, k) => (k / CURVE_STEPS) * xMax);
  el("polyline", { points: toPoints(curve.map((gap) => [x(gap), y(bellHeight(gap, sigma))])), class: "bell" }, g);
  el("line", { x1: PLOT.left, y1: PLOT.bottom, x2: PLOT.right, y2: PLOT.bottom, class: "axis" }, g);
  el("line", { x1: PLOT.left, y1: PLOT.top, x2: PLOT.left, y2: PLOT.bottom, class: "axis" }, g);
  label(g, 2, PLOT.top - 10, "score ↑", "chart-small");
  label(g, PLOT.left - 4, PLOT.top + 4, "100%", "chart-small", "end");
  label(g, PLOT.left - 4, PLOT.bottom + 4, "0%", "chart-small", "end");
  el("line", { x1: x(sigma), y1: PLOT.top, x2: x(sigma), y2: PLOT.bottom, class: "sigma-line" }, g);
  label(g, x(sigma) + 3, PLOT.top + 10, `σ = ${number(sigma, 2)}`, "chart-small");
  label(g, PLOT.right, HEIGHT - 10, `gap (${unit}) →`, "chart-small", "end");
  label(g, PLOT.left, HEIGHT - 10, "0", "chart-small", "middle");
  words.forEach(({ word, gap, focus }, k) => {
    const [cx, cy] = [x(gap), y(bellHeight(gap, sigma))];
    el("circle", { cx, cy, r: focus ? 5 : 3.5, class: focus ? "bell-dot bell-focus" : "bell-dot" }, g);
    // Labels go below dots high on the curve and above dots low on it, stacked so they never overlap.
    const labelY = cy < (PLOT.top + PLOT.bottom) / 2 ? cy + 16 + k * 12 : cy - 8 - k * 12;
    label(g, Math.min(cx + 6, PLOT.right - 30), labelY, word, focus ? "chart-small chart-focus" : "chart-small");
  });
}
