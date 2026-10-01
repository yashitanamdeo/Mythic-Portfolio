"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

function prefersReducedMotion() {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Word-by-word wave reveal (matches original yPercent 110 → 0 stagger). */
export function WaveWords({
  text,
  as: Tag = "span",
  className = "",
  stagger = 0.045,
  duration = 0.9,
  highlights = [],
}: {
  text: string;
  as?: "span" | "p" | "h2" | "h1" | "div";
  className?: string;
  stagger?: number;
  duration?: number;
  highlights?: readonly string[];
}) {
  const ref = useRef<HTMLElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      setOn(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setOn(true);
          io.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const words = text.split(/(\s+)/);
  const lowerHighlights = highlights.map((h) => h.toLowerCase());

  // Mark tokens that belong to a multi-word highlight phrase
  const hotIdx = new Set<number>();
  const tokens = words.map((w) => w);
  for (const phrase of lowerHighlights) {
    const parts = phrase.split(/\s+/).filter(Boolean);
    if (parts.length === 0) continue;
    for (let i = 0; i < tokens.length; i += 1) {
      if (/^\s+$/.test(tokens[i]!)) continue;
      let ok = true;
      let ti = i;
      for (const part of parts) {
        while (ti < tokens.length && /^\s+$/.test(tokens[ti]!)) ti += 1;
        if (ti >= tokens.length || tokens[ti]!.toLowerCase().replace(/[^\w]/g, "") !== part.replace(/[^\w]/g, "")) {
          ok = false;
          break;
        }
        ti += 1;
      }
      if (!ok) continue;
      let mark = i;
      for (let p = 0; p < parts.length; p += 1) {
        while (mark < tokens.length && /^\s+$/.test(tokens[mark]!)) mark += 1;
        hotIdx.add(mark);
        mark += 1;
      }
    }
  }

  return (
    <Tag
      ref={ref as never}
      className={`wave-words ${on ? "is-in" : ""} ${className}`}
      aria-label={text}
    >
      {words.map((token, i) => {
        if (/^\s+$/.test(token)) {
          return <span key={`s-${i}`}>{token}</span>;
        }
        const hot =
          hotIdx.has(i) ||
          lowerHighlights.some((h) => h === token.toLowerCase());
        return (
          <span key={`w-${i}`} className="wave-word">
            <span
              className={`wave-word-inner ${hot ? "font-medium text-accent" : ""}`}
              style={{
                transitionDuration: `${duration}s`,
                transitionDelay: on ? `${Math.floor(i / 2) * stagger}s` : "0s",
              }}
            >
              {token}
            </span>
          </span>
        );
      })}
    </Tag>
  );
}

/** Section H2 with original-scale type + wave words. */
export function SectionHeading({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  return (
    <WaveWords
      as="h2"
      text={text}
      className={`section-title ${className}`}
      stagger={0.045}
      duration={0.95}
    />
  );
}

/** Generic bottom-wave container (for blocks that aren't word-split). */
export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal-wave ${shown ? "is-in" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
