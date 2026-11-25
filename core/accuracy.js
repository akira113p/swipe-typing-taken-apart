// How often the recognizer gets it right, measured on simulated swipes (core/finger.js).

import { randomSource, simulateSwipe } from "./finger.js";
import { recognize } from "./recognizer.js";

export const SLOPPINESS_LEVELS_KEYS = [0.05, 0.15, 0.25, 0.35, 0.45];

/** A finger whose aim error and curving are both `sloppiness` (key widths), with a little shake. */
export function fingerAt(sloppiness) {
  return { miss: sloppiness, bow: sloppiness, wobble: 0.03 };
}

/** `count` words picked at random from the whole dictionary, every word equally likely. */
export function pickWords(words, count, random) {
  return Array.from({ length: count }, () => words[Math.floor(random.uniform() * words.length)]);
}

/**
 * One simulated swipe at a time: yields { word, guess } so the page can show each word as
 * it is tested. The same seed gives the same words and the same swipes, so two settings
 * are always compared on identical input.
 */
export function* swipeTest({ words, prior, templates, centers, finger, options, count, seed }) {
  const random = randomSource(seed);
  for (const word of pickWords(words, count, random)) {
    const swipe = simulateSwipe(word, centers, finger, random);
    yield { word, guess: recognize(swipe, templates, prior, options).candidates[0]?.word ?? null };
  }
}

/** The test at sloppiness level i, seeded i + 1: every setting tested at that level reads identical swipes. */
export function testAtLevel(i, { words, prior, templates, centers, options, count }) {
  return { words, prior, templates, centers, options, count, finger: fingerAt(SLOPPINESS_LEVELS_KEYS[i]), seed: i + 1 };
}

/** Share of results [{ word, guess }] where the word came first. */
export function shareRight(results) {
  return results.filter(({ word, guess }) => guess === word).length / results.length;
}

/** Share of simulated swipes whose word comes first. */
export function topOneRate(test) {
  return shareRight([...swipeTest(test)]);
}
