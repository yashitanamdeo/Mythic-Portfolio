"use client";

import { useRef, useState, type PointerEvent } from "react";
import { useContent } from "@/content/ContentProvider";
import { useShell } from "@/components/ShellProvider";
import { Reveal, SectionHeading } from "@/components/motion/Reveal";
import { ScrambleText } from "@/components/motion/ScrambleText";

function lerpColor(t: number) {
  // #ededf0 → #ccff3d
  const r = Math.round(237 + (204 - 237) * t);
  const g = Math.round(237 + (255 - 237) * t);
  const b = Math.round(240 + (61 - 240) * t);
  return `rgb(${r},${g},${b})`;
}

export function Contact() {
  const { identity, contact } = useContent();
  const { istClock } = useShell();
  const [copied, setCopied] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [chip, setChip] = useState({ x: 0, y: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);
  const charRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const email = identity.email;
  const accentKey = identity.firstName.toLowerCase();

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const applyProximity = (clientX: number, clientY: number) => {
    for (const el of charRefs.current) {
      if (!el) continue;
      const r = el.getBoundingClientRect();
      const dist = Math.hypot(clientX - (r.left + r.width / 2), clientY - (r.top + r.height / 2));
      const o = Math.max(0, 1 - dist / 120);
      el.style.transform = `translateY(${(-8 * o).toFixed(2)}px)`;
      el.style.color = o > 0.02 ? lerpColor(Math.min(1, 1.35 * o)) : "";
    }
  };

  const clearProximity = () => {
    for (const el of charRefs.current) {
      if (!el) continue;
      el.style.transform = "";
      el.style.color = "";
    }
  };

  const onMove = (e: PointerEvent<HTMLButtonElement>) => {
    const r = btnRef.current?.getBoundingClientRect();
    if (!r) return;
    setChip({ x: e.clientX - r.left, y: e.clientY - r.top - 28 });
    applyProximity(e.clientX, e.clientY);
  };

  const renderEmail = () => {
    const at = email.indexOf("@");
    const local = at >= 0 ? email.slice(0, at) : email;
    const domain = at >= 0 ? email.slice(at) : "";
    const nameIdx = local.toLowerCase().indexOf(accentKey);
    const greenLen =
      nameIdx > 0 ? nameIdx : Math.max(1, Math.floor(local.length * 0.55));
    const chars = [...(local + domain)];

    return (
      <span className={`email-text ${hovering ? "is-hot" : ""}`} aria-hidden>
        {chars.map((ch, i) => {
          const isGreenBase = i < greenLen;
          return (
            <span
              key={`ch-${i}`}
              ref={(node) => {
                charRefs.current[i] = node;
              }}
              className={`email-ch mchar ${isGreenBase ? "email-green" : "email-white"}`}
            >
              {ch}
            </span>
          );
        })}
      </span>
    );
  };

  return (
    <section
      id="contact"
      className="relative overflow-hidden pad-x py-[clamp(2.5rem,7vh,4rem)] md:py-[clamp(5rem,12vh,11rem)]"
    >
      <p
        className="pointer-events-none absolute inset-x-0 top-[42%] hidden select-none text-center font-display text-[clamp(4rem,18vw,14rem)] font-semibold leading-none tracking-[-0.04em] text-white/[0.03] md:block"
        aria-hidden
      >
        CONNECT
      </p>

      <Reveal>
        <div className="mb-[clamp(2.5rem,6vh,4rem)] flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="section-eyebrow mb-3">
              <span className="diamond" />
              {contact.sectionId}
            </p>
            <SectionHeading text={contact.headline} />
          </div>
          <p className="flex items-center gap-3 font-mono text-[.62rem] uppercase tracking-[.18em] text-faint">
            <span className="h-px w-8 bg-white/20" />
            {contact.eyebrow}
          </p>
        </div>
      </Reveal>

      <p className="mb-5 font-mono text-[.62rem] uppercase tracking-[.18em] text-faint">
        {contact.channelLabel}
      </p>

      <button
        ref={btnRef}
        type="button"
        data-cursor="hover"
        data-cursor-label={copied ? "COPIED" : "COPY"}
        aria-label={`Copy email address ${identity.email} to clipboard`}
        onClick={copyEmail}
        onPointerEnter={() => setHovering(true)}
        onPointerLeave={() => {
          setHovering(false);
          clearProximity();
        }}
        onPointerMove={onMove}
        className="email-cta ct-wire group relative flex w-full max-w-5xl flex-col items-start text-left"
      >
        <span
          className={`copy-follow mxc-pill ${hovering || copied ? "is-on" : ""}`}
          style={{ left: chip.x, top: chip.y }}
          aria-hidden
        >
          {copied ? "COPIED" : "COPY"}
        </span>

        <span
          className="ct-email break-all font-display text-[clamp(1.65rem,3.8vw,3rem)] font-semibold tracking-[-0.03em]"
          aria-label={email}
          role="text"
        >
          {renderEmail()}
        </span>
        <span className="email-underline ct-underline is-always" aria-hidden />
      </button>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <p className="flex items-center gap-2 font-mono text-[.62rem] uppercase tracking-[.16em] text-faint">
          <span className="inline-block h-[6px] w-[6px] animate-blink rounded-full bg-accent" />
          {contact.statusLabel} / IST {istClock}
        </p>
        <div className="flex flex-wrap gap-5 font-mono text-[.68rem] uppercase tracking-[.18em]">
          {[
            { href: identity.github, label: "Github" },
            { href: identity.linkedin, label: "Linkedin" },
            { href: identity.resume, label: "Résumé" },
            ...(identity.phone
              ? [{ href: `tel:${identity.phone}`, label: "Call" }]
              : []),
          ].map((l) => (
            <a
              key={l.label}
              href={l.href}
              target={l.href.startsWith("tel:") ? undefined : "_blank"}
              rel={l.href.startsWith("tel:") ? undefined : "noreferrer"}
              data-cursor="hover"
              className="ct-social text-muted hover:text-accent"
            >
              <ScrambleText text={l.label} hover durationMs={320} />
              <span className="text-accent">-&gt;</span>
            </a>
          ))}
        </div>
      </div>

      <footer className="mt-[clamp(4rem,10vh,8rem)] flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.08] pt-8">
        <p className="font-mono text-[.58rem] uppercase tracking-[.18em] text-faint">
          {contact.footerCopy}
        </p>
        <div className="flex items-center gap-4">
          <span className="font-mono text-[.58rem] tracking-[.14em] text-faint">
            {identity.version}
          </span>
          <button
            type="button"
            data-cursor="hover"
            aria-label="Back to top"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="font-mono text-[.62rem] uppercase tracking-[.16em] text-muted hover:text-accent"
          >
            Back to top↑
          </button>
        </div>
      </footer>
    </section>
  );
}
