"use client";

import { useEffect, useRef, useState } from "react";
import { useContent } from "@/content/ContentProvider";
import { Reveal, SectionHeading } from "@/components/motion/Reveal";
import { ScrambleText } from "@/components/motion/ScrambleText";

export function Capabilities() {
  const { capabilities } = useContent();
  const [open, setOpen] = useState("");
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Open item when it scrolls into view; start closed
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    itemRefs.current.forEach((el, i) => {
      if (!el) return;
      const io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.45) {
            setOpen(capabilities.items[i]?.id ?? "");
          }
        },
        { threshold: [0.45], rootMargin: "-15% 0px -35% 0px" },
      );
      io.observe(el);
      observers.push(io);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [capabilities.items]);

  return (
    <section
      id="capabilities"
      className="relative pad-x py-[clamp(2rem,6vh,3.5rem)] md:py-[clamp(5rem,12vh,11rem)]"
    >
      <Reveal>
        <div className="mb-[clamp(2.5rem,6vh,4rem)] flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="section-eyebrow mb-3">
              <span className="diamond" />
              {capabilities.sectionId}
            </p>
            <SectionHeading text={capabilities.headline} />
          </div>
          <p className="flex items-center gap-3 font-mono text-[.62rem] uppercase tracking-[.18em] text-faint">
            <span className="h-px w-8 bg-white/20" />
            {capabilities.eyebrow}
          </p>
        </div>
      </Reveal>

      <div className="border-t border-white/[0.08]">
        {capabilities.items.map((cap, i) => {
          const isOpen = open === cap.id;
          return (
            <div
              key={cap.id}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              className={`relative overflow-hidden border-b border-white/[0.08] transition-colors duration-500 ${
                isOpen ? "bg-white/[0.025]" : ""
              }`}
              onPointerEnter={() => setOpen(cap.id)}
            >
              {isOpen && (
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-y-0 left-0 flex items-center overflow-hidden opacity-[0.07]"
                >
                  <span className="cap-watermark font-display text-[clamp(4rem,12vw,9rem)] font-semibold tracking-[-0.04em] text-transparent [-webkit-text-stroke:1px_rgba(237,237,240,0.7)]">
                    {cap.title}&nbsp;&nbsp;{cap.title}&nbsp;&nbsp;{cap.title}
                  </span>
                </div>
              )}
              <button
                type="button"
                data-cursor="hover"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? "" : cap.id)}
                className="group relative z-[1] flex w-full items-start justify-between gap-4 py-5 text-left md:items-center md:py-7"
              >
                <h3 className="flex flex-wrap items-baseline gap-x-3 gap-y-1 font-display text-[clamp(1.15rem,2.2vw,1.55rem)] tracking-[-0.02em]">
                  <span className="font-mono text-[.72rem] text-accent">/{cap.id}</span>
                  <span className="text-text group-hover:text-accent">{cap.title}</span>
                  <span className="font-mono text-[.58rem] uppercase tracking-[.12em] text-faint">
                    {cap.blurb}
                  </span>
                </h3>
                <span
                  className={`mt-1 shrink-0 font-mono text-lg transition-all duration-300 ${
                    isOpen ? "rotate-45 text-accent" : "text-muted"
                  }`}
                >
                  {isOpen ? "↘" : "→"}
                </span>
              </button>
              <div
                className={`relative z-[1] grid overflow-hidden transition-[grid-template-rows] duration-700 ease-ease ${
                  isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="min-h-0">
                  <div
                    role="region"
                    className="pb-7 md:grid md:grid-cols-[1.1fr_1fr] md:gap-10 md:pb-9"
                  >
                    <p className="max-w-[58ch] text-[clamp(.95rem,1.3vw,1.08rem)] leading-[1.7] text-text/80">
                      {cap.body}
                    </p>
                    <ul className="mt-4 flex flex-wrap gap-2 md:mt-0 md:content-start">
                      {cap.tags.map((tag) => (
                        <li key={tag} className="tag-chip">
                          {tag}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
