// The penalty chart: the penalty points each judge gave the leading words. Fewest points wins.

import { number, percent } from "../ui/format.js";
import { el, label, resetChart } from "./svg.js";

export const PARTS = [
  ["shape", "Shape"], ["place", "Place"], ["letters", "Letters"], ["frequency", "Frequency"],
];
const ROWS = 5;
const ROW_HEIGHT = 30;
const WIDTH = 600;
const WORD_COLUMN = 100;
const TOTAL_COLUMN = 130;

export function drawPenalties(svg, candidates, inspected) {
  const rows = candidates.slice(0, ROWS);
  const height = rows.length * ROW_HEIGHT + 40;
  resetChart(svg, WIDTH, height);
  const most = Math.max(...rows.map((c) => c.points), 1e-9);
  const scale = (WIDTH - WORD_COLUMN - TOTAL_COLUMN) / most;
  rows.forEach((c, r) => {
    const y = r * ROW_HEIGHT + 6;
    const wordClass = c.word === inspected ? "chart-word chart-focus" : "chart-word";
    label(svg, WORD_COLUMN - 10, y + 15, c.word, wordClass, "end");
    let x = WORD_COLUMN;
    for (const [part] of PARTS) {
      const width = c.penalties[part] * scale;
      if (width > 0) el("rect", { x, y, width, height: ROW_HEIGHT - 10, class: `pen-${part}` }, svg);
      x += width;
    }
    label(svg, x + 8, y + 15, `${number(c.points, 2)} pts → ${percent(c.share)}`);
  });
  drawLegend(svg, height - 12);
}

function drawLegend(svg, y) {
  PARTS.forEach(([part, name], i) => {
    const x = WORD_COLUMN + i * 115;
    el("rect", { x, y: y - 11, width: 14, height: 14, class: `pen-${part}` }, svg);
    label(svg, x + 20, y, name);
  });
}
