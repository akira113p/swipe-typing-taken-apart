// The words in the pipeline diagram: [title, detail, tag] per box. The tag names the controls
// that change that step, with the same names as on the switches and sliders (ui/control-spec.js).

export const DIAGRAM = {
  swipe: ["Your swipe", "the finger path on the keyboard"],
  points: ["N equal points", "resampled to {n} points", "N"],
  dictionary: ["Dictionary", "{words} words, each a path over its keys"],
  pruning: ["Pruning", "drop words that start or end far from the swipe", "on/off · radius"],
  shape: ["Shape judge", "compares shapes", "on/off · σ · smallest"],
  place: ["Place judge", "compares positions", "on/off · σ"],
  letters: ["Letters judge", "every letter, in order", "on/off · σ"],
  frequency: ["Frequency", "common words get a small head start", "on/off · λ"],
  settings: ["Settings", "Change any step with the switches and sliders by the keyboard. The dark tag on a box lists what you can change there."],
  frequencies: ["Word frequencies", "from movie subtitles"],
  vote: ["The vote", "each judge hands out penalty points; the fewest points win"],
  ranked: ["Ranked words", "the top {shown}, with their share of the vote"],
  screen: ["On the phone", "the winner is typed; the top {suggestions} are offered as suggestions"],
};

export const DIAGRAM_NOTES = {
  diagramNote: `The whole path of one swipe. The layout follows the architecture figure of the SHARK<sup>2</sup>
    paper<a class="fn" href="#fn1">1</a>; the letters judge is our addition.`,
};
