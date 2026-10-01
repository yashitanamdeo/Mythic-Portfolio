const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@$%&*<>/\\|+=";

export function randomGlyph(preferUpper = true) {
  const ch = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
  return preferUpper ? ch : ch.toLowerCase();
}

/** Scramble `target` into itself over `durationMs`. Calls onFrame each tick. */
export function scrambleTo(
  target: string,
  onFrame: (value: string) => void,
  durationMs = 520,
): () => void {
  const start = performance.now();
  let raf = 0;
  const tick = (now: number) => {
    const t = Math.min(1, (now - start) / durationMs);
    const reveal = Math.floor(t * target.length);
    let out = "";
    for (let i = 0; i < target.length; i++) {
      const src = target[i];
      if (src === " " || src === "·" || src === "/" || src === "." || src === "-" || src === "+") {
        out += src;
        continue;
      }
      out += i < reveal ? src : randomGlyph(/[A-Z]/.test(src));
    }
    onFrame(out);
    if (t < 1) raf = requestAnimationFrame(tick);
    else onFrame(target);
  };
  raf = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(raf);
}

/**
 * Scramble a single character through random glyphs, then settle on `target`.
 * Only one active call should run at a time — callers cancel the previous stop fn.
 */
export function scrambleChar(
  target: string,
  onFrame: (value: string) => void,
  durationMs = 320,
): () => void {
  if (!target || target === " ") {
    onFrame(target);
    return () => undefined;
  }
  const start = performance.now();
  let raf = 0;
  let stopped = false;
  const upper = /[A-Z]/.test(target);
  const tick = (now: number) => {
    if (stopped) return;
    const t = Math.min(1, (now - start) / durationMs);
    onFrame(t < 0.82 ? randomGlyph(upper) : target);
    if (t < 1) raf = requestAnimationFrame(tick);
    else onFrame(target);
  };
  raf = requestAnimationFrame(tick);
  // Cancel always restores the original glyph so leave/hover handoff never sticks.
  return () => {
    stopped = true;
    cancelAnimationFrame(raf);
    onFrame(target);
  };
}
