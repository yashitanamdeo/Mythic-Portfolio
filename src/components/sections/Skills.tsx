"use client";

import { useEffect, useRef } from "react";
import { useContent } from "@/content/ContentProvider";
import { Reveal, SectionHeading } from "@/components/motion/Reveal";

type ChipState = {
  el: HTMLElement;
  cx: number;
  cy: number;
  x: number;
  y: number;
  p: number;
  idle: boolean;
};

const RADIUS = 180;
const STRENGTH = 6;

export function Skills() {
  const { skills } = useContent();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;
    if (window.matchMedia("(hover: none), (pointer: coarse)").matches) return;

    const chips: ChipState[] = Array.from(root.querySelectorAll<HTMLElement>(".msk-chip")).map(
      (el) => ({
        el,
        cx: 0,
        cy: 0,
        x: 0,
        y: 0,
        p: 0,
        idle: true,
      }),
    );

    let pointerX = 0;
    let pointerY = 0;
    let active = false;
    let dirtyLayout = true;
    let raf = 0;

    const measure = () => {
      dirtyLayout = false;
      const sx = window.scrollX;
      const sy = window.scrollY;
      for (const chip of chips) {
        const r = chip.el.getBoundingClientRect();
        chip.cx = r.left + r.width / 2 - chip.x + sx;
        chip.cy = r.top + r.height / 2 - chip.y + sy;
      }
    };

    const tick = () => {
      if (dirtyLayout) measure();
      const sx = window.scrollX;
      const sy = window.scrollY;

      for (const chip of chips) {
        let targetP = 0;
        let targetX = 0;
        let targetY = 0;

        if (active) {
          const dx = pointerX - (chip.cx - sx);
          const dy = pointerY - (chip.cy - sy);
          const dist = Math.hypot(dx, dy);
          if (dist < RADIUS) {
            targetP = 1 - dist / RADIUS;
            const pull = (STRENGTH * targetP) / (dist || 1);
            targetX = dx * pull;
            targetY = dy * pull;
          }
        }

        const lerp = targetP > chip.p ? 0.18 : 0.12;
        chip.p += (targetP - chip.p) * lerp;
        chip.x += (targetX - chip.x) * lerp;
        chip.y += (targetY - chip.y) * lerp;

        if (chip.p < 0.005 && Math.abs(chip.x) < 0.05 && Math.abs(chip.y) < 0.05) {
          if (!chip.idle) {
            chip.idle = true;
            chip.p = 0;
            chip.x = 0;
            chip.y = 0;
            chip.el.style.transform = "";
            chip.el.style.borderColor = "";
            chip.el.style.color = "";
            chip.el.style.boxShadow = "";
          }
          continue;
        }

        chip.idle = false;
        const s = chip.p;
        chip.el.style.transform = `translate(${chip.x.toFixed(2)}px, ${chip.y.toFixed(2)}px)`;
        chip.el.style.borderColor = `rgba(${Math.round(255 - 51 * s)},255,${Math.round(255 - 194 * s)},${(0.1 + 0.75 * s).toFixed(3)})`;
        chip.el.style.color = `rgb(${Math.round(138 + 66 * s)},${Math.round(138 + 117 * s)},${Math.round(147 - 86 * s)})`;
        chip.el.style.boxShadow = `0 0 ${(22 * s).toFixed(1)}px rgba(204,255,61,${(0.28 * s).toFixed(3)})`;
      }

      raf = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      pointerX = e.clientX;
      pointerY = e.clientY;
      active = true;
    };
    const onLeave = () => {
      active = false;
    };
    const onScroll = () => {
      dirtyLayout = true;
    };
    const onResize = () => {
      dirtyLayout = true;
    };

    root.addEventListener("pointermove", onMove);
    root.addEventListener("pointerleave", onLeave);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      for (const chip of chips) {
        chip.el.style.transform = "";
        chip.el.style.borderColor = "";
        chip.el.style.color = "";
        chip.el.style.boxShadow = "";
      }
    };
  }, [skills.groups]);

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="relative pad-x py-[clamp(2.5rem,7vh,4rem)] md:py-[clamp(5rem,12vh,11rem)]"
    >
      <Reveal>
        <div className="mb-[clamp(2.5rem,6vh,4rem)] flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="section-eyebrow mb-3">
              <span className="diamond" />
              {skills.sectionId}
            </p>
            <SectionHeading text={skills.headline} />
          </div>
          <p className="flex items-center gap-3 font-mono text-[.62rem] uppercase tracking-[.18em] text-faint">
            <span className="h-px w-8 bg-white/20" />
            {skills.eyebrow}
          </p>
        </div>
      </Reveal>

      <div className="space-y-8 md:space-y-10">
        {skills.groups.map((group, gi) => (
          <Reveal key={group.key} delay={gi * 60}>
            <div className="msk-group grid grid-cols-1 gap-4 border-t border-white/[0.06] pt-6 md:grid-cols-[minmax(10rem,16rem)_1fr] md:gap-8">
              <p className="font-mono text-[.68rem] uppercase tracking-[.18em] text-faint">
                <span className="text-accent">[{group.key}]</span> {group.title}
              </p>
              <ul className="flex flex-wrap items-center gap-2.5 md:gap-3">
                {group.items.map((item) => {
                  const decor = item === "//" || item === "0x" || item === "::";
                  if (decor) {
                    return (
                      <li
                        key={`${group.key}-${item}`}
                        className="select-none px-1.5 py-2 font-mono text-sm text-faint"
                        aria-hidden
                      >
                        {item}
                      </li>
                    );
                  }
                  return (
                    <li
                      key={`${group.key}-${item}`}
                      className="msk-chip whitespace-nowrap rounded-full border border-line px-4 py-2 font-mono text-sm text-muted max-md:px-3.5 max-md:text-[.8rem]"
                      data-cursor="hover"
                    >
                      {item}
                    </li>
                  );
                })}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
