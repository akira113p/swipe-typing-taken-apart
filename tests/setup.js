// Shared by the tests: the real keyboard, the real word list, every word's line.

import { readFileSync } from "node:fs";

import { keyCenters } from "../core/keyboard.js";
import { parseWordList } from "../core/lexicon.js";
import { wordKeys } from "../core/path.js";
import { recognize } from "../core/recognizer.js";
import { buildTemplates } from "../core/templates.js";

export const centers = keyCenters();
export const { words, prior } = parseWordList(readFileSync(new URL("../data/words.txt", import.meta.url), "utf8"));
export const templates = buildTemplates(words, centers);

/** A swipe that runs exactly through the centres of the word's keys. */
export const perfect = (word) => wordKeys(word, centers);

export const vote = (points, options) => recognize(points, templates, prior, options);
export const shares = (result) => Object.fromEntries(result.candidates.map((c) => [c.word, c.share]));
export const winner = (result) => result.candidates[0]?.word;

/** The "hello" from a real screenshot: h, a curve down through g-f-d, up to e, along to l, up to o. */
const PIXELS = [[476, 313], [440, 312], [400, 305], [360, 292], [335, 275], [320, 250], [312, 230], [290, 224],
  [275, 222], [318, 226], [400, 240], [500, 262], [580, 285], [640, 305], [636, 280], [628, 255], [622, 235]];
const KEY_PX = 57; // one key width on that screenshot; q's centre was at (158, 222)
export const curvedHello = PIXELS.map(([x, y]) => [(x - 158) / KEY_PX + 0.5, (y - 222) / KEY_PX + 0.75]);
