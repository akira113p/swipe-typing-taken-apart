// Tests that prove what the page claims. Run: node --test
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { normalizeShape, resample, wordTemplate } from "../core/geometry.js";
import { keyCenters } from "../core/keyboard.js";
import { parseWordList } from "../core/lexicon.js";
import { buildTemplates, recognize } from "../core/recognizer.js";

const centers = keyCenters();
const { words, prior } = parseWordList(readFileSync(new URL("../data/words.txt", import.meta.url), "utf8"));
const templates = buildTemplates(words, centers);
const perfect = (word) => wordTemplate(word, centers);
const shares = (result) => Object.fromEntries(result.candidates.map((c) => [c.word, c.share]));
const rank = (result, word) => result.candidates.findIndex((c) => c.word === word) + 1;

test("resampled points are equally spaced", () => {
  const r = resample([[0, 0], [3, 0], [3, 4]], 8);
  const steps = r.slice(1).map((p, i) => Math.hypot(p[0] - r[i][0], p[1] - r[i][1]));
  for (const s of steps) assert.ok(Math.abs(s - steps[0]) < 1e-9);
});

test("the normalized shape ignores size and position", () => {
  const t = resample(perfect("hello"), 32);
  const moved = t.map(([x, y]) => [x * 0.4 + 3, y * 0.4 + 1]);
  const a = normalizeShape(t, 1);
  const b = normalizeShape(moved, 1);
  a.forEach((p, i) => assert.ok(Math.hypot(p[0] - b[i][0], p[1] - b[i][1]) < 1e-9));
});

test("a perfect swipe is recognized", () => {
  for (const word of ["keyboard", "the", "because", "people"]) {
    assert.equal(recognize(perfect(word), templates, prior).candidates[0].word, word);
  }
});

test("tip and top tie when word frequency is switched off", () => {
  // t-i-p and t-o-p are the same straight line on QWERTY.
  const s = shares(recognize(perfect("tip"), templates, prior, { usePrior: false }));
  assert.ok(Math.abs(s.tip - s.top) < 1e-12);
});

test("word frequency breaks the tie", () => {
  const result = recognize(perfect("tip"), templates, prior);
  assert.ok(rank(result, "top") < rank(result, "tip"));
});

test("the shape judge alone cannot tell where you drew", () => {
  // "you" and "que" have the same shape in different places on the keys.
  const s = shares(recognize(perfect("you"), templates, prior, { usePlace: false, usePrior: false, usePruning: false }));
  assert.ok(Math.abs(s.you - s.que) < 1e-12);
});

test("pruning removes almost every word at once", () => {
  const { funnel } = recognize(perfect("hello"), templates, prior);
  assert.ok(funnel[1][1] < words.length * 0.05);
});

test("a forgiving place judge lets the more common help beat a perfect hello", () => {
  assert.equal(recognize(perfect("hello"), templates, prior, { sigmaPlaceKeys: 0.5 }).candidates[0].word, "help");
  assert.equal(recognize(perfect("hello"), templates, prior, { sigmaPlaceKeys: 0.15 }).candidates[0].word, "hello");
});
