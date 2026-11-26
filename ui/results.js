// The verdict and the funnel strip. Every number comes from the recognizer's result.

import { number, percent } from "./format.js";

const STAGES = { dictionary: "words in the dictionary", ends: "start and end near your swipe" };
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

/** [10,000 words in the dictionary] → [41 start and end near your swipe] → [2 with at least 1% of the vote] */
export function renderFunnel(funnel, candidates) {
  const real = candidates.filter((c) => c.share >= 0.01).length;
  const steps = [...funnel.map(([stage, count]) => [count, STAGES[stage]]), [real, "with at least 1% of the vote"]];
  const boxes = steps.map(([count, text]) => {
    const box = document.createElement("div");
    box.className = "funnel-step";
    box.innerHTML = "<b></b><span></span>";
    box.querySelector("b").textContent = number(count, 0);
    box.querySelector("span").textContent = text;
    return box;
  });
  $("funnel").replaceChildren(...boxes);
}
