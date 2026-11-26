// How numbers are written on the page.

import { toMillimetres } from "../core/keyboard.js";

export function number(x, digits) {
  return x.toLocaleString("en", { minimumFractionDigits: digits, maximumFractionDigits: digits });
}

/** 0.4567 → "46%"; small shares keep one decimal so 0.3% does not read as 0%. */
export function percent(share) {
  return `${number(100 * share, share < 0.1 ? 1 : 0)}%`;
}

/** A distance in key widths, shown as millimetres on a phone: 0.45 → "2.8 mm". */
export function millimetres(keys) {
  return `${number(toMillimetres(keys), 1)} mm`;
}

/** A word that is 0.000617 of all words → "1 in 1,600": easier to picture than a rate. */
export function oneIn(share) {
  return `1 in ${(1 / share).toLocaleString("en", { maximumSignificantDigits: 2 })}`;
}

/** "{words} words" with { words: "10,000" } → "10,000 words". */
export function fillPlaceholders(text, values) {
  return text.replace(/\{(\w+)\}/g, (_, name) => values[name] ?? "");
}
