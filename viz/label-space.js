// Puts each word's label beside its dot without covering another label or dot. Two leading words often
// have almost the same gap, and labels placed at a fixed offset would be printed on top of each other.

const CHAR_WIDTH = 6.6; // about one character of .chart-small (12 px)
const LINE = 13;
const DOT_ROOM = 4;
const ROWS = [0, -1, 1, -2, 2, -3, 3]; // tried in this order: level with the dot first, then above and below

/**
 * items: [{ x, y, text }], the first placed first; area: { left, right, top, bottom }; taken: boxes to avoid.
 * Returns the [x, y] of each label's baseline start.
 */
export function placeLabels(items, area, taken = []) {
  const boxes = [...taken, ...items.map(({ x, y }) => box(x - DOT_ROOM, y - DOT_ROOM, 2 * DOT_ROOM, 2 * DOT_ROOM))];
  return items.map(({ x, y, text }) => {
    const width = text.length * CHAR_WIDTH;
    const spots = [x + 7, x - 7 - width].flatMap((left) => ROWS.map((row) => fit(left, y + row * LINE - LINE / 2, width, area)));
    const spot = spots.find((s) => !boxes.some((b) => overlaps(s, b))) ?? spots[0];
    boxes.push(spot);
    return [spot.left, spot.bottom - 3];
  });
}

/** The box [left, top] of that size, moved inside the area. */
function fit(left, top, width, area) {
  const x = Math.min(Math.max(left, area.left), area.right - width);
  const y = Math.min(Math.max(top, area.top), area.bottom - LINE);
  return box(x, y, width, LINE);
}

function box(left, top, width, height) {
  return { left, top, right: left + width, bottom: top + height };
}

function overlaps(a, b) {
  return a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom;
}
