"use client";

import { useEffect, useRef, useState } from "react";
import { useContent } from "@/content/ContentProvider";
import { useShell } from "./ShellProvider";

const STATUS = {
  ok: "[ ok ]",
  wait: "[ .. ]",
  warn: "[ !! ]",
} as const;

export function BootSequence() {
  const content = useContent();
  const { booted, setBooted } = useShell();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(0);
  const [flash, setFlash] = useState(false);
  const lines = content.boot.lines;
  const skipRef = useRef(() => setBooted(true));
  skipRef.current = () => setBooted(true);

  const lineCount = lines.length;

  useEffect(() => {
    if (booted) return;

    const timers: number[] = [];
    for (let i = 0; i < lineCount; i += 1) {
      timers.push(window.setTimeout(() => setVisible(i + 1), 280 + i * 320));
    }

    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 2800);
      const eased = 1 - Math.pow(1 - t, 2.4);
      setProgress(Math.floor(eased * 100));
      if (t < 1) {
        raf = requestAnimationFrame(tick);
        return;
      }
      setFlash(true);
      timers.push(window.setTimeout(() => setBooted(true), 520));
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
    };
  }, [booted, setBooted, lineCount]);

  if (booted) return null;

  return (
    <div className="fixed inset-0 z-[950] bg-bg">
      <div className="grain !z-[951] opacity-[0.05]" aria-hidden />

      <p className="absolute left-[var(--pad)] top-7 z-[952] font-mono text-[.6rem] uppercase tracking-[.25em] text-faint">
        {content.boot.signalLock}
      </p>

      <button
        type="button"
        data-cursor="hover"
        aria-label="Skip intro animation"
        onClick={() => skipRef.current()}
        className="absolute right-[calc(var(--pad)-1rem)] top-3 z-[952] flex min-h-11 min-w-11 items-center justify-center rounded-full border border-line/70 px-4 py-2.5 font-mono text-[.72rem] uppercase tracking-[.18em] text-muted hover:border-accent/50 hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        {content.boot.skipLabel}
      </button>

      {flash && (
        <p className="pointer-events-none absolute inset-x-0 top-[18%] z-[952] text-center font-mono text-[.85rem] uppercase tracking-[.4em] text-accent md:text-[1.05rem]">
          {content.boot.accessGranted}
        </p>
      )}

      <div className="absolute left-[var(--pad)] top-[28%] z-[952] max-w-[min(640px,calc(100vw-2*var(--pad)))] md:top-[24%]">
        <div className="mb-3 font-mono text-[.6rem] uppercase tracking-[.25em] text-faint">
          {content.boot.title}
        </div>
        <div className="font-mono text-[.68rem] leading-[1.9] text-muted md:text-[.72rem]">
          {lines.slice(0, visible).map((line) => (
            <div key={line.text} className="mpre-row flex gap-[.9em] whitespace-nowrap">
              <span
                className={`mpre-st shrink-0 tracking-[.08em] ${
                  line.status === "ok"
                    ? "text-accent"
                    : line.status === "wait"
                      ? "text-[#ffa116]"
                      : "text-accent3"
                }`}
              >
                {STATUS[line.status]}
              </span>
              <span className={line.status === "wait" ? "text-[#d6d6de]/80" : "text-muted"}>
                {line.text}
              </span>
            </div>
          ))}
          <span className="inline-block animate-blink font-mono text-[.72rem] leading-none text-accent">
            ▌
          </span>
        </div>
      </div>

      <div className="absolute bottom-[7%] right-[var(--pad)] z-[952] text-right">
        <div className="font-display text-[clamp(4rem,14vw,12rem)] font-semibold leading-none tracking-[-0.04em] text-text tabular-nums">
          {String(progress).padStart(3, "0")}
          <span className="text-[.35em] text-accent">%</span>
        </div>
        <div className="ml-auto mt-3 h-[2px] w-[min(280px,58vw)] overflow-hidden bg-white/10">
          <div className="h-full bg-accent transition-[width] duration-100" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  );
}
