// Fills every element marked data-text="key" with its text. Our own strings, so markup is allowed.
// {name} placeholders are filled from the core, so numbers in the prose match the code.

import { DEFAULTS } from "../core/settings.js";
import { SLIDERS, SWITCHES } from "./control-spec.js";
import { showDiagram } from "./diagram.js";
import { fillPlaceholders, number } from "./format.js";
import { SUGGESTION_COUNT } from "./notepad.js";
import { SHOWN_BARS } from "./results.js";
import { ACCURACY } from "./text/accuracy.js";
import { DIAGRAM_NOTES } from "./text/diagram.js";
import { LEAD } from "./text/lead.js";
import { NOTES } from "./text/notes.js";
import { OVERVIEW } from "./text/overview.js";

const TEXT = { ...LEAD, ...OVERVIEW, ...ACCURACY, ...NOTES, ...DIAGRAM_NOTES };

export function fillText(params) {
  const radius = number(DEFAULTS.pruneRadiusKeys, 1);
  const values = { n: DEFAULTS.samplePoints, radius, shown: SHOWN_BARS, suggestions: SUGGESTION_COUNT,
    switches: SWITCHES.length, sliders: SLIDERS.length, ...params };
  document.querySelectorAll("[data-text]").forEach((node) => {
    node.innerHTML = fillPlaceholders(TEXT[node.dataset.text], values);
  });
  showDiagram(values);
}
