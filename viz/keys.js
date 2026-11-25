// Draws the keyboard. The SVG is laid out in key widths, so the core's coordinates are used as they are.

import { KEY_HEIGHT_KEYS, KEYBOARD_HEIGHT_KEYS, KEYBOARD_WIDTH_KEYS } from "../core/keyboard.js";
import { el } from "./svg.js";

const MARGIN_KEYS = 0.2;
const KEY_GAP_KEYS = 0.12;
const LABEL_DROP_KEYS = 0.17; // moves the letter down so it looks centred

/** Draws every key and returns an empty layer on top of them for the lines. */
export function drawKeys(svg, centers) {
  const width = KEYBOARD_WIDTH_KEYS + 2 * MARGIN_KEYS;
  const height = KEYBOARD_HEIGHT_KEYS + 2 * MARGIN_KEYS;
  svg.setAttribute("viewBox", `${-MARGIN_KEYS} ${-MARGIN_KEYS} ${width} ${height}`);
  const keys = el("g", { class: "keys" }, svg);
  const w = 1 - KEY_GAP_KEYS;
  const h = KEY_HEIGHT_KEYS - KEY_GAP_KEYS;
  for (const [letter, [x, y]] of Object.entries(centers)) {
    el("rect", { x: x - w / 2, y: y - h / 2, width: w, height: h, rx: 0.12, class: "key" }, keys);
    el("text", { x, y: y + LABEL_DROP_KEYS, class: "key-label" }, keys).textContent = letter;
  }
  return el("g", { class: "overlay" }, svg);
}
