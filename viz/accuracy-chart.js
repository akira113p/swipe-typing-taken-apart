// The accuracy chart: share of simulated swipes recognized first, by how sloppy the finger is.

import { KEY_WIDTH_MM, toMillimetres } from "../core/keyboard.js";
import { number } from "../ui/format.js";
import { el, label, resetChart, toPoints } from "./svg.js";

const MAX_WIDTH = 600; // wider screens just scale this up
const MIN_WIDTH = 320;
const HEIGHT = 290;
const PLOT = { left: 50, rightMargin: 40, top: 20, bottom: 210 };

/**
 * levels: sloppiness in keys; names: one per level; series: [{ name, className, rates: [0..1 or undefined] }].
 * Each level is a group with data-level, so ui/sloppy.js can show an example swipe for the one you point at;
 * svg.dataset.picked (set there) keeps the picked level highlighted when the chart is redrawn.
 */
export function drawAccuracy(svg, levels, names, series) {
  // Drawn at the width it is shown, so the text keeps its size on a phone.
  const width = Math.round(Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, svg.parentElement.clientWidth)));
  const right = width - PLOT.rightMargin;
  resetChart(svg, width, HEIGHT);
  const step = (right - PLOT.left) / (levels.length - 1);
  const x = (i) => PLOT.left + i * step;
  const y = (rate) => PLOT.bottom - rate * (PLOT.bottom - PLOT.top);
  levels.forEach((level, i) => {
    const group = el("g", { class: `acc-level${String(i) === svg.dataset.picked ? " picked" : ""}`, "data-level": i }, svg);
    el("rect", { x: x(i) - step / 2, y: 0, width: step, height: HEIGHT - 44, class: "acc-band" }, group);
    label(group, x(i), PLOT.bottom + 18, names[i], "chart-small chart-focus", "middle");
    label(group, x(i), PLOT.bottom + 33, `${number(toMillimetres(level), 1)} mm`, "chart-small", "middle");
  });
  for (const rate of [0, 0.25, 0.5, 0.75, 1]) {
    el("line", { x1: PLOT.left, y1: y(rate), x2: right, y2: y(rate), class: "grid" }, svg);
    label(svg, PLOT.left - 8, y(rate) + 4, `${number(rate * 100, 0)}%`, "chart-small", "end");
  }
  label(svg, width / 2, HEIGHT - 20, "about how far the finger lands from each key's centre →", "chart-label chart-focus", "middle");
  label(svg, width / 2, HEIGHT - 4, `a phone key is about ${number(KEY_WIDTH_MM, 0)} mm wide`, "chart-small", "middle");
  series.forEach(({ name, className, rates }, s) => {
    const done = rates.map((rate, i) => [x(i), rate]).filter(([, rate]) => rate !== undefined);
    if (done.length > 1) el("polyline", { points: toPoints(done.map(([px, rate]) => [px, y(rate)])), class: className }, svg);
    for (const [px, rate] of done) {
      el("circle", { cx: px, cy: y(rate), r: 4, class: `${className} dot` }, svg);
      label(svg, px + 6, y(rate) - 6, `${number(rate * 100, 0)}%`, `chart-small ${className}-text`);
    }
    const legendY = PLOT.bottom - 33 + s * 18; // bottom left: the lines start high up there
    el("line", { x1: PLOT.left + 12, y1: legendY, x2: PLOT.left + 32, y2: legendY, class: className }, svg);
    label(svg, PLOT.left + 38, legendY + 4, name, "chart-small");
  });
}
