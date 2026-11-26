// Numbers along a chart's horizontal axis, at round steps, so a reader can tell how big a gap is.

import { number } from "../ui/format.js";
import { el, label } from "./svg.js";

const STEPS = [1, 2, 2.5, 5]; // numbered in steps of 1, 2, 2.5 or 5, times a power of 10
const TICKS = 4; // about this many steps along the axis
const TICK_LENGTH = 4;
const TEXT_BELOW = 17;

/** max: the largest value on the axis; at(value): the x where that value sits; axisY: the axis line. */
export function drawTicks(g, max, at, axisY) {
  const raw = max / TICKS;
  const power = 10 ** Math.floor(Math.log10(raw));
  const step = (STEPS.find((s) => s * power >= raw) ?? 10) * power;
  for (let value = 0; value <= max + 1e-9; value += step) {
    el("line", { x1: at(value), y1: axisY, x2: at(value), y2: axisY + TICK_LENGTH, class: "axis" }, g);
    label(g, at(value), axisY + TEXT_BELOW, number(value, step < 1 ? 1 : 0), "chart-small", "middle");
  }
}
