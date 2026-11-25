// "How it decides": the text on each card, the bell chart and the vote.

export const OVERVIEW = {
  dictShort: `{words} common English words. Each one becomes its ideal line: straight segments joining the centres
    of its keys, in order. <i>hello</i> is h → e → l → o (a double letter counts once). Built once, when the page opens.`,
  pointsShort: `Your swipe and every word line are redrawn as {n} points, evenly spaced along the line. Point 1 of
    your swipe is then compared with point 1 of a word, point 2 with point 2, and so on. Speed stops mattering; only
    the path counts.`,
  pruneShort: `A quick cut before the judges. People aim carefully at the first and the last letter, so a word
    stays only if it <b>starts on a light-blue key</b> (within {radius} keys of where your swipe starts) and <b>ends on a
    purple key</b> (within {radius} keys of where it ends; a key with both colours counts for both). Every other word is thrown out: of {words}, usually
    about one in ten is left for the judges.`,
  shapeShort: `Resizes your swipe and the word's line to the same size and lays one on top of the other. Score:
    the average distance between matching points. Where on the keyboard you drew does not matter.`,
  placeShort: `Compares your swipe with the word's line where both really are on the keyboard, nothing resized.
    Score: the average distance between matching points, in key widths.`,
  lettersShort: `<span class="ours">our addition</span> For each letter of the word, finds the closest point of
    your swipe, keeping the letters in order. Score: how far, on average, your swipe passes from each letter.`,
  bellShort: `How each judge turns a gap into a score. <b>Across:</b> the gap between your swipe and the word
    (0 = perfect, further right = worse). <b>Up:</b> the score the judge gives (top = 100%). The dashed line is σ, the
    judge's usual error, where the score is 61%: a dot left of it does better than usual, a dot right of it does
    worse. The dots are the leading words.`,
  voteShort: `Each bar is one word. Each colour is the penalty points from one judge: the bigger its gap, the more
    points (gold: the extra points rare words pay). The shortest bar, the fewest points in total, wins. The dashed
    line is the winner's total: the part of a bar past it is how far that word fell behind.`,
};
