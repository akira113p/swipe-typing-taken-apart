// The word wall: one small square per simulated swipe, coloured by which settings read it right.
// It draws what core/accuracy.js computed; it decides nothing.

const STATES = [
  ["both", "right with both"],
  ["gained", "right only with your settings"],
  ["lost", "right only with the defaults"],
  ["neither", "wrong with both"],
];

/** An empty row per sloppiness level, and the colour legend. */
export function clearWall(wall, levels) {
  const legend = STATES.map(([state, text]) => `<span><i class="cell ${state}"></i>${text}</span>`).join("");
  const rows = levels.map((level) => `<div class="wall-row"><span class="wall-level">${level} keys off</span>
    <div class="wall-cells"></div></div>`).join("");
  wall.innerHTML = `<p class="wall-legend">${legend}</p>${rows}`;
}

/** Adds one tested word to its level's row. Hover a square to see the word and both readings. */
export function addWord(wall, level, { word, guess, defaultGuess }) {
  const yours = guess === word;
  const theirs = defaultGuess === word;
  const state = yours && theirs ? "both" : yours ? "gained" : theirs ? "lost" : "neither";
  const cell = document.createElement("i");
  cell.className = `cell ${state}`;
  cell.title = `${word}: your settings read “${guess ?? "nothing"}”, the defaults read “${defaultGuess ?? "nothing"}”`;
  wall.querySelectorAll(".wall-cells")[level].appendChild(cell);
}
