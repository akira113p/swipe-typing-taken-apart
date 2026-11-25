// The footer: honesty notes, what we changed from the paper, and the footnotes.

export const NOTES = {
  honest: `<b>What is computed and what is drawn by hand.</b> Every line, dot, number, chart and vote on this
    page is computed in your browser by our own code, from your swipe and the settings above. The keyboard
    drawing and the colours are decoration. The example buttons slide along the word's keys with rounded corners;
    they are not recorded swipes. The accuracy test uses a simulated finger, not real people.`,
  changes: `<b>What we changed from the paper.</b> We added the letters judge. We left out the tunnel (a
    perfect score for any swipe within one key of the word's line) and the rule that throws away any word more
    than 2σ from the swipe: on our simulated swipes, removing them raised accuracy for sloppy fingers. We prune on
    the real keys instead of normalized lines. We use how common each word is on its own, not which word came
    before it (the paper uses word pairs), and we leave out the paper's speed rule, which trusts the place judge
    less when you swipe fast.`,
  short: `<b>Where this falls short.</b> Phones today learn from huge numbers of real swipes, and their exact
    methods are not public. Our tolerances were tuned on our own simulated finger, so they fit our idea of a
    finger. Words that share a line (<i>tip</i>/<i>top</i>, <i>to</i>/<i>too</i>) are decided by frequency alone.`,
  fn1: `P.O. Kristensson and S. Zhai, <a href="https://doi.org/10.1145/1029632.1029640">“SHARK<sup>2</sup>: A Large
    Vocabulary Shorthand Writing System for Pen-based Computers”</a>, UIST 2004, pp. 43–52. Shape judge: equations
    1–2. Place judge: equation 3, with equal weights and without the tunnel of equations 4–6. Bell curves and the
    vote: equations 7–9. Identical shapes: Table 1.`,
  fn2: `S. Zhai and P.O. Kristensson, <a href="https://doi.org/10.1145/2330667.2330689">“The Word-Gesture
    Keyboard: Reimagining Keyboard Interaction”</a>, Communications of the ACM 55(9), 2012. Bayes' rule: equations 3–4. The 537 conflicts: section 2.1.`,
  fn3: `Word list and frequencies: <a href="https://github.com/hermitdave/FrequencyWords"><i>FrequencyWords</i></a>
    by Hermit Dave, from OpenSubtitles 2018, <a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a>.
    Key proportions: B.A. Smith, X. Bi and S. Zhai, <a href="https://doi.org/10.1145/2702123.2702357">“Optimizing
    Touchscreen Keyboards for Gesture Typing”</a>, CHI 2015.`,
  source: `<b>Source code:</b> <a href="https://github.com/akira113p">GitHub</a>. Plain JavaScript, no libraries,
    no build step.`,
};
