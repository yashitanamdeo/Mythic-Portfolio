"use client";

import { useEffect, useRef, useState } from "react";
import { useContent } from "@/content/ContentProvider";
import { Reveal, SectionHeading } from "@/components/motion/Reveal";
import { ScrambleText } from "@/components/motion/ScrambleText";

export function Work() {
  const { experience } = useContent();
  const [active, setActive] = useState(0);
  const [railPct, setRailPct] = useState(0);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const listRef = useRef<HTMLOListElement>(null);
  const targetRail = useRef(0);
  const currentRail = useRef(0);

  useEffect(() => {
    let raf = 0;

    const measure = () => {
      const items = itemRefs.current.filter(Boolean) as HTMLLIElement[];
      if (!items.length) return;
      const mid = window.innerHeight * 0.42;
      let best = 0;
      let bestDist = Infinity;
      items.forEach((el, i) => {
        const r = el.getBoundingClientRect();
        const c = r.top + r.height * 0.35;
        const d = Math.abs(c - mid);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      });
      setActive(best);

      const first = items[0].getBoundingClientRect();
      const last = items[items.length - 1].getBoundingClientRect();
      const span = last.bottom - first.top;
      const traveled = mid - first.top;
      targetRail.current = Math.max(0, Math.min(1, traveled / Math.max(1, span)));
    };

    const tick = () => {
      currentRail.current += (targetRail.current - currentRail.current) * 0.12;
      if (Math.abs(targetRail.current - currentRail.current) < 0.001) {
        currentRail.current = targetRail.current;
      }
      setRailPct(currentRail.current);
      raf = requestAnimationFrame(tick);
    };

    measure();
    raf = requestAnimationFrame(tick);
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, [experience.items]);

  return (
    <section
      id="work"
      className="relative pad-x py-[clamp(2.5rem,7vh,4rem)] md:py-[clamp(5rem,12vh,9rem)]"
    >
      <Reveal>
        <div className="mb-[clamp(2.5rem,7vh,5.5rem)]">
          <p className="section-eyebrow mb-3">
            <span className="diamond" />
            {experience.sectionId}
          </p>
          <SectionHeading text={experience.headline} />
        </div>
      </Reveal>

      <div className="relative md:grid md:grid-cols-[3.5rem_minmax(0,1fr)] md:gap-8">
        <div className="relative hidden md:block" aria-hidden>
          <div className="absolute bottom-8 left-1/2 top-2 w-px -translate-x-1/2 bg-white/10" />
          <div
            className="absolute left-1/2 top-2 w-px -translate-x-1/2 origin-top bg-accent"
            style={{
              height: `calc((100% - 3rem) * ${railPct})`,
              boxShadow: "0 0 10px rgba(204,255,61,.35)",
            }}
          />
          <div
            className="absolute left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 bg-accent shadow-[0_0_14px_rgba(204,255,61,.55)]"
            style={{
              top: `calc(0.5rem + (100% - 4rem) * ${railPct})`,
              transition: "none",
            }}
          />
        </div>

        <ol ref={listRef} className="space-y-[clamp(3rem,7vh,5rem)]">
          {experience.items.map((job, i) => {
            const isActive = active === i;
            return (
              <li
                key={job.hex}
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                className="grid grid-cols-1 gap-6 border-t border-white/[0.08] pt-8 md:grid-cols-[4.5rem_minmax(0,1fr)] md:gap-10"
                onPointerEnter={() => setActive(i)}
              >
                <div className="font-mono text-[.68rem] text-accent">
                  <p>{job.hex}</p>
                  <p className="mt-2 text-faint">{String(i).padStart(2, "0")}</p>
                </div>

                <div>
                  <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[.62rem] uppercase tracking-[.14em] text-faint">
                    <span className="border border-accent/40 px-1.5 py-0.5 text-accent">
                      {job.range}
                    </span>
                    <span>{job.meta}</span>
                  </div>
                  <h3 className="font-display text-[clamp(1.45rem,2.6vw,2rem)] font-semibold tracking-[-0.02em] text-text">
                    {job.role} <span className="text-muted">/</span>{" "}
                    <span className={`company-hollow ${isActive ? "is-active" : ""}`}>
                      {job.company}
                    </span>
                  </h3>
                  <p className="mt-3 max-w-[62ch] text-[clamp(1rem,1.3vw,1.1rem)] leading-[1.7] text-text/80">
                    {job.summary}
                  </p>
                  <ul className="mt-5 max-w-[64ch] space-y-3 text-[clamp(.95rem,1.2vw,1.05rem)] leading-[1.65] text-text/75">
                    {job.bullets.map((b) => (
                      <li key={b} className="flex gap-3">
                        <span className="mt-0.5 shrink-0 font-mono text-accent">&gt;</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {job.tags.map((tag) => (
                      <li key={tag} className="tag-chip bg-white/[0.02]">
                        {tag}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            );
          })}
          <li className="border-t border-white/[0.08] pt-6 font-mono text-[.62rem] uppercase tracking-[.18em] text-faint">
            [EOF] · end of trace
          </li>
        </ol>
      </div>
    </section>
  );
}
