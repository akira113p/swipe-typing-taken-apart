# Your finger never types the word

**Swipe typing, taken apart.** When you swipe across a phone keyboard, the phone never works out which letters you crossed. It compares your whole line with the ideal line of every word it knows (10,000 here) and holds a vote. This page lets you swipe, watch the vote, and take the machine apart: switch every part off, move every number, and measure the effect.

Built for the Global Virtual Hackathon 2026. Plain JavaScript in ES modules, HTML and CSS. No framework, no library, no build step, no server code, no API key.

## Try it

```
python serve.py        # then open http://localhost:8000
node --test            # 21 tests, Node 24, no dependencies
```

`serve.py` is `python -m http.server` plus a header that stops the browser reusing old files, so edits show up on reload. Any static server works, including GitHub Pages.

1. **Swipe a word** on the keyboard inside the phone, or press one of the example buttons (*hello*, *keyboard*, *thanks*, *tip*, *you*). No microphone or camera is needed.
2. **Read the vote.** The winner, the runners-up and how many of the 10,000 words survived each step appear next to the phone.
3. **Take it apart.** Switch any judge off, or open *Tune every number* and move a slider. The vote redraws at once.
4. **Measure it.** *Run the test* scores your settings against the defaults on simulated swipes of random dictionary words.

## How it works

| Step | What happens | Code |
|---|---|---|
| Lines | Every word becomes straight segments between its key centres | `core/path.js`, `core/templates.js` |
| Resample | Swipe and words become N evenly spaced points | `resample` in `core/path.js` |
| Prune | Words whose first or last key is far from the swipe's ends are dropped | `core/recognizer.js` |
| Shape judge | Average point-to-point distance after scaling both lines to the same box (SHARK², eq. 1–2) | `core/shape.js` |
| Place judge | The same distance on the real keys | `core/judges.js` |
| Letters judge (ours) | Each letter finds its own spot on the swipe, in order, first and last pinned; dynamic programming | `core/letters.js` |
| Vote | Each gap costs ½(gap/σ)² penalty points, rare words pay −λ·ln P(word); share ∝ e^−points | `core/vote.js` |

The recognizer receives only the swipe's points, never anything from the page.

## What is computed and what is drawn by hand

Every line, number, chart and vote is computed in the browser by our code from the swipe and the settings. The phone frame (`img/phone-frame.png`), the colours and the five ink panels under the title (`img/`) are decoration. What appears on the phone is computed: each swipe writes the vote's winner followed by a space, and the bar above the keys shows the three words with the most votes (`ui/notepad.js`). Tapping a suggestion swaps the last word; backspace deletes it. The example buttons slide along the word's keys with rounded corners; they are not recorded swipes. The accuracy test uses our simulated finger (`core/finger.js`), not real people.

## What the tests prove

`node --test` checks the claims the page makes, not just that functions run:

- A curved, realistic *hello* is recognized; without the letters judge it comes out as *help*.
- *tip* and *top* draw the same line, so they tie exactly when word frequency is off, and frequency breaks the tie.
- The shape judge alone cannot tell where you drew: *you* and *que* tie.
- Pruning removes more than 95% of the words at once.
- A gap of 1σ costs half a point, 2σ two, 3σ four and a half; one extra point divides a word's share by *e*.
- The letters judge raises accuracy on sloppy simulated swipes, and alone it is much worse than all judges together.

## What we changed from SHARK²

- **Added the letters judge.** Point-to-point matching breaks when a real finger curves: a curved *hello* came out as *help*. Measured on simulated swipes of random dictionary words, a careful finger went from 80% to 91% first-place, a sloppy one from 41% to 61%.
- **Left out** the tunnel, the 2σ cut-off and the speed rule; prune on the real keys; word frequency only (no word pairs).

## Where this falls short

- Phones today learn from real swipes with machine learning; their methods are not public.
- Our tolerances were tuned on our own simulated finger (`core/settings.js` explains how).
- Words that draw the same line (*tip*/*top*, *to*/*too*) are decided by frequency alone.

## Things we didn't make ourselves

| What | Where | Why |
|---|---|---|
| *FrequencyWords* by Hermit Dave (OpenSubtitles 2018), CC BY-SA 4.0 | `data/words.txt` | Plain-text English list with counts and an open licence; spoken language is close to phone typing |
| Fonts Source Serif 4 and Public Sans (Google Fonts, OFL) | `index.html` | Free stand-ins for the fonts of the design below, which are commercial |
| Design system (cream paper, ink tag headings, bordered buttons, grey side notes, categorical colours) from *Walkachusetts* by The Pudding, MIT | `css/tokens.css`, `css/components.css` | A calm, print-like look that keeps attention on the mechanism. Only their styles are reused, not their fonts or images |

## Sources

- P.O. Kristensson and S. Zhai, "SHARK2: A Large Vocabulary Shorthand Writing System for Pen-based Computers", UIST 2004.
- S. Zhai and P.O. Kristensson, "The Word-Gesture Keyboard: Reimagining Keyboard Interaction", CACM 55(9), 2012.
- B.A. Smith, X. Bi and S. Zhai, "Optimizing Touchscreen Keyboards for Gesture Typing", CHI 2015.

## Layout

```
index.html      the page
core/           pure functions, no page, tested in Node (path, judges, vote, finger, accuracy ...)
ui/             input, controls and text (ui/text/ holds every sentence shown)
viz/            drawing: keyboard, charts, figures
css/            tokens, components, layout
data/           word list and its licence
img/            decoration only
tests/          node --test
serve.py        local server without caching
```

Code: MIT (`LICENSE`). Word list: CC BY-SA 4.0 (`data/LICENSE-DATA.md`).
