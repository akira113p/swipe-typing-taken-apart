// "How it decides": the keyboard's legend, one card per step, and the two live charts
// next to the step they show. Only the layout lives here; fillText() fills the data-text slots.

// Each sample uses the keyboard's own classes (css/stage.css), in key widths, so it cannot drift from the drawing.
const LINE = 'x1=".1" y1=".2" x2=".9" y2=".2"';
const LEGEND = [
  ["your swipe", `<line class="swipe" ${LINE}/>`],
  ["the N points", `<line class="swipe" ${LINE}/><circle class="sample" cx=".5" cy=".2" r=".035"/>`],
  ["the word you inspect", `<line class="ideal" ${LINE}/>`],
  ["runners-up", `<line class="runner-up" ${LINE}/>`],
  ["its keys", `<circle class="target" cx=".5" cy=".2" r=".18"/>`],
  ["letter matches", `<line class="hit" ${LINE}/><circle class="hit-spot" cx=".9" cy=".2" r=".05"/>`],
];
const PIPELINE = [
  { title: "1. The dictionary", text: "dictShort" },
  { title: "2. Same number of points", text: "pointsShort" },
  { title: "3. Pruning: drop the far-off words", text: "pruneShort" },
];
const JUDGES = [
  { title: "Shape judge: same drawing?", text: "shapeShort", part: "shape" },
  { title: "Place judge: on the right keys?", text: "placeShort", part: "place" },
  { title: "Letters judge: every letter, in order?", text: "lettersShort", part: "letters" },
];
const VOTE = { title: "5. The vote", text: "voteShort", chart: "penalty-chart" };

export function buildOverview() {
  document.getElementById("overview").innerHTML = `
    <p class="legend"><b>On the keyboard:</b> ${LEGEND.map(swatch).join("")}</p>
    <div class="cards">${PIPELINE.map(card).join("")}</div>
    <h3>4. Three judges</h3>
    <div class="cards">${JUDGES.map(card).join("")}</div>
    <p data-text="bellShort"></p><svg id="bell-chart" class="chart"></svg>
    <div class="cards">${card(VOTE)}</div>`;
}

/** part colours a judge's card like its bar in the penalty chart. */
function card({ title, text, part, chart }) {
  const svg = chart ? `<svg id="${chart}" class="chart"></svg>` : "";
  return `<article class="card${part ? ` judge-${part}` : ""}"><h4>${title}</h4><p data-text="${text}"></p>${svg}</article>`;
}

function swatch([name, drawing]) {
  return `<span class="key-item"><svg viewBox="0 0 1 .4">${drawing}</svg>${name}</span>`;
}
