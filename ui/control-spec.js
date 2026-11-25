// Every switch and slider on the page. Keys match core/settings.js, so the values go
// straight into recognize() as options. `rebuild` = the word lines must be prepared again.

export const SWITCHES = [
  { key: "usePruning", label: "<b>Pruning</b>: drop words that start or end far from your swipe." },
  { key: "useShape", label: "<b>Shape judge</b>: same drawing?" },
  { key: "usePlace", label: "<b>Place judge</b>: on the right keys?" },
  { key: "useLetters", label: "<b>Letters judge</b>: every letter, in order?" },
  { key: "usePrior", label: "<b>Word frequency</b>: common words win ties." },
];

export const SLIDERS = [
  {
    key: "samplePoints", label: "N, points per line", unit: "points", min: 8, max: 96, step: 4, rebuild: true,
    help: "How many points each line is cut into. Fewer: faster, but corners get lost.",
  },
  {
    key: "sigmaShape", label: "σ shape", unit: "of the box", min: 0.02, max: 0.5, step: 0.01,
    help: "How different the shape may be before it costs points. Smaller = stricter.",
  },
  {
    key: "sigmaPlaceKeys", label: "σ place", unit: "keys", min: 0.1, max: 2, step: 0.05,
    help: "How far from the word's line your swipe may stray before it costs points. Smaller = stricter.",
  },
  {
    key: "sigmaLettersKeys", label: "σ letters", unit: "keys", min: 0.05, max: 1, step: 0.05,
    help: "How far from a letter your swipe may pass before it costs points. Also the yellow circles.",
  },
  {
    key: "priorWeight", label: "λ, frequency weight", unit: "", min: 0, max: 1.5, step: 0.05,
    help: "How much common words are favoured. 0 = not at all.",
  },
  {
    key: "pruneRadiusKeys", label: "Pruning radius", unit: "keys", min: 0.5, max: 4, step: 0.25,
    help: "Words whose first or last key is farther than this from your swipe's ends are dropped.",
  },
  {
    key: "minShapeSpanKeys", label: "Smallest shape", unit: "keys", min: 0, max: 2, step: 0.1, rebuild: true,
    help: "Swipes smaller than this are not enlarged, so a shaky tap is not read as a drawing.",
  },
];
