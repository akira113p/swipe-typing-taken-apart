# Your finger never types the word

When you swipe across a phone keyboard, it never works out which letters you crossed. It compares your whole line with the ideal line of every word it knows (10,000 here) and holds a vote. This page lets you swipe, watch the vote, and take the machine apart: switch every part off, move every number, and measure the effect.

## How it works

| Step | What happens | Code |
|---|---|---|
| Lines | Every word becomes straight segments between its key centres | `core/path.js`, `core/templates.js` |
| Resample | Swipe and words become N evenly spaced points | `resample` |
| Prune | Words whose first or last key is far from the swipe's ends are dropped | `core/recognizer.js` |
| Shape judge | Average point-to-point distance after scaling both lines to the same box (SHARK², eq. 1–2) | `core/shape.js` |
| Place judge | The same distance on the real keys | `core/judges.js` |
| Letters judge (ours) | Each letter finds its own spot on the swipe, in order, first and last pinned; dynamic programming | `core/letters.js` |
| Vote | Each gap costs ½(gap/σ)² penalty points, rare words pay −λ·ln P(word); share ∝ e^−points | `core/vote.js` |

The recognizer receives only the swipe's points, never anything from the page.

## What is computed and what is drawn by hand

Every line, number, chart and vote is computed in the browser by our code from the swipe and the settings. The keyboard drawing and colours are decoration. The example buttons slide along the word's keys with rounded corners; they are not recorded swipes. The accuracy test (Figure 4) uses our simulated finger (`core/finger.js`), not real people.

## What we changed from SHARK²

- **Added the letters judge.** Point-to-point matching breaks when a real finger curves: a curved *hello* came out as *help*. Measured on simulated swipes of random dictionary words, a careful finger went from 80% to 91% first-place, a sloppy one from 41% to 61%.
- **Left out** the tunnel, the 2σ cut-off and the speed rule; prune on the real keys; word frequency only (no word pairs).

## Where this falls short

- Phones today learn from real swipes with machine learning; their methods are not public.
- Our tolerances were tuned on our own simulated finger.
- Words that draw the same line (*tip*/*top*, *to*/*too*) are decided by frequency alone.

## Things we didn't make ourselves

| What | Where | Why |
|---|---|---|
| *FrequencyWords* by Hermit Dave (OpenSubtitles 2018), CC BY-SA 4.0 | `data/words.txt` | Plain-text English list with counts and an open licence; spoken language is close to phone typing |
| Fonts Alegreya, Alegreya SC, IM Fell English (Google Fonts, OFL) | `index.html` | Readable, close to the organisers' example |

## Sources

- P.O. Kristensson and S. Zhai, "SHARK2: A Large Vocabulary Shorthand Writing System for Pen-based Computers", UIST 2004.
- S. Zhai and P.O. Kristensson, "The Word-Gesture Keyboard: Reimagining Keyboard Interaction", CACM 55(9), 2012.
- B.A. Smith, X. Bi and S. Zhai, "Optimizing Touchscreen Keyboards for Gesture Typing", CHI 2015.

## Running it

`python serve.py` (a plain `python -m http.server` that tells the browser not to reuse old files), then open http://localhost:8000. Tests: `node --test` (Node 24, no dependencies).

## Layout

`core/` pure functions, no page, tested in Node · `viz/` drawing (keyboard, charts) · `ui/` input, controls, text (`ui/text/`) · `css/` · `tests/`. No file is longer than 60 lines. Code: MIT (`LICENSE`). Word list: CC BY-SA 4.0 (`data/LICENSE-DATA.md`).
