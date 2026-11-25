// Fills every element marked data-text="key" with its text. Our own strings, so markup is allowed.
// {name} placeholders are filled from the core, so numbers in the prose match the code.

import { DEFAULTS } from "../core/settings.js";
import { number } from "./format.js";
import { ACCURACY } from "./text/accuracy.js";
import { LEAD } from "./text/lead.js";
import { NOTES } from "./text/notes.js";
import { OVERVIEW } from "./text/overview.js";

const TEXT = { ...LEAD, ...OVERVIEW, ...ACCURACY, ...NOTES };

export function fillText(params) {
  const values = { n: DEFAULTS.samplePoints, radius: number(DEFAULTS.pruneRadiusKeys, 1), ...params };
  document.querySelectorAll("[data-text]").forEach((node) => {
    node.innerHTML = TEXT[node.dataset.text].replace(/\{(\w+)\}/g, (_, name) => values[name] ?? "");
  });
}
