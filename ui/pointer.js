// Reads the finger. Pointer Events cover touch, pen and mouse with one set of handlers.

/**
 * Calls onDraw(points) while the finger moves and onEnd(points) when it lifts.
 * Points are converted from screen pixels to key widths, the core's unit.
 */
export function attachPointer(svg, { canStart, onDraw, onEnd }) {
  let drawing = false;
  let points = [];

  // The inverse of the SVG's screen matrix undoes the page's scaling and scrolling.
  const toKeys = (event) => {
    const p = new DOMPoint(event.clientX, event.clientY).matrixTransform(svg.getScreenCTM().inverse());
    return [p.x, p.y];
  };

  svg.addEventListener("pointerdown", (event) => {
    if (!canStart() || event.button > 0) return;
    svg.setPointerCapture(event.pointerId); // keep receiving moves even if the finger leaves the keys
    drawing = true;
    points = [toKeys(event)];
    onDraw(points);
  });

  svg.addEventListener("pointermove", (event) => {
    if (!drawing) return;
    // The browser may merge several moves into one event; getCoalescedEvents gets them all back.
    const events = event.getCoalescedEvents ? event.getCoalescedEvents() : [event];
    for (const e of events) points.push(toKeys(e));
    onDraw(points);
  });

  const finish = () => {
    if (!drawing) return;
    drawing = false;
    onEnd(points);
  };
  svg.addEventListener("pointerup", finish);
  svg.addEventListener("pointercancel", finish);
}
