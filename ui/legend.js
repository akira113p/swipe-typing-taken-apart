// The keys to the drawings: what each line and dot means. "On the keyboard" sits above the phone, so it is
// read next to the drawing; the accuracy example gets its own, shorter one.

// Each sample uses the keyboard's own classes (css/stage.css), in key widths, so it cannot drift from the drawing.
const LINE = 'x1=".1" y1=".2" x2=".9" y2=".2"';
const SWIPE = `<line class="swipe" ${LINE}/>`;
const IDEAL = `<line class="ideal" ${LINE}/>`;
const KEYS = `<circle class="target" cx=".5" cy=".2" r=".18"/>`;
const LEGEND = [
  ["your swipe", SWIPE],
  ["the N points", `${SWIPE}<circle class="sample" cx=".5" cy=".2" r=".035"/>`],
  ["the word you inspect", IDEAL],
  ["runners-up", `<line class="runner-up" ${LINE}/>`],
  ["its keys", KEYS],
  ["letter matches", `<line class="hit" ${LINE}/><circle class="hit-spot" cx=".9" cy=".2" r=".05"/>`],
];
const SLOPPY_LEGEND = [["the simulated finger", SWIPE], ["the word's ideal line", IDEAL], ["its keys", KEYS]];

/** Puts the legend just before `stage`, the block holding the phone and the result. */
export function buildLegend(stage) {
  stage.insertAdjacentHTML("beforebegin", `<p class="legend"><b>On the keyboard:</b> ${LEGEND.map(swatch).join("")}</p>`);
}

/** The legend under the accuracy example. */
export function buildSloppyLegend(box) {
  box.innerHTML = SLOPPY_LEGEND.map(swatch).join("");
}

function swatch([name, drawing]) {
  return `<span class="key-item"><svg viewBox="0 0 1 .4">${drawing}</svg>${name}</span>`;
}
