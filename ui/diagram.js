// Puts words and numbers into the pipeline diagram, in the layout that fits the screen.

import { drawDiagram } from "../viz/diagram.js";
import { NARROW, WIDE } from "../viz/diagram-layout.js";
import { fillPlaceholders } from "./format.js";
import { DIAGRAM } from "./text/diagram.js";

const phone = matchMedia("(max-width: 640px)");
let values = {};

/** newValues: the numbers for the {name} placeholders. Called again whenever they change. */
export function showDiagram(newValues) {
  values = newValues;
  draw();
}

function draw() {
  const texts = Object.entries(DIAGRAM)
    .map(([id, lines]) => [id, lines.map((line) => fillPlaceholders(line, values))]);
  drawDiagram(document.getElementById("diagram"), phone.matches ? NARROW : WIDE, Object.fromEntries(texts));
}

phone.addEventListener("change", draw);
