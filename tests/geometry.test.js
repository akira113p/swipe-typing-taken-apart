// Run: node --test
import assert from "node:assert/strict";
import { test } from "node:test";

import { letterHits } from "../core/letters.js";
import { resample, wordKeys } from "../core/path.js";
import { normalizeShape } from "../core/shape.js";
import { centers, perfect } from "./setup.js";

test("resampled points are equally spaced", () => {
  const r = resample([[0, 0], [3, 0], [3, 4]], 8);
  const steps = r.slice(1).map((p, i) => Math.hypot(p[0] - r[i][0], p[1] - r[i][1]));
  for (const s of steps) assert.ok(Math.abs(s - steps[0]) < 1e-9);
});

test("a double letter counts once, so to and too share a line", () => {
  assert.deepEqual(wordKeys("too", centers), wordKeys("to", centers));
});

test("the normalized shape ignores size and position", () => {
  const t = resample(perfect("hello"), 32);
  const moved = t.map(([x, y]) => [x * 0.4 + 3, y * 0.4 + 1]);
  const a = normalizeShape(t, 1);
  const b = normalizeShape(moved, 1);
  a.forEach((p, i) => assert.ok(Math.hypot(p[0] - b[i][0], p[1] - b[i][1]) < 1e-9));
});

test("letters judge: a swipe through every key centre has a gap of 0", () => {
  assert.ok(letterHits(perfect("keyboard"), perfect("keyboard")).gap < 1e-9);
});

test("letters judge: the first letter is pinned to the start and the last to the end", () => {
  const swipe = [[0.5, 0.75], [4.5, 0.75], [6, 2.25]]; // q → t → h: starts on q, ends on h
  const { hits } = letterHits(swipe, perfect("th"));
  assert.deepEqual(hits[0], swipe[0]);
  assert.deepEqual(hits[1], swipe[2]);
});

test("letters judge: letters must come in order", () => {
  const swipe = resample(perfect("tip"), 48);
  assert.ok(letterHits(swipe, perfect("pit")).gap > 1);
});

test("letters judge: a curve between two letters costs nothing", () => {
  const [h, e] = perfect("he");
  const curve = [h, [(h[0] + e[0]) / 2, h[1] + 1.2], e]; // bulges more than a key away from the straight line
  assert.ok(letterHits(resample(curve, 48), [h, e]).gap < 1e-9);
});
