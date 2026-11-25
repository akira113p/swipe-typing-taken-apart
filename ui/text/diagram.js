// The words in the pipeline diagram: [title, one line of detail] per box.

export const DIAGRAM = {
  swipe: ["Your swipe", "the finger path on the keyboard"],
  points: ["N equal points", "resampled to {n} points"],
  dictionary: ["Dictionary", "{words} words, each a path over its keys"],
  pruning: ["Pruning", "drop words that start or end far from the swipe"],
  shape: ["Shape judge", "same drawing?"],
  place: ["Place judge", "on the right keys?"],
  letters: ["Letters judge", "every letter, in order?"],
  frequency: ["Frequency", "common words get a small head start"],
  lambda: ["λ slider", "how much word frequency counts"],
  frequencies: ["Word frequencies", "from movie subtitles"],
  vote: ["The vote", "each judge hands out penalty points; the fewest points win"],
  ranked: ["Ranked words", "the top {shown}, with their share of the vote"],
  again: ["try another swipe"],
};

export const DIAGRAM_NOTES = {
  diagramNote: `The whole path of one swipe. The layout follows the architecture figure of the SHARK<sup>2</sup>
    paper<a class="fn" href="#fn1">1</a>; the letters judge is our addition.`,
};
