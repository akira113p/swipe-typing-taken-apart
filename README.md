# Your finger never types the word

When you swipe across a phone keyboard, it never works out which letters you crossed. It compares the line you drew with the ideal line of every word it knows (10,000 here), once for its shape and once for its place on the keys, and lets common words win close calls. This page lets you swipe a word and watch that vote, then take it apart.

## What you can do with it

- **Swipe a word** with your finger or mouse, or tap a demo word. The page shows the winner, the two runners-up and how many words survived each step.
- **Inspect a word:** tap a runner-up to see its ideal line, its tunnel and how far each point of your swipe is from it.
- **Take it apart:** switch off the shape judge, the place judge or word frequency, and see the vote change on the same swipe. Example: *tip* and *top* draw the same straight line, so with word frequency off they tie exactly.
- **Under the hood:** the gaps and shares behind the vote.

## How it works

The method is SHARK² (Kristensson & Zhai, UIST 2004):

| Step | What happens | Code |
|---|---|---|
| Resample | The swipe and every word's ideal line become 48 equally spaced points | `core/geometry.js` `resample` |
| Prune | Words whose first or last key is more than 1.25 keys from the swipe's ends are dropped | `core/recognizer.js` |
| Shape judge | Both lines are scaled to the same box and centred; the gap is the average distance between matching points | `normalizeShape`, `meanPointDistance` |
| Place judge | On the real keys: 0 if the swipe stays inside a tunnel one key wide, otherwise a weighted average of the distances | `outsideTunnel`, `weightedPointDistance` |
| Vote | Each gap becomes a likelihood with a bell curve (σ = 0.12 box, 0.5 keys), anything beyond 2σ is dropped, the judges are multiplied, then multiplied by the word's frequency to the power 0.25 | `gaussian`, `recognize` |

The recognizer receives only the swipe's points, never anything from the page.

## What is computed and what is drawn by hand

Every line, number and vote is computed in the browser by our code from the swipe. The keyboard drawing and the colours are decoration. The demo buttons slide along the word's keys with rounded corners; they are not recorded swipes.

## What we simplified

- **Word frequency only.** We use how common each word is, not which word came before it (the paper uses word pairs).
- **No speed weighting.** The paper's speed weighting is left out.
- **Tuned tolerances.** The paper does not publish its tolerances. Ours were tuned on simulated swipes; with plain Bayes (frequency power 1) common words swamped the geometry.

## Where this falls short

- **Phones have moved on.** Modern keyboards (QuickPath, Gboard) learn from real swipes with neural networks; their methods are not public.
- **Some words always tie.** Words with identical lines (tip/top, to/too) can only be split by frequency.
- **Precision against tolerance.** A tolerant place judge forgives sloppy fingers but can let *help* beat a perfect *hello*.

## Things we didn't make ourselves

| What | Where it is used | Why we chose it |
|---|---|---|
| Word frequencies from *FrequencyWords* by Hermit Dave (OpenSubtitles 2018), CC BY-SA 4.0 | `data/words.txt` | The only plain-text English list with counts and an explicit open data licence; spoken-style language is close to what people type on phones |
| Fonts Alegreya, Alegreya SC, IM Fell English (Google Fonts, SIL Open Font Licence) | `index.html` | Readable, and close to the organisers' example |

## Sources

- P.O. Kristensson and S. Zhai, "SHARK2: A Large Vocabulary Shorthand Writing System for Pen-based Computers", UIST 2004.
- S. Zhai and P.O. Kristensson, "The Word-Gesture Keyboard: Reimagining Keyboard Interaction", Communications of the ACM 55(9), 2012.
- B.A. Smith, X. Bi and S. Zhai, "Optimizing Touchscreen Keyboards for Gesture Typing", CHI 2015 (key size, half-key row offset).

## Running it

```
python -m http.server
```
Then open http://localhost:8000. Tests: `node --test` (Node 24, no dependencies).

## The code

| File | What it does |
|---|---|
| `core/keyboard.js` | Key centres in key widths |
| `core/geometry.js` | Ideal lines, resampling, normalization, distances, the tunnel |
| `core/lexicon.js` | Reads the word list and word frequencies |
| `core/recognizer.js` | The vote |
| `viz/keyboard.js` | Draws the keyboard, the swipe and the lines |
| `ui/app.js` | Touch and mouse input, the switches, the results |
| `tests/recognizer.test.js` | Tests for the claims on the page |

Code: MIT licence (`LICENSE`). Word list: CC BY-SA 4.0 (`data/LICENSE-DATA.md`).
