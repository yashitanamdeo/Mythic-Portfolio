"use client";

import Link from "next/link";
import { useContent } from "@/content/ContentProvider";
import { Reveal, SectionHeading } from "@/components/motion/Reveal";
import { ScrambleText } from "@/components/motion/ScrambleText";

export function Upskilling() {
  const { upskilling } = useContent();

  return (
    <section
      id="upskilling"
      className="relative pad-x py-[clamp(2rem,6vh,3.5rem)] md:py-[clamp(5rem,12vh,11rem)]"
    >
      <Reveal>
        <div className="mb-[clamp(2.5rem,6vh,4rem)] flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="section-eyebrow mb-3">
              <span className="diamond" />
              {upskilling.sectionId}
            </p>
            <SectionHeading text={upskilling.headline} />
          </div>
          <p className="flex items-center gap-3 font-mono text-[.62rem] uppercase tracking-[.18em] text-faint">
            <span className="h-px w-8 bg-white/20" />
            {upskilling.eyebrow}
          </p>
        </div>
      </Reveal>

      <p className="mb-10 max-w-[58ch] text-[clamp(.95rem,1.3vw,1.08rem)] leading-[1.7] text-text/80">
        {upskilling.body}
      </p>

      <div className="grid grid-cols-1 border-y border-white/[0.08] md:grid-cols-3">
        {upskilling.preview.map((t, i) => (
          <Link
            key={t.slug}
            href={`/upskilling/${t.slug}`}
            data-cursor="hover"
            className={`group relative block overflow-hidden px-0 py-6 transition-colors duration-300 hover:bg-white/[0.02] md:px-6 md:py-8 ${
              i > 0 ? "border-t border-white/[0.08] md:border-t-0 md:border-l" : ""
            }`}
          >
            <span
              className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-accent transition-transform duration-500 group-hover:scale-x-100"
              aria-hidden
            />
            <div className="mb-5 flex items-center justify-between gap-2 font-mono text-[.55rem] uppercase tracking-[.14em]">
              <span className="truncate text-faint">{t.id}</span>
              <span className="text-[#c9a227]">{t.status}</span>
            </div>
            <h3 className="font-display text-[1.3rem] tracking-[-0.02em] text-text transition-colors duration-300 group-hover:text-accent md:text-[1.45rem]">
              {t.title}
            </h3>
            <p className="mt-5 font-mono text-[.58rem] uppercase tracking-[.14em] text-muted">
              {t.topic}
              <span className="mx-2 text-white/20">·</span>
              {t.difficulty}
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <p className="font-mono text-[.68rem] uppercase tracking-[.08em] text-faint">
          <ScrambleText
            text={`${upskilling.stats.closed} closed · ${upskilling.stats.writeups} write-ups · ${upskilling.stats.hours}h logged`}
            reveal
            durationMs={700}
          />
        </p>
        <Link
          href="/upskilling"
          data-cursor="hover"
          className="font-mono text-[.72rem] uppercase tracking-[.16em] text-accent hover:underline"
        >
          — {upskilling.boardCta}
        </Link>
      </div>
    </section>
  );
}
