// The two small bars in each row of the vote table. They draw numbers the recognizer returned; they decide nothing.

import { number, percent } from "./format.js";

// In the order of the table's columns, so each colour sits under its own column.
const PARTS = [["shape", "Shape"], ["place", "Position"], ["letters", "Letters"], ["frequency", "How common"]];

/**
 * One segment per judge, as long as the penalty points it charged; `most` points fill the cell.
 * The dashed mark is the winner's total (`best`): the part of a bar past it is how far that word fell behind.
 */
export function penaltyBar(c, { most, best }) {
  const cell = span("pen-cell");
  const bar = span("pen-bar", cell);
  for (const [part, name] of PARTS) {
    const segment = span(`pen-${part}`, bar);
    segment.style.width = `${(100 * c.penalties[part]) / most}%`;
    segment.title = `${name}: ${number(c.penalties[part], 2)} points`;
  }
  span("winner-mark", bar).style.left = `${(100 * best) / most}%`;
  span("pen-total", cell).textContent = number(c.points, 1);
  return cell;
}

/** A bar as long as the word's share of the vote, then the share. */
export function shareBar(share) {
  const cell = span("share-cell");
  span("", span("share-bar", cell)).style.width = `${Math.max(1, 100 * share)}%`;
  span("share-value", cell).textContent = percent(share);
  return cell;
}

function span(className, parent) {
  const node = document.createElement("span");
  if (className) node.className = className;
  parent?.appendChild(node);
  return node;
}
