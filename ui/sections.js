// Fills every element marked data-text="key" with its text. Our own strings, so markup is allowed.
// {name} placeholders are filled from the core, so numbers in the prose match the code.

import { KEY_WIDTH_MM } from "../core/keyboard.js";
import { DEFAULTS } from "../core/settings.js";
import { showDiagram } from "./diagram.js";
import { fillPlaceholders, number } from "./format.js";
import { SUGGESTION_COUNT } from "./notepad.js";
import { SHOWN_ROWS } from "./vote-table.js";
import { ACCURACY } from "./text/accuracy.js";
import { DIAGRAM_NOTES } from "./text/diagram.js";
import { LEAD } from "./text/lead.js";
import { NOTES } from "./text/notes.js";
import { OVERVIEW } from "./text/overview.js";

const TEXT = { ...LEAD, ...OVERVIEW, ...ACCURACY, ...NOTES, ...DIAGRAM_NOTES };

export function fillText(params) {
  const radius = number(DEFAULTS.pruneRadiusKeys, 1);
  const values = { n: DEFAULTS.samplePoints, radius, shown: SHOWN_ROWS, suggestions: SUGGESTION_COUNT,
    keyMm: number(KEY_WIDTH_MM, 0), ...params };
  document.querySelectorAll("[data-text]").forEach((node) => {
    node.innerHTML = fillPlaceholders(TEXT[node.dataset.text], values);
  });
  showDiagram(values);
}
