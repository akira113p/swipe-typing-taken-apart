// What makes the vote's winner stand out in the penalty chart: a band behind its row, an ink tag
// after its total, and a dashed line at its total that the other words' bars run past.

import { el, label } from "./svg.js";

const TAG_WIDTH = 58;
const TAG_HEIGHT = 18;

/** The band goes in first, so the bars are drawn over it. */
export function winnerBand(svg, width, top, rowHeight) {
  el("rect", { x: 0, y: top + 1, width, height: rowHeight - 2, class: "winner-band" }, svg);
}

/** x: where the winner's total ends; the line runs from top through every row. */
export function winnerLine(svg, x, top, bottom) {
  el("line", { x1: x, y1: top, x2: x, y2: bottom, class: "winner-line" }, svg);
}

/** The tag starts at x, centred on middleY. */
export function winnerTag(svg, x, middleY) {
  el("rect", { x, y: middleY - TAG_HEIGHT / 2, width: TAG_WIDTH, height: TAG_HEIGHT, rx: 2, class: "winner-tag" }, svg);
  label(svg, x + TAG_WIDTH / 2, middleY + 4, "WINNER", "winner-tag-text", "middle");
}
