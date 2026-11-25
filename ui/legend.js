// "On the keyboard": what each line and dot drawn on the phone's keys means.
// It sits above the phone, so the key to the drawing is read next to the drawing.

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

/** Puts the legend just before `stage`, the block holding the phone and the result. */
export function buildLegend(stage) {
  stage.insertAdjacentHTML("beforebegin", `<p class="legend"><b>On the keyboard:</b> ${LEGEND.map(swatch).join("")}</p>`);
}

function swatch([name, drawing]) {
  return `<span class="key-item"><svg viewBox="0 0 1 .4">${drawing}</svg>${name}</span>`;
}
