// The funnel strip and the "Under the hood" table.

import { toMillimetres } from "../core/keyboard.js";
import { number, oneIn, percent } from "./format.js";

const TABLE_ROWS = 8;
const STAGES = { dictionary: "words in the dictionary", ends: "start and end near your swipe" };
const $ = (id) => document.getElementById(id);

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

const millimetres = (keys) => `${number(toMillimetres(keys), 1)} mm`;

/** One row per candidate: the three gaps, the word's frequency, its penalty points and its vote.
 * The gaps are shown in everyday units: the shape as a share of the drawing's size, distances in mm on a phone. */
export function renderTable(candidates, s) {
  const body = $("detail-rows");
  body.replaceChildren();
  for (const c of candidates.slice(0, TABLE_ROWS)) {
    const cells = [
      c.word,
      s.useShape ? percent(c.shapeGap / s.shapeSize) : "off",
      s.usePlace ? millimetres(c.placeGap) : "off",
      s.useLetters ? millimetres(c.letterGap) : "off",
      oneIn(c.prior),
      number(c.points, 2),
      percent(c.share),
    ];
    const row = document.createElement("tr");
    for (const text of cells) {
      const td = document.createElement("td");
      td.textContent = text;
      row.appendChild(td);
    }
    body.appendChild(row);
  }
}
