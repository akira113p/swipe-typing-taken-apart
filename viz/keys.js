// Draws the keyboard. The SVG is laid out in key widths, so the core's coordinates are used as they are.

import { KEY_HEIGHT_KEYS, KEYBOARD_HEIGHT_KEYS, KEYBOARD_WIDTH_KEYS, ROWS, ROW_OFFSETS_KEYS } from "../core/keyboard.js";
import { el } from "./svg.js";

const MARGIN_KEYS = 0.2;
const KEY_GAP_KEYS = 0.12;
const KEY_RADIUS_KEYS = 0.2;
const LABEL_DROP_KEYS = 0.18; // moves the letter down so it looks centred

/** Draws every key and returns an empty layer on top of them for the lines. */
export function drawKeys(svg, centers) {
  const width = KEYBOARD_WIDTH_KEYS + 2 * MARGIN_KEYS;
  const height = KEYBOARD_HEIGHT_KEYS + 2 * MARGIN_KEYS;
  svg.setAttribute("viewBox", `${-MARGIN_KEYS} ${-MARGIN_KEYS} ${width} ${height}`);
  const keys = el("g", { class: "keys" }, svg);
  const w = 1 - KEY_GAP_KEYS;
  const h = KEY_HEIGHT_KEYS - KEY_GAP_KEYS;
  for (const [letter, [x, y]] of Object.entries(centers)) {
    el("rect", { x: x - w / 2, y: y - h / 2, width: w, height: h, rx: KEY_RADIUS_KEYS, class: "key" }, keys);
    el("text", { x, y: y + LABEL_DROP_KEYS, class: "key-label" }, keys).textContent = letter;
  }
  drawEraseKey(svg, h);
  return el("g", { class: "overlay" }, svg);
}

/**
 * The backspace key, right of "m" as on a phone. It is not a letter, so the recognizer never sees it:
 * it fills the room left at the end of the bottom row. ui/notepad.js makes it delete the last word.
 */
function drawEraseKey(svg, h) {
  const row = ROWS.length - 1;
  const left = ROW_OFFSETS_KEYS[row] + ROWS[row].length + KEY_GAP_KEYS / 2;
  const right = KEYBOARD_WIDTH_KEYS - KEY_GAP_KEYS / 2;
  const cx = (left + right) / 2;
  const cy = (row + 0.5) * KEY_HEIGHT_KEYS;
  const key = el("g", { class: "erase", role: "button", tabindex: 0, "aria-label": "Delete the last word" }, svg);
  el("rect", { x: left, y: cy - h / 2, width: right - left, height: h, rx: KEY_RADIUS_KEYS, class: "key" }, key);
  // The usual backspace sign: an arrow-shaped tag pointing left, with a small x inside.
  const tag = `M${cx - 0.3} ${cy} L${cx - 0.13} ${cy - 0.17} H${cx + 0.3} V${cy + 0.17} H${cx - 0.13} Z`;
  const cross = `M${cx - 0.02} ${cy - 0.08} l0.16 0.16 M${cx + 0.14} ${cy - 0.08} l-0.16 0.16`;
  el("path", { d: `${tag} ${cross}`, class: "erase-sign" }, key);
}
