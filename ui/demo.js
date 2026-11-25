// Plays a demo swipe (computed by core/demo.js) as if a finger were drawing it.

import { demoSwipe } from "../core/demo.js";

const DEMO_DURATION_MS = 650;

/** Every button with data-demo="word" plays that word, once the dictionary is ready. */
export function wireDemoButtons(centers, drawing, isReady) {
  document.querySelectorAll("[data-demo]").forEach((button) => button.addEventListener("click", () => {
    if (isReady()) playDemo(demoSwipe(button.dataset.demo, centers), drawing);
  }));
}

let playing = 0; // id of the demo now playing; a newer demo or a real swipe stops older ones

export function stopDemo() {
  playing++;
}

export function playDemo(points, { onDraw, onEnd }) {
  const id = ++playing;
  const start = performance.now();
  function frame(now) {
    if (id !== playing) return;
    const progress = Math.min(1, (now - start) / DEMO_DURATION_MS);
    const shown = points.slice(0, Math.max(1, Math.ceil(points.length * progress)));
    onDraw(shown);
    if (shown.length < points.length) requestAnimationFrame(frame);
    else onEnd(shown);
  }
  requestAnimationFrame(frame);
}
