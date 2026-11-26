// Shows one vote everywhere: keyboard overlay, verdict, vote table, funnel, bell charts and step figures.

import { readSettings } from "./controls.js";
import { renderFigures } from "./figures.js";
import { renderFunnel, renderVerdict } from "./results.js";
import { renderSteps } from "./steps.js";
import { renderVoteTable } from "./vote-table.js";

const DASHED_RUNNERS = 3; // the leading words drawn on the keyboard; more would hide the swipe

/** state: { stroke, result, inspected, templates }. onInspect(word) is called when a row of the table is clicked. */
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
  renderVoteTable(candidates, s, state.inspected, onInspect);
  renderFunnel(funnel, candidates);
  renderFigures(candidates, s, state.inspected);
  renderSteps(state, s);
}
