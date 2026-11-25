// The phone's screen, like a notes app: each swipe writes its winning word followed by a space,
// and the bar above the keys offers the three words with the most votes. Nothing here picks a word:
// the words and their order come from the recognizer's vote.

export const SUGGESTION_COUNT = 3; // as on phone keyboards: room for three words above the keys

/** screen: where the text goes; bar: the suggestion strip; eraseKey: the drawn backspace; onPick(word) after a tap. */
export function createNotepad({ screen, bar, eraseKey, onPick }) {
  const words = [];         // everything written so far
  let suggestions = [];     // the current swipe's leading words, best first
  let live = false;         // the last word belongs to the current swipe, so a new vote may still change it...
  let pickedByHand = false; // ...unless the reader tapped a suggestion: their choice wins

  function draw() {
    screen.textContent = words.map((word) => `${word} `).join(""); // every word ends with a space
    screen.scrollTop = screen.scrollHeight;
    const written = live ? words.at(-1) : null;
    bar.replaceChildren(...suggestions.map((word) => suggestionButton(word, word === written)));
  }

  function suggestionButton(word, written) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `suggestion${written ? " written" : ""}`;
    button.textContent = word;
    button.addEventListener("click", () => {
      words[words.length - 1] = word;
      pickedByHand = true;
      draw();
      onPick(word);
    });
    return button;
  }

  function erase() {
    words.pop();
    live = false;
    suggestions = [];
    draw();
  }
  // pointerdown is stopped here so a tap on backspace never starts a swipe.
  eraseKey.addEventListener("pointerdown", (event) => { event.stopPropagation(); erase(); });
  eraseKey.addEventListener("keydown", (event) => { if (event.key === "Enter" || event.key === " ") erase(); });

  return {
    /** After every vote. newSwipe: write a new word. Otherwise a setting changed: the last word follows the vote. */
    show(candidates, newSwipe) {
      const best = candidates[0]?.word;
      if (newSwipe) {
        live = best !== undefined;
        pickedByHand = false;
        if (live) words.push(best);
      } else if (live && !pickedByHand && best !== undefined) {
        words[words.length - 1] = best;
      }
      suggestions = live ? candidates.slice(0, SUGGESTION_COUNT).map((c) => c.word) : [];
      draw();
    },
  };
}
