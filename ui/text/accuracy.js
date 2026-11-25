// The accuracy test.

// One name per level of core/accuracy.js SLOPPINESS_LEVELS_KEYS, from left to right.
export const LEVEL_NAMES = ["precise", "careful", "average", "sloppy", "messy"];

export const ACCURACY = {
  accuracyShort: `A simulated finger swipes the same {count} random words at five levels of sloppiness. Each swipe is
    read twice: with <b>your settings</b> (blue line) and with the <b>defaults</b> (grey line). From left to right
    the finger gets worse: it lands farther from each key and curves more between keys. These controls are the
    same ones as next to the keyboard: change them here or there, run the test, and see whether your change helped.`,
  accuracyCaption: `Each square is one word; hover it to see the word and how each setting read it. The finger is our
    own model, not recorded data. Some words can never win: they draw the same line as a more common word
    (like <i>tip</i> and <i>top</i>).`,
  accuracyTry: `Try: switch the letters judge off and run the test. Then switch only the letters judge on (shape
    and place off) and run it again. Neither part is good alone.`,
};
