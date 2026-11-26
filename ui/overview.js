// "How it decides": the flowchart and one card per step. Only the layout lives here; fillText() fills
// the data-text slots. The vote itself is shown next to the phone (the table and the bell charts).

import { buildLegend } from "./legend.js";

const PIPELINE = [
  { title: "1. The dictionary", text: "dictShort", chart: "step-dictionary" },
  { title: "2. Same number of points", text: "pointsShort", chart: "step-points" },
  { title: "3. Pruning: drop the far-off words", text: "pruneShort", chart: "step-prune" },
];
const JUDGES = [
  { title: "Shape judge: the shape", text: "shapeShort", part: "shape", chart: "step-shape" },
  { title: "Place judge: the position", text: "placeShort", part: "place", chart: "step-place" },
  { title: "Letters judge: every letter, in order", text: "lettersShort", part: "letters", chart: "step-letters" },
];

const DIAGRAM_ALT = "Flowchart: your swipe becomes equally spaced points, far-off words are pruned, " +
  "three judges and word frequency score the rest, and the vote ranks the words.";

export function buildOverview() {
  buildLegend(document.querySelector(".stage"));
  document.getElementById("overview").innerHTML = `
    <svg id="diagram" class="chart diagram" role="img" aria-label="${DIAGRAM_ALT}"></svg>
    <p class="figcap" data-text="diagramNote"></p>
    <div class="cards">${PIPELINE.map(card).join("")}</div>
    <h3>4. Three judges</h3>
    <div class="cards">${JUDGES.map(card).join("")}</div>
    <p data-text="voteShort"></p>`;
}

/** part colours a judge's card like its column in the vote table. The figure comes first, so figures side by side line up. */
function card({ title, text, part, chart }) {
  const svg = chart ? `<svg id="${chart}" class="chart"></svg>` : "";
  return `<article class="card${part ? ` judge-${part}` : ""}"><h4>${title}</h4>${svg}<p data-text="${text}"></p></article>`;
}
