"use client";

import { useEffect, useRef, useState } from "react";
import { useContent } from "@/content/ContentProvider";
import { Reveal, SectionHeading, WaveWords } from "@/components/motion/Reveal";
import { ScrambleText } from "@/components/motion/ScrambleText";

const BG_CHARS = "/\\|+-=*:;.,`'~·<>[]{}?#@$%&Xx";
const FG_CHARS = "@#$%&8XxUuPpSsHhMmWwZz#@$%";

export function About() {
  const { about } = useContent();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hover, setHover] = useState(false);
  const hoverRef = useRef(false);
  const pointerRef = useRef({ x: 0.5, y: 0.5 });
  const initials = about.asciiInitials;

  useEffect(() => {
    hoverRef.current = hover;
  }, [hover]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let last = 0;
    let maskData: Uint8ClampedArray | null = null;
    let maskCols = 0;
    let maskRows = 0;

    const rebuildMask = (cols: number, rows: number) => {
      const mask = document.createElement("canvas");
      mask.width = cols;
      mask.height = rows;
      const mctx = mask.getContext("2d");
      if (!mctx) return;
      mctx.clearRect(0, 0, cols, rows);
      mctx.fillStyle = "#fff";
      mctx.font = `bold ${Math.floor(rows * 0.55)}px "Space Grotesk", sans-serif`;
      mctx.textAlign = "center";
      mctx.textBaseline = "middle";
      // Slightly offset dual initials like the reference (D upper-left, P lower-right feel)
      if (initials.length >= 2) {
        mctx.fillText(initials[0], cols * 0.38, rows * 0.42);
        mctx.fillText(initials[1], cols * 0.62, rows * 0.62);
      } else {
        mctx.fillText(initials, cols / 2, rows / 2);
      }
      maskData = mctx.getImageData(0, 0, cols, rows).data;
      maskCols = cols;
      maskRows = rows;
    };

    const draw = (now: number) => {
      const hovering = hoverRef.current;
      if (now - last < (hovering ? 90 : 220)) {
        raf = requestAnimationFrame(draw);
        return;
      }
      last = now;

      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = "#0a0a0e";
      ctx.fillRect(0, 0, rect.width, rect.height);

      const colW = hovering ? 6.5 : 7.5;
      const rowH = hovering ? 8.5 : 9.5;
      const cols = Math.floor(rect.width / colW);
      const rows = Math.floor(rect.height / rowH);
      if (cols !== maskCols || rows !== maskRows) rebuildMask(cols, rows);

      ctx.font = `${hovering ? 8 : 7}px ui-monospace, monospace`;
      ctx.textBaseline = "top";

      const px = pointerRef.current.x * cols;
      const py = pointerRef.current.y * rows;
      const t = now * 0.00035;

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const a = maskData ? maskData[(y * cols + x) * 4 + 3] : 0;
          const inGlyph = a > 40;
          // Stable-ish glyph pick so DP silhouette stays readable while still alive
          const stableIdx = (x * 17 + y * 31 + Math.floor(t + x * 0.15 + y * 0.1)) % FG_CHARS.length;

          if (!hovering) {
            // Idle: dim field + always-visible green initials (slower)
            if (inGlyph) {
              ctx.fillStyle = `rgba(204,255,61,${0.5 + (a / 255) * 0.45})`;
              ctx.fillText(FG_CHARS[stableIdx], x * colW, y * rowH);
            } else if (Math.random() > 0.955) {
              ctx.fillStyle = "rgba(84,84,92,0.45)";
              ctx.fillText(BG_CHARS[Math.floor(Math.random() * BG_CHARS.length)], x * colW, y * rowH);
            }
            continue;
          }

          // Hover: denser symbol field + brighter glyph initials
          const dx = x - px;
          const dy = y - py;
          const nearCursor = dx * dx + dy * dy < 36;

          if (inGlyph) {
            ctx.fillStyle = `rgba(204,255,61,${0.72 + (a / 255) * 0.28})`;
            ctx.fillText(FG_CHARS[stableIdx], x * colW, y * rowH);
          } else if (nearCursor || Math.random() > 0.48) {
            ctx.fillStyle = nearCursor ? "rgba(180,180,190,0.55)" : "rgba(70,70,78,0.5)";
            ctx.fillText(BG_CHARS[Math.floor(Math.random() * BG_CHARS.length)], x * colW, y * rowH);
          }
        }
      }

      if (hovering) {
        const sy = (now / 16) % rect.height;
        ctx.fillStyle = "rgba(204,255,61,0.1)";
        ctx.fillRect(0, sy, rect.width, 1.5);
      }

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [initials]);

  return (
    <section
      id="about"
      className="relative pad-x py-[clamp(2.5rem,7vh,4rem)] md:py-[clamp(5.5rem,14vh,11rem)]"
    >
      <Reveal>
        <div className="mb-[clamp(2.5rem,6vh,4rem)] flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="section-eyebrow mb-3">
              <span className="diamond" />
              {about.sectionId}
            </p>
            <SectionHeading text={about.headline} />
          </div>
          <p className="flex items-center gap-3 font-mono text-[.62rem] uppercase tracking-[.18em] text-faint">
            <span className="h-px w-8 bg-white/20" />
            {about.eyebrow}
          </p>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 gap-[clamp(2.5rem,6vw,6rem)] lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
        <Reveal>
          <figure className="relative w-full max-w-[240px] lg:max-w-[380px]">
            <div
              className="relative"
              onPointerEnter={() => setHover(true)}
              onPointerLeave={() => setHover(false)}
              onPointerMove={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                pointerRef.current = {
                  x: (e.clientX - r.left) / r.width,
                  y: (e.clientY - r.top) / r.height,
                };
              }}
            >
              <canvas
                ref={canvasRef}
                role="img"
                aria-label={`ASCII glyph portrait spelling the initials ${initials}`}
                className="block aspect-[3/4] w-full border border-line bg-bg-soft font-mono transition-[box-shadow,border-color] duration-300"
                style={{
                  boxShadow: hover ? "0 0 40px -8px rgba(204,255,61,.35)" : undefined,
                  borderColor: hover ? "rgba(204,255,61,.45)" : undefined,
                }}
              />
              <span className="corner corner-tl border" aria-hidden />
              <span className="corner corner-tr border" aria-hidden />
              <span className="corner corner-bl border" aria-hidden />
              <span className="corner corner-br border" aria-hidden />
            </div>
            <div className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 font-mono text-[.62rem] uppercase tracking-[.16em]">
              <span className="text-faint">subject</span>
              <span className="text-muted">
                <ScrambleText text={about.subjectLabel} hover />
              </span>
              <span className="text-faint">status</span>
              <span className="text-accent">
                {about.statusLabel}
                <span className="ml-2 inline-block h-[6px] w-[6px] animate-blink rounded-full bg-accent align-middle" />
              </span>
            </div>
          </figure>
        </Reveal>

        <Reveal delay={80}>
          <div className="relative lg:pr-12">
            <WaveWords
              as="p"
              text={about.body}
              highlights={about.highlights}
              stagger={0.02}
              duration={1.1}
              className="max-w-[58ch] text-[clamp(1.15rem,1.85vw,1.55rem)] leading-[1.65] text-text/90"
            />
            <span className="absolute right-0 top-0 hidden flex-col items-end gap-8 font-mono text-[.6rem] tracking-[.18em] text-faint [writing-mode:vertical-rl] lg:flex">
              <span>{about.verifiedLabel}</span>
              <span className="uppercase">{about.eyebrow}</span>
            </span>

            <div className="mt-[clamp(3rem,6vh,4.5rem)] grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
              {about.stats.map((s) => (
                <div key={s.label} className="border-t border-white/10 pt-4">
                  <p className="font-display text-[clamp(2rem,4.2vw,3.25rem)] font-semibold tracking-[-0.03em] text-text">
                    <ScrambleText text={s.value} reveal durationMs={700} />
                  </p>
                  <p className="mt-2 max-w-[14ch] font-mono text-[.62rem] uppercase leading-[1.5] tracking-[.12em] text-faint">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
