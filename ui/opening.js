// The figure under the title: a straight swipe of "hello" and every key it crosses.
// It needs no dictionary, so it is drawn as soon as the page opens.

import { keysCrossed } from "../core/crossed.js";
import { keyCenters } from "../core/keyboard.js";
import { wordKeys } from "../core/path.js";
import { drawOpening } from "../viz/opening.js";

const WORD = "hello"; // the word of the opening text (ui/text/lead.js)
const centers = keyCenters();
const path = wordKeys(WORD, centers);
drawOpening(document.getElementById("opening"), { centers, path, crossed: keysCrossed(path), word: WORD });
