// Run: node --test
import assert from "node:assert/strict";
import { test } from "node:test";

import { keysCrossed } from "../core/crossed.js";
import { keyAt, keysNear } from "../core/keyboard.js";
import { letterHits } from "../core/letters.js";
import { resample, wordKeys } from "../core/path.js";
import { normalizeShape } from "../core/shape.js";
import { DEFAULTS } from "../core/settings.js";
import { centers, curvedHello, perfect, vote } from "./setup.js";

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

test("the keys the pruning figure colours are the recognizer's rule: every word kept starts and ends on them", () => {
  const { gesture, candidates } = vote(curvedHello);
  const start = keysNear(gesture[0], centers, DEFAULTS.pruneRadiusKeys);
  const end = keysNear(gesture[gesture.length - 1], centers, DEFAULTS.pruneRadiusKeys);
  assert.ok(candidates.length > 0);
  for (const { word } of candidates) assert.ok(start.includes(word[0]) && end.includes(word.at(-1)), word);
});

test("a straight hello crosses h g f t r e r t y h j k l o (the opening text and figure)", () => {
  assert.equal(keysCrossed(perfect("hello")).join(" "), "h g f t r e r t y h j k l o");
});

test("keyAt finds the key under a point, and nothing beside a short row", () => {
  assert.equal(keyAt(centers.q), "q");
  assert.equal(keyAt(centers.m), "m");
  assert.equal(keyAt([0.2, 2.25]), null); // left of "a": the middle row starts half a key in
});
