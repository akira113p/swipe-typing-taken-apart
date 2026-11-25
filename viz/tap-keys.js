// Under the accuracy chart's x axis: what each level of sloppiness means. One key per level, with taps
// aimed at its centre; red ones landed outside it. The taps come from core/finger.js.

import { sampleTaps } from "../core/finger.js";
import { KEY_HEIGHT_KEYS } from "../core/keyboard.js";
import { el } from "./svg.js";

const TAPS = 40;
const SEED = 1; // the same random taps at every level, only spread wider

/** A key of width `keyPx` centred on (cx, cy), and TAPS taps with a typical miss of `miss` key widths. */
export function drawTapKey(svg, cx, cy, keyPx, miss) {
  const [w, h] = [keyPx, keyPx * KEY_HEIGHT_KEYS];
  el("rect", { x: cx - w / 2, y: cy - h / 2, width: w, height: h, rx: 3, class: "tap-key" }, svg);
  for (const [dx, dy] of sampleTaps(miss, TAPS, SEED)) {
    const outside = Math.abs(dx) > 0.5 || Math.abs(dy) > KEY_HEIGHT_KEYS / 2;
    el("circle", { cx: cx + dx * keyPx, cy: cy + dy * keyPx, r: 1.6, class: outside ? "tap tap-out" : "tap" }, svg);
  }
}
