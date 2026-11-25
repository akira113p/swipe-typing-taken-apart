// The penalty chart: the penalty points each judge gave the leading words. Fewest points wins.

import { number, percent } from "../ui/format.js";
import { el, label, resetChart } from "./svg.js";
import { winnerBand, winnerLine, winnerTag } from "./winner-marks.js";

export const PARTS = [
  ["shape", "Shape"], ["place", "Place"], ["letters", "Letters"], ["frequency", "Frequency"],
];
const ROWS = 5;
const ROW_HEIGHT = 30;
const MAX_WIDTH = 600; // wider screens just scale this up
const MIN_WIDTH = 280;
const WORD_COLUMN = 90;
const TOTAL_COLUMN = 120;
const LEGEND_ITEM = 105; // room for one coloured square and its name
const LEGEND_LINE = 22;
const TOP = 22; // room for the line that says which way is better

export function drawPenalties(svg, candidates, inspected) {
  // Drawn at the width it is shown, up to 600: on a phone a 600-wide drawing squeezed into ~330 pixels
  // would shrink the text to about 6 pixels.
  const width = Math.round(Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, svg.parentElement.clientWidth)));
  const perLine = Math.max(1, Math.floor((width - WORD_COLUMN) / LEGEND_ITEM));
  const legendLines = Math.ceil(PARTS.length / perLine);
  const rows = candidates.slice(0, ROWS);
  const height = TOP + rows.length * ROW_HEIGHT + 16 + legendLines * LEGEND_LINE;
  resetChart(svg, width, height);
  const most = Math.max(...rows.map((c) => c.points), 1e-9);
  const scale = (width - WORD_COLUMN - TOTAL_COLUMN) / most;
  label(svg, WORD_COLUMN, 13, "← fewer points, better", "chart-small");
  winnerBand(svg, width, TOP, ROW_HEIGHT);
  rows.forEach((c, r) => {
    const y = TOP + r * ROW_HEIGHT + 6;
    const wordClass = c.word === inspected ? "chart-word chart-focus" : "chart-word";
    label(svg, WORD_COLUMN - 10, y + 15, c.word, wordClass, "end");
    let x = WORD_COLUMN;
    for (const [part] of PARTS) {
      const width = c.penalties[part] * scale;
      if (width > 0) el("rect", { x, y, width, height: ROW_HEIGHT - 10, class: `pen-${part}` }, svg);
      x += width;
    }
    const total = label(svg, x + 8, y + 15, `${number(c.points, 2)} pts → ${percent(c.share)}`);
    if (r === 0) winnerTag(svg, x + 16 + total.getComputedTextLength(), y + 10);
  });
  winnerLine(svg, WORD_COLUMN + rows[0].points * scale, TOP, TOP + rows.length * ROW_HEIGHT); // over the bars
  drawLegend(svg, TOP + rows.length * ROW_HEIGHT + 26, perLine);
}

/** The colour key, perLine entries per line. */
function drawLegend(svg, top, perLine) {
  PARTS.forEach(([part, name], i) => {
    const x = WORD_COLUMN + (i % perLine) * LEGEND_ITEM;
    const y = top + Math.floor(i / perLine) * LEGEND_LINE;
    el("rect", { x, y: y - 11, width: 14, height: 14, class: `pen-${part}` }, svg);
    label(svg, x + 20, y, name);
  });
}
