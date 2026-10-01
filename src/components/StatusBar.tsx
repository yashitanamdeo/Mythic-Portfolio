"use client";

import { useShell } from "./ShellProvider";

const SECTION_LABELS: Record<string, string> = {
  hero: "00 / INTRO",
  about: "01 / ABOUT",
  capabilities: "02 / CAPABILITIES",
  work: "03 / EXPERIENCE",
  projects: "04 / SELECTED WORK",
  skills: "05 / SKILLS",
  upskilling: "06 / UPSKILLING",
  contact: "07 / CONTACT",
};

export function StatusBar() {
  const { booted, activeSection, scrollProgress, istClock, setTerminalOpen } = useShell();
  if (!booted) return null;

  return (
    <>
      <div className="pointer-events-none fixed bottom-0 left-0 z-[700] pad-x pb-4 md:pb-5">
        <p className="flex items-center gap-2 font-mono text-[.58rem] uppercase tracking-[.18em] text-muted">
          <span className="inline-block h-[6px] w-[6px] animate-blink rounded-full bg-accent" />
          {SECTION_LABELS[activeSection] ?? "00 / INTRO"}
        </p>
      </div>

      <div className="pointer-events-none fixed bottom-0 right-0 z-[700] pad-x pb-4 md:pb-5">
        <div className="pointer-events-auto flex items-center gap-4 font-mono text-[.58rem] tabular-nums tracking-[.14em] text-faint">
          <button
            type="button"
            data-cursor="hover"
            aria-label="Run whoami in the terminal"
            onClick={() => setTerminalOpen(true)}
            className="text-muted hover:text-accent"
          >
            whoami
          </button>
          <span>{String(Math.round(scrollProgress)).padStart(3, "0")}%</span>
          <span>{istClock} IST</span>
        </div>
      </div>
    </>
  );
}
