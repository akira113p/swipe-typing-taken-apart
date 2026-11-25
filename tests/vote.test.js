// Penalty points and shares. Run: node --test
import assert from "node:assert/strict";
import { test } from "node:test";

import { SLOPPINESS_LEVELS_KEYS, fingerAt, topOneRate } from "../core/accuracy.js";
import { bellHeight, bellPenalty, toShares } from "../core/vote.js";
import { centers, prior, templates, words } from "./setup.js";

test("a gap of 1σ costs half a point, 2σ two points, 3σ four and a half", () => {
  assert.equal(bellPenalty(0.3, 0.3), 0.5);
  assert.ok(Math.abs(bellPenalty(0.6, 0.3) - 2) < 1e-12);
  assert.ok(Math.abs(bellPenalty(0.9, 0.3) - 4.5) < 1e-12);
});

test("the bell keeps 61% of its height at 1σ, 14% at 2σ and about 1% at 3σ", () => {
  assert.equal(Math.round(100 * bellHeight(1, 1)), 61);
  assert.equal(Math.round(100 * bellHeight(2, 1)), 14);
  assert.equal(Math.round(100 * bellHeight(3, 1)), 1);
});

test("one extra penalty point divides the share by e", () => {
  const [a, b] = toShares([2, 3]);
  assert.ok(Math.abs(a / b - Math.E) < 1e-12);
});

// The simulated finger: the same seed gives the same swipes, so settings are compared fairly.
const rate = (options, level) => topOneRate({
  words, prior, templates, centers, finger: fingerAt(level), options, count: 150, seed: 7,
});

test("the letters judge raises accuracy on sloppy simulated swipes", () => {
  const level = SLOPPINESS_LEVELS_KEYS[2];
  assert.ok(rate({}, level) > rate({ useLetters: false }, level));
});

test("the letters judge alone is much worse than all judges together", () => {
  const level = SLOPPINESS_LEVELS_KEYS[1];
  assert.ok(rate({ useShape: false, usePlace: false }, level) < rate({}, level) - 0.3);
});
