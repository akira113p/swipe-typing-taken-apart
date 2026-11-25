// Text around the keyboard: the opening and the hint.

export const LEAD = {
  // The keys a straight "hello" crosses were measured on core/keyboard.js: h g f t r e r t y h j k l o.
  lead: `Write <i>hello</i> on a phone by sliding one finger: from h up to e, across to l, up to o. On the way
    your finger also crosses g, f, t, r, y, j and k. If the keyboard typed every key you touched, you would get
    nonsense. So it does not read letters at all. It keeps the ideal line of every word it knows ({words} here),
    straight from key centre to key centre, and when you lift your finger it lays your line over each one, like
    tracing paper. Three judges ask three questions: is it the same drawing, is it on the same keys, does it pass
    every letter in order? Common words get a small head start, and the word with the fewest penalty points wins.
    This page runs that whole process in your browser, in our own code. Swipe a word, watch the vote, then switch
    the parts off one by one and see what breaks.<a class="fn" href="#fn1">1</a>`,
  hint: "Slide your finger (or mouse) across the keys and lift. Or watch an example:",
};
