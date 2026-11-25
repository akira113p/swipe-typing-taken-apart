// Everything drawn over the keys. It draws what the core computed; it decides nothing.

import { arrowHead, el, toPoints } from "./svg.js";

const ARROW_KEYS = 0.28; // arrowhead length, in key widths

export function createOverlay(layer) {
  function stroke(points) {
    if (points.length === 0) return;
    el("polyline", { points: toPoints(points), class: "swipe" }, layer);
    el("circle", { cx: points[0][0], cy: points[0][1], r: 0.12, class: "swipe-start" }, layer);
    arrowHead(layer, points, "swipe-arrow", ARROW_KEYS);
  }

  /** The inspected word: a yellow target on each of its keys and its ideal line in blue. */
  function word(focus, targetRadius) {
    for (const [x, y] of focus.keys) el("circle", { cx: x, cy: y, r: targetRadius, class: "target" }, layer);
    el("polyline", { points: toPoints(focus.path), class: "ideal" }, layer);
    arrowHead(layer, focus.path, "ideal-arrow", ARROW_KEYS * 0.8);
  }

  /** Red: from each letter to the spot of the swipe the letters judge matched it with. */
  function hits(focus) {
    const keys = focus.keys.length === 1 ? [focus.keys[0], focus.keys[0]] : focus.keys;
    focus.hits.forEach(([x2, y2], j) => {
      const [x1, y1] = keys[j];
      el("line", { x1, y1, x2, y2, class: "hit" }, layer);
      el("circle", { cx: x2, cy: y2, r: 0.06, class: "hit-spot" }, layer);
    });
  }

  return {
    /** While the finger moves: only the line being drawn. */
    drawStroke(points) {
      layer.replaceChildren();
      stroke(points);
    },
    /** After the vote: runners-up dashed, the inspected word, the swipe and its N sample points on top. */
    drawResult({ points, gesture, focus, others, targetRadius, showHits }) {
      layer.replaceChildren();
      for (const path of others) el("polyline", { points: toPoints(path), class: "runner-up" }, layer);
      if (focus) word(focus, targetRadius);
      stroke(points);
      if (focus && showHits) hits(focus);
      for (const [x, y] of gesture) el("circle", { cx: x, cy: y, r: 0.035, class: "sample" }, layer);
    },
  };
}
