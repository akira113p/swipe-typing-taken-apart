// The accuracy chart: share of simulated swipes recognized first, by how sloppy the finger is.

import { number } from "../ui/format.js";
import { el, label, resetChart, toPoints } from "./svg.js";

const WIDTH = 600;
const HEIGHT = 260;
const PLOT = { left: 50, right: 545, top: 20, bottom: 210 };

/** levels: sloppiness in keys; series: [{ name, className, rates: [0..1 or undefined] }] */
export function drawAccuracy(svg, levels, series) {
  resetChart(svg, WIDTH, HEIGHT);
  const step = (PLOT.right - PLOT.left) / (levels.length - 1);
  const x = (i) => PLOT.left + i * step;
  const y = (rate) => PLOT.bottom - rate * (PLOT.bottom - PLOT.top);
  for (const rate of [0, 0.25, 0.5, 0.75, 1]) {
    el("line", { x1: PLOT.left, y1: y(rate), x2: PLOT.right, y2: y(rate), class: "grid" }, svg);
    label(svg, PLOT.left - 8, y(rate) + 4, `${number(rate * 100, 0)}%`, "chart-small", "end");
  }
  levels.forEach((level, i) => label(svg, x(i), PLOT.bottom + 18, `${number(level, 2)}`, "chart-small", "middle"));
  label(svg, (PLOT.left + PLOT.right) / 2, HEIGHT - 8, "sloppiness of the finger (key widths) →", "chart-small", "middle");
  series.forEach(({ name, className, rates }, s) => {
    const done = rates.map((rate, i) => [x(i), rate]).filter(([, rate]) => rate !== undefined);
    if (done.length > 1) el("polyline", { points: toPoints(done.map(([px, rate]) => [px, y(rate)])), class: className }, svg);
    for (const [px, rate] of done) {
      el("circle", { cx: px, cy: y(rate), r: 4, class: `${className} dot` }, svg);
      label(svg, px + 6, y(rate) - 6, `${number(rate * 100, 0)}%`, `chart-small ${className}-text`);
    }
    el("line", { x1: PLOT.right - 160, y1: 30 + s * 18, x2: PLOT.right - 140, y2: 30 + s * 18, class: className }, svg);
    label(svg, PLOT.right - 134, 34 + s * 18, name, "chart-small");
  });
}
