// The figure under the title: a swipe of one word, the keys it crosses, and what the keyboard writes.
// Laid out in key widths, like the big keyboard. It draws what core/crossed.js computed.

import { KEYBOARD_HEIGHT_KEYS, KEYBOARD_WIDTH_KEYS, KEY_HEIGHT_KEYS } from "../core/keyboard.js";
import { el, toPoints } from "./svg.js";

const KEY_GAP_KEYS = 0.12;
const CAP_KEYS = 0.62; //  one small key in the row of touched keys
const CAP_STEP_KEYS = 0.71;
const TAPE_TOP_KEYS = KEYBOARD_HEIGHT_KEYS + 0.85;
const HEIGHT_KEYS = TAPE_TOP_KEYS + 2.5;

const text = (svg, x, y, value, className, extra = {}) =>
  (el("text", { x, y, class: className, ...extra }, svg).textContent = value);

/** word: the word swiped; path: its line; crossed: every key under it, in order. */
export function drawOpening(svg, { centers, path, crossed, word }) {
  svg.replaceChildren();
  svg.setAttribute("viewBox", `-0.1 -0.1 ${KEYBOARD_WIDTH_KEYS + 0.2} ${HEIGHT_KEYS}`);
  const kind = (letter) => (word.includes(letter) ? "op-word" : crossed.includes(letter) ? "op-crossed" : "");
  const [w, h] = [1 - KEY_GAP_KEYS, KEY_HEIGHT_KEYS - KEY_GAP_KEYS];
  const keys = Object.entries(centers);
  for (const [letter, [x, y]] of keys) {
    el("rect", { x: x - w / 2, y: y - h / 2, width: w, height: h, rx: 0.15, class: `op-key ${kind(letter)}` }, svg);
  }
  // pathLength="1" lets css/base.css draw the line in, from 0% to 100% of its length.
  el("polyline", { points: toPoints(path), pathLength: 1, class: "op-swipe" }, svg);
  el("circle", { cx: path[0][0], cy: path[0][1], r: 0.1, class: "op-start" }, svg);
  for (const [letter, [x, y]] of keys) text(svg, x, y + 0.16, letter, "op-letter"); // on top of the line

  text(svg, 0, TAPE_TOP_KEYS, "every key your finger touches:", "op-label");
  crossed.forEach((letter, i) => {
    const cap = el("g", { class: "op-cap", style: `--i: ${i}` }, svg);
    const x = i * CAP_STEP_KEYS;
    el("rect", { x, y: TAPE_TOP_KEYS + 0.25, width: CAP_KEYS, height: CAP_KEYS, rx: 0.1, class: `op-key ${kind(letter)}` }, cap);
    text(cap, x + CAP_KEYS / 2, TAPE_TOP_KEYS + 0.7, letter, "op-letter");
  });
  const result = el("g", { class: "op-result", style: `--i: ${crossed.length}` }, svg);
  text(result, 0, TAPE_TOP_KEYS + 1.55, "what the keyboard writes:", "op-label");
  text(result, 0, TAPE_TOP_KEYS + 2.3, word, "op-written");
}
