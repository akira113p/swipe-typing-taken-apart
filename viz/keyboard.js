// Everything drawn on the keyboard. It draws what the core computed; it decides nothing.
// The SVG is laid out in key widths, so the core's coordinates are used as they are.

import { KEY_HEIGHT_KEYS, KEYBOARD_HEIGHT_KEYS, KEYBOARD_WIDTH_KEYS } from "../core/keyboard.js";

const SVG_NS = "http://www.w3.org/2000/svg";
const MARGIN_KEYS = 0.2;
const KEY_GAP_KEYS = 0.12;

function el(name, attrs = {}, parent = null) {
  const node = document.createElementNS(SVG_NS, name);
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
  if (parent) parent.appendChild(node);
  return node;
}

const toPoints = (path) => path.map(([x, y]) => `${x.toFixed(3)},${y.toFixed(3)}`).join(" ");

export function createKeyboardView(svg, centers) {
  svg.setAttribute("viewBox", `${-MARGIN_KEYS} ${-MARGIN_KEYS} ${KEYBOARD_WIDTH_KEYS + 2 * MARGIN_KEYS} `
    + `${KEYBOARD_HEIGHT_KEYS + 2 * MARGIN_KEYS}`);
  const keys = el("g", { class: "keys" }, svg);
  for (const [letter, [x, y]] of Object.entries(centers)) {
    const w = 1 - KEY_GAP_KEYS;
    const h = KEY_HEIGHT_KEYS - KEY_GAP_KEYS;
    el("rect", { x: x - w / 2, y: y - h / 2, width: w, height: h, rx: 0.12, class: "key" }, keys);
    el("text", { x, y: y + 0.17, class: "key-label" }, keys).textContent = letter;
  }
  const overlay = el("g", { class: "overlay" }, svg);

  function clear() {
    overlay.replaceChildren();
  }

  function stroke(points) {
    if (points.length === 0) return;
    el("polyline", { points: toPoints(points), class: "swipe" }, overlay);
    el("circle", { cx: points[0][0], cy: points[0][1], r: 0.12, class: "swipe-start" }, overlay);
  }

  return {
    /** While the finger moves: only the line being drawn. */
    drawStroke(points) {
      clear();
      stroke(points);
    },
    /** After the vote: the inspected word's tunnel and ideal path, the runners-up, then the swipe on top. */
    drawResult({ points, gesture, inspected, others, tunnelRadius }) {
      clear();
      if (inspected) {
        el("polyline", { points: toPoints(inspected), class: "tunnel", "stroke-width": 2 * tunnelRadius }, overlay);
      }
      for (const path of others) el("polyline", { points: toPoints(path), class: "runner-up" }, overlay);
      if (inspected) {
        inspected.forEach((p, i) => {
          const g = gesture[i];
          el("line", { x1: g[0], y1: g[1], x2: p[0], y2: p[1], class: "pair" }, overlay);
        });
        el("polyline", { points: toPoints(inspected), class: "ideal" }, overlay);
      }
      stroke(points);
      for (const [x, y] of gesture) el("circle", { cx: x, cy: y, r: 0.035, class: "sample" }, overlay);
    },
  };
}
