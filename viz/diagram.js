// The pipeline diagram of "How it decides": the boxes and arrows listed in diagram-layout.js.
// It explains the code; nothing in it is measured from your swipe.

import { LID, arrow, box, cylinder, wrap, write } from "./diagram-shapes.js";
import { el, resetChart } from "./svg.js";

const CYLINDERS = ["dictionary", "frequencies"]; // stored data
const SCORES = ["shape", "place", "letters", "frequency"]; // each wears its judge's colour
const PAD = 12;
const CAP = 6; // the coloured strip on top of a score's box
const CHAR_WIDTH_EM = 0.52; // average letter width of our sans, to decide where a line breaks

/** texts: { id: [title, detail] }, with the same ids as layout.nodes. */
export function drawDiagram(svg, layout, texts) {
  resetChart(svg, ...layout.size);
  if (layout.frame) box(svg, layout.frame, "d-frame");
  for (const edge of layout.edges) arrow(svg, edge);
  for (const [id, rect] of Object.entries(layout.nodes)) node(svg, id, rect, texts[id], layout.fonts);
}

/** One box or cylinder with its title and detail, centred vertically. */
function node(svg, id, rect, [title, detail], [titleSize, detailSize]) {
  const group = el("g", { class: SCORES.includes(id) ? `tone-${id}` : "" }, svg);
  const [x, y, width, height] = rect;
  const isCylinder = CYLINDERS.includes(id);
  if (isCylinder) cylinder(group, rect);
  else box(group, rect, "d-box");
  if (SCORES.includes(id)) box(group, [x, y, width, CAP], "d-cap");
  const lines = wrap(detail, Math.floor((width - 2 * PAD) / (detailSize * CHAR_WIDTH_EM)));
  const step = detailSize * 1.3;
  const middle = y + height / 2 + (isCylinder ? LID / 2 : 0); // a cylinder's lid takes room at the top
  const first = middle - (titleSize + lines.length * step) / 2 + titleSize * 0.85;
  write(group, x + PAD, first, title, "d-title", titleSize);
  lines.forEach((line, i) => write(group, x + PAD, first + (i + 1) * step, line, "d-detail", detailSize));
}
