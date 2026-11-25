// The verdict and the ranked bars. Every number comes from the recognizer's result.

import { percent } from "./format.js";

export const SHOWN_BARS = 5;
const $ = (id) => document.getElementById(id);

export function renderVerdict(candidates) {
  const [best, second] = candidates;
  $("verdict-word").textContent = best ? best.word : "?";
  if (!best) {
    $("verdict-meta").textContent = "No word starts and ends near that line. Try again, or widen the pruning radius.";
    return;
  }
  const ahead = second ? `, ahead of ${second.word} (${percent(second.share)})` : "";
  $("verdict-meta").textContent = `${percent(best.share)} of the vote${ahead}.`;
}

/** The leading words as bars; clicking one inspects that word on the keyboard and in the charts. */
export function renderRunners(candidates, inspected, onInspect) {
  const bars = candidates.slice(0, SHOWN_BARS).map((c, i) => runnerButton(i + 1, c, inspected, onInspect));
  $("runners").replaceChildren(...bars);
}

/** One row: rank, word, a bar as long as its share of the vote, the share. */
function runnerButton(rank, c, inspected, onInspect) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = `runner${c.word === inspected ? " selected" : ""}`;
  button.innerHTML = '<span class="r"></span><span class="w"></span><span class="bar"><i></i></span><span class="n"></span>';
  button.querySelector(".r").textContent = rank;
  button.querySelector(".w").textContent = c.word;
  button.querySelector(".bar i").style.width = `${Math.max(1, 100 * c.share)}%`;
  button.querySelector(".n").textContent = percent(c.share);
  button.addEventListener("click", () => onInspect(c.word));
  return button;
}
