// Builds the switches and sliders from control-spec.js and reads them back as recognizer options.
// The same controls appear twice (next to the keyboard and next to the accuracy test):
// every copy of a control carries data-key, and moving one moves all its copies.

import { DEFAULTS } from "../core/settings.js";
import { SLIDERS, SWITCHES } from "./control-spec.js";
import { number } from "./format.js";

const all = (selector) => document.querySelectorAll(selector);
const copies = (key) => all(`[data-key="${key}"]`);
const decimals = (step) => (String(step).split(".")[1] ?? "").length;

export function buildControls() {
  all("[data-controls=switches]").forEach((box) => { box.innerHTML = SWITCHES.map((s) => `<label class="switch">
    <input type="checkbox" data-key="${s.key}"><span>${s.label}</span></label>`).join(""); });
  all("[data-controls=sliders]").forEach((box) => { box.innerHTML = SLIDERS.map((s) => `<label class="slider">
    <span class="slider-name">${s.label}</span><output data-value="${s.key}"></output>
    <input type="range" data-key="${s.key}" min="${s.min}" max="${s.max}" step="${s.step}">
    <span class="slider-help">${s.help}</span></label>`).join(""); });
  resetControls();
}

/** Puts every control back on the values in core/settings.js. */
function resetControls() {
  for (const s of SWITCHES) copies(s.key).forEach((input) => { input.checked = DEFAULTS[s.key]; });
  for (const s of SLIDERS) copies(s.key).forEach((input) => { input.value = DEFAULTS[s.key]; });
  showSliderValues();
}

function showSliderValues() {
  for (const s of SLIDERS) {
    const text = `${number(Number(copies(s.key)[0].value), decimals(s.step))} ${s.unit}`;
    all(`[data-value="${s.key}"]`).forEach((output) => { output.textContent = text; });
  }
}

/** { usePruning: true, sigmaShape: 0.12, ... }, ready for recognize(). All copies agree, so the first is read. */
export function readSettings() {
  const settings = { ...DEFAULTS };
  for (const s of SWITCHES) settings[s.key] = copies(s.key)[0].checked;
  for (const s of SLIDERS) settings[s.key] = Number(copies(s.key)[0].value);
  return settings;
}

/** Calls onChange(rebuild) on every change; rebuild = the word lines must be prepared again. */
export function watchControls(onChange) {
  for (const s of SWITCHES) copies(s.key).forEach((input) => input.addEventListener("change", () => {
    copies(s.key).forEach((copy) => { copy.checked = input.checked; });
    onChange(false);
  }));
  for (const s of SLIDERS) copies(s.key).forEach((input) => input.addEventListener("input", () => {
    copies(s.key).forEach((copy) => { copy.value = input.value; });
    showSliderValues();
    onChange(Boolean(s.rebuild));
  }));
  all("[data-reset]").forEach((button) => button.addEventListener("click", () => { resetControls(); onChange(true); }));
}
