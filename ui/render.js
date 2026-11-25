// Shows one vote everywhere: keyboard overlay, verdict, bars, funnel, table and charts.

import { readSettings } from "./controls.js";
import { renderFunnel, renderTable } from "./details.js";
import { renderFigures } from "./figures.js";
import { renderRunners, renderVerdict } from "./results.js";

const DASHED_RUNNERS = 3; // the leading words drawn on the keyboard; more would hide the swipe

/** state: { stroke, result, inspected, templates }. onInspect(word) is called when a bar is clicked. */
export function renderResult(state, overlay, onInspect) {
  const { candidates, funnel, gesture } = state.result;
  const s = readSettings();
  const focus = candidates.find((c) => c.word === state.inspected) ?? null;
  const others = candidates.slice(0, DASHED_RUNNERS).filter((c) => c !== focus).map((c) => c.path);
  overlay.drawResult({
    points: state.stroke, gesture, focus, others,
    targetRadius: s.useLetters ? s.sigmaLettersKeys : 0,
    showHits: s.useLetters,
  });
  renderVerdict(candidates);
  renderRunners(candidates, state.inspected, onInspect);
  renderFunnel(funnel, candidates);
  renderTable(candidates, s);
  renderFigures(candidates, s, state.inspected);
}
