// How numbers are written on the page.

export function number(x, digits) {
  return x.toLocaleString("en", { minimumFractionDigits: digits, maximumFractionDigits: digits });
}

/** 0.4567 → "46%"; small shares keep one decimal so 0.3% does not read as 0%. */
export function percent(share) {
  return `${number(100 * share, share < 0.1 ? 1 : 0)}%`;
}
