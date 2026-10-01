"use client";

import { useShell } from "@/components/ShellProvider";

/** Top-of-viewport lime scroll progress bar — driven by CSS var for fluid motion */
export function ScrollProgress() {
  const { booted } = useShell();
  if (!booted) return null;
  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[860] h-[2px] overflow-hidden bg-transparent"
      aria-hidden
    >
      <div
        className="scroll-progress-fill h-full origin-left bg-accent"
        style={{ width: "var(--scroll-progress, 0%)" }}
      />
    </div>
  );
}

/** Soft full-page scanning line */
export function ScanLine() {
  const { booted } = useShell();
  if (!booted) return null;
  return <div className="scanline" aria-hidden />;
}
