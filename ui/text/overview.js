// "How it decides": the text on each card, the bell chart and the vote.

export const OVERVIEW = {
  dictShort: `{words} common English words. Each one becomes its ideal line: straight segments joining the centres
    of its keys, in order. <i>hello</i> is h → e → l → o (a double letter counts once). Built once, when the page opens.`,
  pointsShort: `Your swipe and every word line are redrawn as {n} points, evenly spaced along the line. Point 1 of
    your swipe is then compared with point 1 of a word, point 2 with point 2, and so on. Speed stops mattering; only
    the path counts.`,
  pruneShort: `Throws out every word whose first key is more than {radius} keys from where your swipe starts, or
    whose last key is more than {radius} keys from where it ends. Of {words} words, usually only a few dozen are
    left for the judges.`,
  shapeShort: `Resizes your swipe and the word's line to the same size and lays one on top of the other. Score:
    the average distance between matching points. Where on the keyboard you drew does not matter.`,
  placeShort: `Compares your swipe with the word's line where both really are on the keyboard, nothing resized.
    Score: the average distance between matching points, in key widths.`,
  lettersShort: `<span class="ours">our addition</span> For each letter of the word, finds the closest point of
    your swipe, keeping the letters in order. Score: how far, on average, your swipe passes from each letter.`,
  bellShort: `How each judge turns a gap into a score. <b>Across:</b> the gap between your swipe and the word
    (0 = perfect). <b>Up:</b> the score the judge gives (top = 100%). The dashed line is σ, the judge's tolerance:
    at that gap the score has dropped to 61%. The dots are the leading words.`,
  voteShort: `Each judge gives every word penalty points: the bigger its gap, the more points. Rare words get a few
    extra points. The word with the fewest points in total wins.`,
};
