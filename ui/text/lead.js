// Text around the keyboard: the opening and the hint.

// Keys named in the text, coloured like the opening figure: yellow for the word's keys, grey for the others.
// The keys a straight "hello" crosses come from keysCrossed (core/crossed.js), checked by tests/geometry.test.js.
const key = (letter) => `<kbd class="word">${letter}</kbd>`;
const passed = (letter) => `<kbd class="crossed">${letter}</kbd>`;

export const LEAD = {
  lead: `Write <i>hello</i> on a phone by sliding one finger: from ${key("h")} up to ${key("e")}, across to
    ${key("l")}, up to ${key("o")}. On the way your finger also crosses ${["g", "f", "t", "r", "y", "j"].map(passed).join(" ")}
    and ${passed("k")}. If the keyboard typed every key you touched, you would get
    nonsense. So it does not read letters at all. It keeps the ideal line of every word it knows ({words} here),
    straight from key centre to key centre, and when you lift your finger it lays your line over each one, like
    tracing paper. Three judges ask three questions: is it the same drawing, is it on the same keys, does it pass
    every letter in order? Common words get a small head start, and the word with the fewest penalty points wins.
    This page runs that whole process in your browser, in our own code. Swipe a word, watch the vote, then switch
    the parts off one by one and see what breaks.<a class="fn" href="#fn1">1</a>`,
  hint: "Slide your finger (or mouse) across the keys and lift. Or watch an example:",
};
