// Keyboard geometry. Every distance in the project is measured in KEY WIDTHS, the unit
// SHARK2 uses (its tunnel is "one key width" wide). This keeps every number independent
// of the screen size.

import { distance } from "./path.js";

export const ROWS = ["qwertyuiop", "asdfghjkl", "zxcvbnm"];

// How far each row starts to the right of the top row, in key widths. On touch keyboards
// the middle row starts half a key in and the bottom row 1.5 keys in (room for shift).
export const ROW_OFFSETS_KEYS = [0, 0.5, 1.5];

// Phone keys are taller than wide: 9.42 mm / 6.22 mm = 1.51 (Smith, Bi & Zhai, CHI 2015).
export const KEY_HEIGHT_KEYS = 1.5;

export const KEYBOARD_WIDTH_KEYS = Math.max(...ROWS.map((row, i) => ROW_OFFSETS_KEYS[i] + row.length));
export const KEYBOARD_HEIGHT_KEYS = ROWS.length * KEY_HEIGHT_KEYS;

/** Centre of every letter key, in key widths, with the origin at the top-left corner. */
export function keyCenters() {
  const centers = {};
  ROWS.forEach((row, r) => {
    [...row].forEach((letter, c) => {
      centers[letter] = [ROW_OFFSETS_KEYS[r] + c + 0.5, (r + 0.5) * KEY_HEIGHT_KEYS];
    });
  });
  return centers;
}

/** The letters whose key centre is at most `radius` key widths from `point` (the pruning zone). */
export function keysNear(point, centers, radius) {
  return Object.keys(centers).filter((letter) => distance(centers[letter], point) <= radius);
}
