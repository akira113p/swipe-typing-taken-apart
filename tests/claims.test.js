// The claims the page makes, checked on the real word list. Run: node --test
import assert from "node:assert/strict";
import { test } from "node:test";

import { curvedHello, perfect, shares, vote, winner, words } from "./setup.js";

test("a perfect swipe is recognized", () => {
  for (const word of ["keyboard", "the", "because", "people", "hello", "thanks"]) {
    assert.equal(winner(vote(perfect(word))), word);
  }
});

test("a curved, real hello is recognized (it used to come out as help)", () => {
  assert.equal(winner(vote(curvedHello)), "hello");
});

test("without the letters judge, help beats the curved hello", () => {
  assert.equal(winner(vote(curvedHello, { useLetters: false })), "help");
});

test("a looser letters judge lets help creep back towards hello", () => {
  const gap = (sigma) => {
    const s = shares(vote(perfect("hello"), { sigmaLettersKeys: sigma }));
    return s.hello - s.help;
  };
  assert.ok(gap(1) < gap(0.25));
});

test("tip and top tie exactly when word frequency is switched off", () => {
  const s = shares(vote(perfect("tip"), { usePrior: false }));
  assert.ok(Math.abs(s.tip - s.top) < 1e-12);
});

test("word frequency breaks the tie in favour of the more common top", () => {
  assert.equal(winner(vote(perfect("tip"))), "top");
});

test("the shape judge alone cannot tell where you drew: you and que tie", () => {
  const options = { usePlace: false, useLetters: false, usePrior: false, usePruning: false };
  const s = shares(vote(perfect("you"), options));
  assert.ok(Math.abs(s.you - s.que) < 1e-12);
});

test("pruning removes more than 95% of the words at once", () => {
  const { funnel } = vote(perfect("hello"));
  assert.ok(funnel[1][1] < words.length * 0.05);
});

test("shares add up to 100%", () => {
  const total = vote(perfect("music")).candidates.reduce((sum, c) => sum + c.share, 0);
  assert.ok(Math.abs(total - 1) < 1e-9);
});
