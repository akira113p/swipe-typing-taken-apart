// The vote, next to the phone: one row per leading word with what each judge measured, how common
// the word is, the penalty points they charged (one coloured bar) and the word's share of the vote.
// Click a row to inspect that word on the keyboard and in the figures. Every number comes from the recognizer.

import { millimetres, oneIn, percent } from "./format.js";
import { penaltyBar, shareBar } from "./vote-bars.js";

export const SHOWN_ROWS = 5;
const $ = (id) => document.getElementById(id);

/** s: the settings (a judge that is switched off shows "off"); inspected: the word drawn on the keyboard. */
export function renderVoteTable(candidates, s, inspected, onInspect) {
  const rows = candidates.slice(0, SHOWN_ROWS);
  // The longest bar fills its cell, so the bars of one table can be compared with each other.
  const scale = { most: Math.max(...rows.map((c) => c.points), 1e-9), best: rows[0]?.points ?? 0 };
  $("vote-rows").replaceChildren(...rows.map((c) => row(c, s, scale, c.word === inspected, onInspect)));
}

function row(c, s, scale, selected, onInspect) {
  const tr = document.createElement("tr");
  tr.classList.toggle("selected", selected);
  tr.addEventListener("click", () => onInspect(c.word)); // the word's button is inside, so keys work too
  const cells = [
    wordButton(c.word, selected),
    s.useShape ? percent(c.shapeGap / s.shapeSize) : "off",
    s.usePlace ? millimetres(c.placeGap) : "off",
    s.useLetters ? millimetres(c.letterGap) : "off",
    oneIn(c.prior),
    penaltyBar(c, scale),
    shareBar(c.share),
  ];
  for (const content of cells) tr.appendChild(document.createElement("td")).append(content);
  return tr;
}

function wordButton(word, selected) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "word-button";
  button.textContent = word;
  button.setAttribute("aria-pressed", String(selected));
  return button;
}
