// The three judges, each measuring one gap between the swipe and a word,
// and the penalty points each gap costs.

import { letterHits } from "./letters.js";
import { meanPointDistance } from "./shape.js";
import { bellPenalty } from "./vote.js";

/**
 * shapeGap:  is the drawing the same, whatever its size and position? (SHARK2, normalized units)
 * placeGap:  is it drawn on the right keys? (SHARK2, key widths)
 * letterGap: did it pass every letter, in order? (ours, key widths)
 * Every gap is always measured, so the page can show it; switches only decide what counts.
 */
export function judge(template, swipe) {
  const { hits, gap } = letterHits(swipe.place, template.keys);
  return {
    shapeGap: meanPointDistance(swipe.shape, template.shape),
    placeGap: meanPointDistance(swipe.place, template.place),
    letterGap: gap,
    hits,
  };
}

/**
 * Penalty points per judge (0 when switched off). Fewer points = more likely.
 * A geometric judge charges ½(gap/σ)², minus the log of a bell curve.
 * Word frequency charges -λ·ln P(word): rare words pay more. λ below 1 stops common
 * words from drowning the geometry (with λ = 1 a clean "hello" lost to "help").
 * Adding penalties is Bayes' rule P(gesture | word) · P(word)^λ, written in logs.
 */
export function penalties(c, s) {
  return {
    shape: s.useShape ? bellPenalty(c.shapeGap, s.sigmaShape) : 0,
    place: s.usePlace ? bellPenalty(c.placeGap, s.sigmaPlaceKeys) : 0,
    letters: s.useLetters ? bellPenalty(c.letterGap, s.sigmaLettersKeys) : 0,
    frequency: s.usePrior ? -s.priorWeight * Math.log(c.prior) : 0,
  };
}

export function totalPenalty(p) {
  return p.shape + p.place + p.letters + p.frequency;
}
