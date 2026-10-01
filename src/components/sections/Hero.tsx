"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { useContent } from "@/content/ContentProvider";
import { useShell } from "@/components/ShellProvider";
import { scrambleChar } from "@/lib/scramble";

type Rect = { x: number; y: number; w: number; h: number };

const MODULES = [
  { id: "M1", label: "GRID", x: 8, y: 18, w: 56, h: 28 },
  { id: "M2", label: "PLOTTER", x: 8, y: 72, w: 72, h: 28 },
  { id: "M3", label: "CROSSHAIR", x: 110, y: 40, w: 78, h: 28 },
  { id: "M4", label: "LINK", x: 210, y: 40, w: 56, h: 28 },
] as const;

function padCoord(n: number) {
  const whole = Math.floor(Math.abs(n));
  const frac = Math.round((Math.abs(n) % 1) * 10);
  return `${String(whole).padStart(4, "0")}.${frac}`;
}

function isUiTarget(el: EventTarget | null) {
  if (!(el instanceof Element)) return false;
  return Boolean(
    el.closest(
      "a, button, input, textarea, [data-hsx-ui], .hsx-block, .hsx-diag, .hsx-cta, .hsx-glyph, .hsx-radar",
    ),
  );
}

export function Hero() {
  const content = useContent();
  const { identity, hero } = content;
  const { booted, istClock, setTerminalOpen } = useShell();
  const sectionRef = useRef<HTMLElement>(null);

  const [pointer, setPointer] = useState({ x: 120, y: 180, inside: false });
  const [glyphSel, setGlyphSel] = useState<(Rect & { label: string }) | null>(null);
  const [nameHover, setNameHover] = useState(false);
  const [nameSel, setNameSel] = useState<Rect | null>(null);
  const [marquee, setMarquee] = useState<Rect | null>(null);
  const [activeMod, setActiveMod] = useState<string | null>(null);
  const [pulse, setPulse] = useState<{ x: number; y: number; key: number } | null>(null);
  const dragRef = useRef<{ x: number; y: number } | null>(null);
  const dragOriginRef = useRef<{ x: number; y: number } | null>(null);
  const nameBlockRef = useRef<HTMLDivElement>(null);
  const firstLineRef = useRef<HTMLSpanElement>(null);
  const lastLineRef = useRef<HTMLSpanElement>(null);
  const trail1Ref = useRef<HTMLDivElement>(null);
  const trail2Ref = useRef<HTMLDivElement>(null);
  const underRef = useRef<HTMLDivElement>(null);
  const marqueeTimer = useRef<number | null>(null);
  const marqueeRaf = useRef<number | null>(null);
  const stopGlyphRef = useRef<(() => void) | null>(null);
  const [nameDrawn, setNameDrawn] = useState(false);

  const localPoint = useCallback((clientX: number, clientY: number) => {
    const section = sectionRef.current;
    if (!section) return { x: 0, y: 0 };
    const rect = section.getBoundingClientRect();
    return { x: clientX - rect.left, y: clientY - rect.top };
  }, []);

  const collapseMarquee = useCallback((from: Rect, origin: { x: number; y: number }) => {
    if (marqueeRaf.current) cancelAnimationFrame(marqueeRaf.current);
    if (marqueeTimer.current) window.clearTimeout(marqueeTimer.current);
    const start = performance.now();
    const duration = 720;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const e = 1 - Math.pow(1 - t, 2.6);
      const rem = 1 - e;
      if (rem <= 0.02) {
        setMarquee(null);
        marqueeRaf.current = null;
        return;
      }
      setMarquee({
        x: origin.x + (from.x - origin.x) * rem,
        y: origin.y + (from.y - origin.y) * rem,
        w: from.w * rem,
        h: from.h * rem,
      });
      marqueeRaf.current = requestAnimationFrame(tick);
    };
    marqueeRaf.current = requestAnimationFrame(tick);
  }, []);

  const clearMarqueeSoon = useCallback(
    (from: Rect) => {
      if (marqueeTimer.current) window.clearTimeout(marqueeTimer.current);
      const origin = dragOriginRef.current ?? { x: from.x, y: from.y };
      marqueeTimer.current = window.setTimeout(() => collapseMarquee(from, origin), 900);
    },
    [collapseMarquee],
  );

  const runGlyphScramble = useCallback((ch: string, setDisplay: (v: string) => void) => {
    // Cancel any previous letter scramble, then run this one; returns a local stop fn.
    stopGlyphRef.current?.();
    const stop = scrambleChar(ch, setDisplay, 340);
    stopGlyphRef.current = stop;
    return stop;
  }, []);

  const onGlyphEnter = useCallback((el: HTMLElement) => {
    const section = sectionRef.current;
    if (!section) return;
    const s = section.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    setGlyphSel({
      x: r.left - s.left,
      y: r.top - s.top,
      w: r.width,
      h: r.height,
      label: `W ${Math.round(r.width)} PX`,
    });
  }, []);

  const syncNameSel = useCallback(() => {
    const section = sectionRef.current;
    const block = nameBlockRef.current;
    if (!section || !block) return;
    const s = section.getBoundingClientRect();
    const r = block.getBoundingClientRect();
    setNameSel({
      x: r.left - s.left - 8,
      y: r.top - s.top - 8,
      w: r.width + 16,
      h: r.height + 16,
    });
  }, []);

  useEffect(() => {
    syncNameSel();
    window.addEventListener("resize", syncNameSel);
    return () => window.removeEventListener("resize", syncNameSel);
  }, [syncNameSel, identity.handle, identity.lastName]);

  // Post-boot name draw: trail line sweeps L→R while clip-path reveals letters.
  useEffect(() => {
    if (!booted) {
      setNameDrawn(false);
      return;
    }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const line1 = firstLineRef.current;
    const line2 = lastLineRef.current;
    const t1 = trail1Ref.current;
    const t2 = trail2Ref.current;
    const under = underRef.current;
    if (!line1 || !line2 || !t1 || !t2) {
      setNameDrawn(true);
      return;
    }

    const bezier = (t: number) => {
      // hsxPlot ≈ cubic-bezier(0.3, 0.06, 0.7, 0.94)
      const cy = 3 * 0.06;
      const by = 3 * (0.94 - 0.06) - cy;
      const ay = 1 - cy - by;
      return ((ay * t + by) * t + cy) * t;
    };

    if (reduce) {
      line1.style.clipPath = "inset(-15% -0.5% -15% -0.5%)";
      line2.style.clipPath = "inset(-15% -0.5% -15% -0.5%)";
      t1.style.opacity = "0";
      t2.style.opacity = "0";
      under?.classList.add("is-on");
      setNameDrawn(true);
      return;
    }

    const layoutTrail = (trail: HTMLDivElement, line: HTMLElement) => {
      const block = nameBlockRef.current!;
      const br = block.getBoundingClientRect();
      const lr = line.getBoundingClientRect();
      trail.style.left = `${lr.left - br.left}px`;
      trail.style.top = `${lr.top - br.top + lr.height * 0.55}px`;
      trail.style.width = `${lr.width}px`;
      trail.style.opacity = "1";
      trail.style.transform = "scaleX(0)";
    };

    layoutTrail(t1, line1);
    layoutTrail(t2, line2);
    line1.style.clipPath = "inset(-15% 100.5% -15% -0.5%)";
    line2.style.clipPath = "inset(-15% 100.5% -15% -0.5%)";

    let raf = 0;
    const start = performance.now();
    // Timeline (seconds): line1 0.9–1.7, line2 2.0–2.9, fade trails 3.05
    const tick = (now: number) => {
      const t = (now - start) / 1000;

      const runLine = (
        line: HTMLElement,
        trail: HTMLDivElement,
        from: number,
        dur: number,
      ) => {
        if (t < from) return;
        const u = Math.min(1, (t - from) / dur);
        const e = bezier(u);
        const right = 100.5 - e * 101;
        line.style.clipPath = `inset(-15% ${Math.max(-0.5, right)}% -15% -0.5%)`;
        trail.style.transform = `scaleX(${e})`;
      };

      runLine(line1, t1, 0.15, 0.85);
      if (t >= 1.15) runLine(line2, t2, 1.15, 0.95);

      if (t >= 2.2) {
        under?.classList.add("is-on");
      }
      if (t >= 2.35) {
        const fade = Math.min(1, (t - 2.35) / 0.7);
        t1.style.opacity = String(1 - fade);
        t2.style.opacity = String(1 - fade);
      }
      if (t >= 3.1) {
        line1.style.clipPath = "inset(-15% -0.5% -15% -0.5%)";
        line2.style.clipPath = "inset(-15% -0.5% -15% -0.5%)";
        setNameDrawn(true);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [booted]);

  // Periodic red pulse near name / cursor
  useEffect(() => {
    if (!booted) return;
    const id = window.setInterval(() => {
      const section = sectionRef.current;
      if (!section) return;
      const base = nameBlockRef.current?.getBoundingClientRect();
      const s = section.getBoundingClientRect();
      const x = base
        ? base.left - s.left + base.width * (0.35 + Math.random() * 0.4)
        : pointer.x;
      const y = base
        ? base.top - s.top + base.height * (0.2 + Math.random() * 0.5)
        : pointer.y;
      setPulse({ x, y, key: Date.now() });
    }, 5200);
    return () => clearInterval(id);
  }, [booted, pointer.x, pointer.y]);

  const onPointerMove = (e: ReactPointerEvent<HTMLElement>) => {
    const { x, y } = localPoint(e.clientX, e.clientY);
    setPointer({ x, y, inside: true });
    const origin = dragRef.current;
    if (!origin) return;
    setMarquee({
      x: Math.min(origin.x, x),
      y: Math.min(origin.y, y),
      w: Math.abs(x - origin.x),
      h: Math.abs(y - origin.y),
    });
  };

  const onPointerDown = (e: ReactPointerEvent<HTMLElement>) => {
    if (e.button !== 0) return;
    if (isUiTarget(e.target)) return;
    if (window.matchMedia("(hover: none)").matches) return;
    const { x, y } = localPoint(e.clientX, e.clientY);
    dragRef.current = { x, y };
    dragOriginRef.current = { x, y };
    if (marqueeRaf.current) cancelAnimationFrame(marqueeRaf.current);
    if (marqueeTimer.current) window.clearTimeout(marqueeTimer.current);
    setMarquee({ x, y, w: 0, h: 0 });
    setGlyphSel(null);
    sectionRef.current?.classList.add("hsx-measuring");
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const endDrag = (e: ReactPointerEvent<HTMLElement>) => {
    if (!dragRef.current) return;
    dragRef.current = null;
    sectionRef.current?.classList.remove("hsx-measuring");
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* noop */
    }
    setMarquee((m) => {
      if (m && m.w > 4 && m.h > 4) {
        clearMarqueeSoon(m);
        return m;
      }
      return null;
    });
  };

  useEffect(() => {
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key !== "Escape") return;
      setMarquee((m) => {
        if (!m) return null;
        const origin = dragOriginRef.current ?? { x: m.x, y: m.y };
        collapseMarquee(m, origin);
        return m;
      });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [collapseMarquee]);

  const first = identity.handle;
  const last = identity.lastName.toUpperCase();

  // Fit hero type to the longer of first/last so long names
  // never wrap mid-word — size tracks available column width, not just vw.
  useEffect(() => {
    const block = nameBlockRef.current;
    const column = block?.parentElement;
    const h1 = block?.querySelector("h1");
    if (!block || !column || !(h1 instanceof HTMLElement)) return;

    const fit = () => {
      const available = column.clientWidth;
      if (available <= 0) return;

      const maxPx = Math.min(176, available * 0.98);
      const minPx = 36;
      let lo = minPx;
      let hi = maxPx;

      for (let i = 0; i < 14; i++) {
        const mid = (lo + hi) / 2;
        h1.style.fontSize = `${mid}px`;
        const w = Math.max(
          firstLineRef.current?.scrollWidth ?? 0,
          lastLineRef.current?.scrollWidth ?? 0,
        );
        if (w > available) hi = mid;
        else lo = mid;
      }

      h1.style.fontSize = `${lo}px`;
      syncNameSel();
    };

    fit();
    const ro = new ResizeObserver(() => fit());
    ro.observe(column);
    window.addEventListener("resize", fit);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", fit);
    };
  }, [first, last, syncNameSel, booted, nameDrawn]);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className={`hsx relative min-h-[100svh] overflow-hidden pt-[clamp(4.5rem,11vh,7.5rem)] pb-[clamp(4rem,9vh,6rem)] ${
        booted ? "hero-booted" : "hero-preboot"
      }`}
      onPointerMove={onPointerMove}
      onPointerDown={onPointerDown}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onPointerLeave={() => {
        setPointer((p) => ({ ...p, inside: false }));
        if (!dragRef.current) setGlyphSel(null);
      }}
      onPointerEnter={() => setPointer((p) => ({ ...p, inside: true }))}
    >
      <div className="hsx-grid" aria-hidden />
      <div
        className="hsx-glow pointer-events-none absolute left-0 top-0 z-[1] hidden md:block"
        style={{
          transform: `translate(${pointer.x}px, ${pointer.y}px)`,
          opacity: pointer.inside ? 1 : 0,
        }}
        aria-hidden
      />
      <div className="hsx-vig pointer-events-none absolute inset-0 z-[1]" aria-hidden />

      <span className="hsx-reg left-6 top-24 hidden md:block" aria-hidden />
      <span className="hsx-reg right-6 top-24 hidden md:block" aria-hidden />
      <span className="hsx-reg bottom-28 left-6 hidden md:block" aria-hidden />
      <span className="hsx-reg bottom-28 right-6 hidden md:block" aria-hidden />

      {/* Compass / radar HUD */}
      <RadarHUD />

      {/* Crosshair */}
      <div
        className={`pointer-events-none absolute inset-0 z-[20] hidden md:block ${
          pointer.inside ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden
      >
        <div className="hsx-cross-h" style={{ top: pointer.y }} />
        <div className="hsx-cross-v" style={{ left: pointer.x }} />
        <div className="hsx-pen" style={{ transform: `translate(${pointer.x}px, ${pointer.y}px)` }} />
        <div
          className="hsx-coord font-mono"
          style={{ transform: `translate(${pointer.x + 16}px, ${pointer.y - 28}px)` }}
        >
          X {padCoord(pointer.x)} · Y {padCoord(pointer.y)}
        </div>
        {marquee && marquee.w > 2 && marquee.h > 2 && (
          <div
            className="hsx-coord hsx-coord--dim font-mono"
            style={{ transform: `translate(${pointer.x + 16}px, ${pointer.y - 10}px)` }}
          >
            {Math.round(marquee.w)}×{Math.round(marquee.h)} PX
          </div>
        )}
      </div>

      {pulse && (
        <div
          key={pulse.key}
          className="hsx-pulse hidden md:block"
          style={{ left: pulse.x, top: pulse.y }}
          aria-hidden
        />
      )}

      {/* Whole name block selection — only while hovering the name */}
      {nameHover && nameSel && (
        <>
          <div
            className="pointer-events-none absolute z-[17] hidden md:block"
            style={{ left: nameSel.x, top: nameSel.y, width: nameSel.w, height: nameSel.h }}
            aria-hidden
          >
            <div className="hsx-gsel absolute inset-0 opacity-70" />
            <span className="hsx-ghd -left-[2px] -top-[2px]" />
            <span className="hsx-ghd -right-[2px] -top-[2px]" />
            <span className="hsx-ghd -bottom-[2px] -left-[2px]" />
            <span className="hsx-ghd -bottom-[2px] -right-[2px]" />
            <span className="hsx-ghd left-1/2 top-0 -ml-[2px] -mt-[2px]" />
            <span className="hsx-ghd bottom-0 left-1/2 -mb-[2px] -ml-[2px]" />
            <span className="hsx-ghd left-0 top-1/2 -ml-[2px] -mt-[2px]" />
            <span className="hsx-ghd right-0 top-1/2 -mr-[2px] -mt-[2px]" />
            <span className="absolute -top-5 left-0 font-mono text-[.5rem] tracking-[.16em] text-faint">
              NAME_BLOCK · 2 ENT
            </span>
            <span
              className="hsx-gdim font-mono"
              style={{ left: "50%", top: "-18px", transform: "translateX(-50%)" }}
            >
              W {Math.round(nameSel.w)} PX
            </span>
          </div>

          {/* Lead lines: name right edge → far right (above observers / titleblock) */}
          <LeadLines
            section={sectionRef.current}
            nameSel={nameSel}
            firstEl={firstLineRef.current}
            lastEl={lastLineRef.current}
          />
        </>
      )}

      {glyphSel && !marquee && (
        <div
          className="pointer-events-none absolute z-[18] hidden md:block"
          style={{ left: glyphSel.x, top: glyphSel.y, width: glyphSel.w, height: glyphSel.h }}
          aria-hidden
        >
          <div className="hsx-gsel absolute inset-0" />
          <span className="hsx-ghd -left-[2px] -top-[2px]" />
          <span className="hsx-ghd -right-[2px] -top-[2px]" />
          <span className="hsx-ghd -bottom-[2px] -left-[2px]" />
          <span className="hsx-ghd -bottom-[2px] -right-[2px]" />
          <span className="hsx-gdim font-mono">{glyphSel.label}</span>
        </div>
      )}

      {marquee && marquee.w > 1 && marquee.h > 1 && (
        <div
          className="pointer-events-none absolute z-[19] hidden animate-[mpre-in_0.25s_ease] md:block"
          style={{ left: marquee.x, top: marquee.y, width: marquee.w, height: marquee.h }}
          aria-hidden
        >
          <div className="hsx-gsel absolute inset-0 bg-white/[0.02]" />
          <span className="hsx-ghd -left-[2px] -top-[2px]" />
          <span className="hsx-ghd -right-[2px] -top-[2px]" />
          <span className="hsx-ghd -bottom-[2px] -left-[2px]" />
          <span className="hsx-ghd -bottom-[2px] -right-[2px]" />
          <span className="hsx-gdim font-mono">
            {Math.round(marquee.w)}×{Math.round(marquee.h)} PX
          </span>
        </div>
      )}

      <div className="pad-x relative z-[2] grid min-h-[88svh] grid-cols-1 gap-[clamp(2rem,5vw,5rem)] lg:grid-cols-[minmax(0,1fr)_minmax(380px,42%)] lg:items-end">
        <div className="relative flex flex-col justify-end pb-8 md:pb-16">
          <div className="mb-4 flex items-center gap-3 font-mono text-[.58rem] uppercase tracking-[.22em] text-faint">
            <span className="text-accent">◆</span>
            <span>{hero.signalLabel}</span>
            <span className="h-px w-8 bg-accent/50" />
            <span>NAME_BLOCK · 2 ENT</span>
          </div>

          <div
            className="relative w-fit"
            ref={nameBlockRef}
            onPointerEnter={() => {
              if (!nameDrawn) return;
              setNameHover(true);
              syncNameSel();
            }}
            onPointerLeave={() => {
              setNameHover(false);
              setGlyphSel(null);
            }}
            onPointerMove={() => {
              if (nameDrawn) syncNameSel();
            }}
          >
            <div ref={trail1Ref} className="hsx-trail" aria-hidden />
            <div ref={trail2Ref} className="hsx-trail" aria-hidden />
            <h1
              aria-label={`${first} ${last}`}
              className="relative font-display text-[2.8rem] font-bold leading-[.92] tracking-[-.04em] md:text-[clamp(3rem,11.5vw,11rem)]"
            >
              <GlyphLine
                ref={firstLineRef}
                text={first}
                solid
                className="hsx-name-line"
                onEnter={onGlyphEnter}
                onLeave={() => setGlyphSel(null)}
                scramble={runGlyphScramble}
                interactive={nameDrawn}
              />
              <GlyphLine
                ref={lastLineRef}
                text={last}
                solid={false}
                className="hsx-name-line text-stroke"
                onEnter={onGlyphEnter}
                onLeave={() => setGlyphSel(null)}
                scramble={runGlyphScramble}
                interactive={nameDrawn}
              />
            </h1>
            <div
              ref={underRef}
              className="hsx-under-draw mt-2 h-0.5 w-full bg-accent"
              aria-hidden
            />
          </div>

          <p
            className={`mt-[clamp(1.8rem,4vh,2.8rem)] max-w-[54ch] text-[clamp(1rem,1.35vw,1.125rem)] leading-[1.7] text-text/80 transition-opacity duration-700 ${
              nameDrawn ? "opacity-100" : "opacity-0"
            }`}
          >
            {hero.tagline}
          </p>

          <div
            className={`mt-8 flex flex-wrap gap-3 transition-opacity duration-700 ${
              nameDrawn ? "opacity-100" : "opacity-0"
            }`}
            data-hsx-ui
          >
            <a
              href={hero.primaryCta.href}
              data-cursor="hover"
              className="hsx-cta hsx-cta--fill group relative inline-flex min-h-11 items-center overflow-hidden border border-accent px-5 font-mono text-[.68rem] uppercase tracking-[.18em] text-text"
            >
              <span className="hsx-cta-bg absolute inset-0 bg-accent" aria-hidden />
              <span className="relative z-[1]">{hero.primaryCta.label}</span>
            </a>
            <a
              href={hero.secondaryCta.href}
              data-cursor="hover"
              className="hsx-cta hsx-cta--ghost relative inline-flex min-h-11 items-center border border-white/15 px-5 font-mono text-[.68rem] uppercase tracking-[.18em] text-muted"
            >
              {hero.secondaryCta.label}
            </a>
            {booted && (
              <button
                type="button"
                data-cursor="hover"
                onClick={() => setTerminalOpen(true)}
                className="inline-flex min-h-11 items-center px-2 font-mono text-[.62rem] uppercase tracking-[.16em] text-faint hover:text-accent md:hidden"
              >
                whoami →
              </button>
            )}
          </div>
        </div>

        <aside className="relative hidden flex-col justify-end gap-6 lg:flex" data-hsx-ui>
          <SysModules
            active={activeMod}
            onHover={setActiveMod}
            coords={`X ${padCoord(pointer.x)} · Y ${padCoord(pointer.y)}`}
          />
          <TitleBlock
            title={hero.dwgTitle}
            handle={identity.handle}
            rev={hero.rev}
            dwg={hero.dwgNo}
            clock={istClock}
          />
        </aside>
      </div>

      <div className="pad-x relative z-[2] mt-8 lg:hidden" data-hsx-ui>
        <TitleBlock
          title={hero.dwgTitle}
          handle={identity.handle}
          rev={hero.rev}
          dwg={hero.dwgNo}
          clock={istClock}
        />
      </div>
    </section>
  );
}

function LeadLines({
  section,
  nameSel,
  firstEl,
  lastEl,
}: {
  section: HTMLElement | null;
  nameSel: Rect;
  firstEl: HTMLElement | null;
  lastEl: HTMLElement | null;
}) {
  if (!section || !firstEl || !lastEl) return null;
  const s = section.getBoundingClientRect();
  const first = firstEl.getBoundingClientRect();
  const last = lastEl.getBoundingClientRect();
  const g = s.width - 30;
  const k = g - 92;
  const starts: [number, number][] = [
    [first.right - s.left + 12, first.top - s.top + first.height / 2],
    [last.right - s.left + 12, last.top - s.top + last.height / 2],
    [last.right - s.left + 14, nameSel.y + nameSel.h * 0.78],
  ];
  const midY = (first.top - s.top + (nameSel.y + nameSel.h * 0.78)) / 2;
  const labelYs = [midY - 34, midY + 2, midY + 38];
  const maxStartX = Math.max(...starts.map((p) => p[0]));
  if (k - maxStartX <= 36) return null;

  const capH = Math.round(first.height + last.height);
  const labels = [
    `CAP ${capH} PX`,
    "TRACKING -0.04 EM",
    `BASELINE Y ${Math.round(nameSel.y + nameSel.h * 0.78)}`,
  ];

  return (
    <svg
      className="pointer-events-none absolute inset-0 z-[16] hidden lg:block"
      width="100%"
      height="100%"
      aria-hidden
    >
      {starts.map(([x1, y1], i) => {
        const y2 = labelYs[i] ?? y1;
        return (
          <g key={labels[i]}>
            <circle cx={x1} cy={y1} r={2.2} className="fill-accent" />
            <path
              d={`M${x1} ${y1} L${k} ${y2} L${g} ${y2}`}
              fill="none"
              stroke="rgba(255,255,255,.35)"
              strokeWidth="1"
            />
            <text
              x={g}
              y={y2 - 6}
              textAnchor="end"
              className="fill-accent font-mono"
              style={{ fontSize: 8, letterSpacing: "0.14em" }}
            >
              {labels[i]}
              {i === 1 ? (
                <tspan dx="8" className="fill-[#ff5c7c]">
                  rev?
                </tspan>
              ) : null}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

const GlyphLine = forwardRef<
  HTMLSpanElement,
  {
    text: string;
    solid: boolean;
    className?: string;
    interactive?: boolean;
    onEnter: (el: HTMLElement) => void;
    onLeave: () => void;
    scramble: (ch: string, setDisplay: (v: string) => void) => () => void;
  }
>(function GlyphLine(
  { text, solid, className = "", interactive = true, onEnter, onLeave, scramble },
  ref,
) {
  return (
    <span
      ref={ref}
      className={`block ${solid ? "text-text" : ""} ${className}`}
    >
      {text.split("").map((ch, i) => (
        <Glyph
          key={`${ch}-${i}`}
          ch={ch}
          onEnter={onEnter}
          onLeave={onLeave}
          scramble={scramble}
          interactive={interactive}
        />
      ))}
    </span>
  );
});

function Glyph({
  ch,
  onEnter,
  onLeave,
  scramble,
  interactive,
}: {
  ch: string;
  onEnter: (el: HTMLElement) => void;
  onLeave: () => void;
  scramble: (ch: string, setDisplay: (v: string) => void) => () => void;
  interactive: boolean;
}) {
  const [display, setDisplay] = useState(ch);
  const localStop = useRef<(() => void) | null>(null);
  const original = useRef(ch);

  useEffect(() => {
    original.current = ch;
    setDisplay(ch);
  }, [ch]);

  return (
    <span
      className="hsx-glyph relative inline-block cursor-none transition-[background,color,transform] duration-200"
      onPointerEnter={(e) => {
        if (!interactive) return;
        onEnter(e.currentTarget);
      }}
      onPointerLeave={() => {
        if (!interactive) return;
        onLeave();
      }}
      onClick={() => {
        if (!interactive || ch === " ") return;
        localStop.current?.();
        localStop.current = scramble(ch, setDisplay);
      }}
    >
      {ch === " " ? "\u00A0" : display}
    </span>
  );
}

/** Literal ticks — avoids SSR/CSR float drift from Math.cos/sin. */
const RADAR_TICKS = [
  { x1: 80, y1: 44, x2: 84, y2: 44 },
  { x1: 75.177, y1: 62, x2: 78.641, y2: 64 },
  { x1: 62, y1: 75.177, x2: 64, y2: 78.641 },
  { x1: 44, y1: 80, x2: 44, y2: 84 },
  { x1: 26, y1: 75.177, x2: 24, y2: 78.641 },
  { x1: 12.823, y1: 62, x2: 9.359, y2: 64 },
  { x1: 8, y1: 44, x2: 4, y2: 44 },
  { x1: 12.823, y1: 26, x2: 9.359, y2: 24 },
  { x1: 26, y1: 12.823, x2: 24, y2: 9.359 },
  { x1: 44, y1: 8, x2: 44, y2: 4 },
  { x1: 62, y1: 12.823, x2: 64, y2: 9.359 },
  { x1: 75.177, y1: 26, x2: 78.641, y2: 24 },
] as const;

function RadarHUD() {
  return (
    <div className="hsx-radar" aria-hidden>
      <svg viewBox="0 0 88 88" className="h-full w-full">
        <circle cx="44" cy="44" r="40" fill="none" stroke="rgba(255,255,255,.22)" strokeWidth="1" />
        <circle
          cx="44"
          cy="44"
          r="30"
          fill="none"
          stroke="rgba(255,255,255,.18)"
          strokeWidth="1"
          strokeDasharray="3 4"
        />
        <circle cx="44" cy="44" r="16" fill="none" stroke="rgba(255,255,255,.28)" strokeWidth="1" />
        <g stroke="rgba(255,255,255,.35)" strokeWidth="1">
          {RADAR_TICKS.map((tick, i) => (
            <line key={i} x1={tick.x1} y1={tick.y1} x2={tick.x2} y2={tick.y2} />
          ))}
        </g>
        <circle cx="44" cy="44" r="2.5" fill="#ededf0" />
        <g className="origin-center animate-[radar-sweep_8s_linear_infinite]">
          <path d="M44 44 L44 8" stroke="rgba(204,255,61,.55)" strokeWidth="1" />
        </g>
      </svg>
    </div>
  );
}

function SysModules({
  active,
  onHover,
  coords,
}: {
  active: string | null;
  onHover: (id: string | null) => void;
  coords: string;
}) {
  return (
    <div className="hsx-diag relative mb-2">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="font-mono text-[.55rem] uppercase tracking-[.22em] text-faint">
          SYS // SHEET MODULES
        </p>
        {active && (
          <span className="border border-accent/50 px-2 py-0.5 font-mono text-[.5rem] uppercase tracking-[.14em] text-accent">
            {active} · {MODULES.find((m) => m.id === active)?.label} · ACTIVE
          </span>
        )}
      </div>
      <svg viewBox="0 0 280 120" className="w-full max-w-[300px] font-mono" aria-hidden>
        {MODULES.map((m) => {
          const on = active === m.id;
          const dim = active && !on;
          return (
            <g
              key={m.id}
              className={dim ? "hsx-dg-dim" : undefined}
              onPointerEnter={() => onHover(m.id)}
              onPointerLeave={() => onHover(null)}
              style={{ cursor: "none" }}
            >
              <rect
                className={`hsx-dg-box ${on ? "hsx-dg-on" : ""}`}
                x={m.x}
                y={m.y}
                width={m.w}
                height={m.h}
                rx="1"
              />
              <text className="hsx-dg-lab" x={m.x + m.w / 2} y={m.y + m.h / 2 + 1}>
                {m.label}
              </text>
              <text className="hsx-dg-idx" x={m.x + 4} y={m.y + 10} textAnchor="start">
                {m.id}
              </text>
            </g>
          );
        })}
        <path
          className={`hsx-dg-lead ${active === "M1" || active === "M3" ? "hsx-dg-lead--acc" : ""}`}
          d="M64 32 H90 V54 H110"
        />
        <path
          className={`hsx-dg-lead ${active === "M2" || active === "M3" ? "hsx-dg-lead--acc" : ""}`}
          d="M80 86 H96 V54 H110"
        />
        <path
          className={`hsx-dg-lead ${active === "M3" || active === "M4" ? "hsx-dg-lead--acc" : ""}`}
          d="M188 54 H210"
        />
        <path
          className={`hsx-dg-fb ${active === "M4" || active === "M1" ? "hsx-dg-lead--acc" : ""}`}
          d="M238 40 V12 H36 V18"
        />
        {active === "M3" && (
          <foreignObject x="110" y="74" width="120" height="20">
            <div className="border border-white/15 bg-bg/80 px-1.5 py-0.5 font-mono text-[7px] tracking-[.08em] text-muted">
              {coords}
            </div>
          </foreignObject>
        )}
      </svg>
    </div>
  );
}

function TitleBlock({
  title,
  handle,
  rev,
  dwg,
  clock,
}: {
  title: string;
  handle: string;
  rev: string;
  dwg: string;
  clock: string;
}) {
  const [date, setDate] = useState("----.--.--");
  useEffect(() => {
    setDate(new Date().toISOString().slice(0, 10).replace(/-/g, "."));
  }, []);

  return (
    <div className="hsx-block font-mono">
      <div className="hsx-cell flex items-center justify-between">
        <div className="hsx-obs is-live">
          <div className="hsx-obs-row">
            <span className="hsx-obs-dot" />
            <span className="hsx-lab !mb-0">Observers · live</span>
          </div>
        </div>
        <div className="hsx-bars" aria-hidden>
          <i style={{ width: 3 }} />
          <i style={{ width: 5 }} />
          <i style={{ width: 8 }} />
          <i style={{ width: 4 }} />
          <i style={{ width: 6 }} />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <div className="hsx-cell sm:col-span-2 lg:col-span-3">
          <span className="hsx-lab">Title</span>
          <span className="hsx-val hsx-val--title">{title}</span>
        </div>
        <div className="hsx-cell">
          <span className="hsx-lab">Drawn by</span>
          <span className="hsx-val">{handle}</span>
        </div>
        <div className="hsx-cell">
          <span className="hsx-lab">Scale</span>
          <span className="hsx-val">1:1</span>
        </div>
        <div className="hsx-cell">
          <span className="hsx-lab">Rev</span>
          <span className="hsx-val">{rev}</span>
        </div>
        <div className="hsx-cell">
          <span className="hsx-lab">Date</span>
          <span className="hsx-val">{date}</span>
        </div>
        <div className="hsx-cell sm:col-span-2">
          <span className="hsx-lab">Dwg No</span>
          <span className="hsx-val">{dwg}</span>
        </div>
        <div className="hsx-cell">
          <span className="hsx-lab">Clock</span>
          <span className="hsx-val">{clock} IST</span>
        </div>
      </div>
      <div className="hsx-foot hsx-cell flex items-center justify-between text-faint">
        <span className="text-[.5rem] tracking-[.14em]">000%</span>
        <span className="tracking-[.3em]">||||||</span>
      </div>
    </div>
  );
}
