"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useContent } from "@/content/ContentProvider";
import {
  BOARD_LANES,
  BOARD_TRACKS,
  buildBoardCards,
  getCardsByTrack,
  getPatterns,
  getSprintMeta,
  getTrackStats,
  type BoardCard,
  type BoardTrack,
} from "@/lib/board";

type TrackFilter = "ALL" | BoardTrack;

function DiffTone({ d }: { d: string }) {
  const v = d.toLowerCase();
  if (v === "hard") return "text-accent3";
  if (v === "easy") return "text-accent";
  return "text-[#ffa116]";
}

function TrackBar({
  track,
  done,
  total,
  pct,
  accent,
}: {
  track: string;
  done: number;
  total: number;
  pct: number;
  accent: string;
}) {
  return (
    <div className="border border-white/[0.08] bg-bg-soft/40 px-4 py-3">
      <div className="flex items-center justify-between gap-2 font-mono text-[.55rem] uppercase tracking-[.16em]">
        <span style={{ color: accent }}>{track}</span>
        <span className="text-faint">
          {done} / {total}
        </span>
      </div>
      <div className="mt-2 h-[3px] overflow-hidden bg-white/10">
        <div className="h-full transition-[width] duration-500" style={{ width: `${pct}%`, background: accent }} />
      </div>
      <p className="mt-2 font-mono text-[.5rem] uppercase tracking-[.14em] text-faint">{pct}% target</p>
    </div>
  );
}

function Card({ c }: { c: BoardCard }) {
  return (
    <Link
      href={`/upskilling/${c.slug}`}
      data-cursor="hover"
      className="board-card group block border border-white/[0.07] bg-[#0c0c10] p-3 transition-colors hover:border-accent/35"
    >
      <div className="mb-2 flex items-start justify-between gap-2 font-mono text-[.5rem] uppercase tracking-[.12em]">
        <span className="truncate text-accent/80">{c.id}</span>
        <span className={DiffTone({ d: String(c.difficulty) })}>{c.difficulty}</span>
      </div>
      <p className="font-display text-[.95rem] leading-[1.25] tracking-[-0.01em] text-text transition-colors group-hover:text-accent">
        {c.title}
      </p>
      <div className="mt-3 flex items-center justify-between gap-2 font-mono text-[.5rem] uppercase tracking-[.12em]">
        {c.practiceUrl ? (
          <span className="inline-flex items-center gap-1.5 text-[#ffa116]">
            <span className="rounded-[2px] bg-[#ffa116]/15 px-1 py-0.5 text-[.45rem]">LC</span>
            LeetCode
          </span>
        ) : (
          <span className="text-faint">—</span>
        )}
        <span className={c.hasWriteup ? "text-muted" : "text-faint"}>
          {c.hasWriteup ? "BLOG LIVE" : "NOTES TBD"}
        </span>
      </div>
    </Link>
  );
}

export default function UpskillingBoardPage() {
  const { identity, upskilling } = useContent();
  const cards = useMemo(() => buildBoardCards(), []);
  const sprint = useMemo(() => getSprintMeta(cards), [cards]);
  const trackStats = useMemo(() => getTrackStats(cards), [cards]);

  const [track, setTrack] = useState<TrackFilter>("ALL");
  const [pattern, setPattern] = useState<string | null>(null);

  const scoped = useMemo(() => getCardsByTrack(cards, track === "ALL" ? "ALL" : track), [cards, track]);
  const patterns = useMemo(() => getPatterns(scoped), [scoped]);
  const activePattern = pattern && patterns.some((p) => p.pattern === pattern) ? pattern : patterns[0]?.pattern ?? null;

  const laneCards = useMemo(() => {
    const base = activePattern ? scoped.filter((c) => c.pattern === activePattern) : scoped;
    return Object.fromEntries(BOARD_LANES.map((l) => [l.id, base.filter((c) => c.lane === l.id)])) as Record<
      string,
      BoardCard[]
    >;
  }, [scoped, activePattern]);

  const accents = ["#ccff3d", "#7c5cff", "#ff5c7c", "#ededf0"];

  return (
    <div className="min-h-screen pad-x pb-24 pt-20 md:pt-24">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/"
          data-cursor="hover"
          className="font-mono text-[.85rem] font-medium tracking-[.01em] text-muted hover:text-accent"
        >
          <span className="text-accent">~/</span>
          {identity.handle}
        </Link>
        <Link
          href="/#upskilling"
          data-cursor="hover"
          className="font-mono text-[.58rem] uppercase tracking-[.16em] text-faint hover:text-accent"
        >
          ← portfolio
        </Link>
      </div>

      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="section-title text-[clamp(2rem,4.5vw,3.5rem)]">Upskilling board</h1>
          <p className="mt-3 max-w-[54ch] text-[clamp(.95rem,1.25vw,1.05rem)] leading-[1.65] text-text/75">
            {upskilling.body}
          </p>
        </div>
        <div className="font-mono text-[.58rem] uppercase tracking-[.12em] text-faint">
          <p>
            Sprint {sprint.sprint}{" "}
            <span className="text-accent">18 – 24 AUG</span>
          </p>
          <p className="mt-1">
            {sprint.closed} closed · {sprint.writeups} write-ups · {sprint.hours}h logged
          </p>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {trackStats.map((t, i) => (
          <TrackBar
            key={t.track}
            track={t.track}
            done={t.done}
            total={t.total}
            pct={t.pct}
            accent={accents[i] ?? "#ccff3d"}
          />
        ))}
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        <button
          type="button"
          data-cursor="hover"
          onClick={() => {
            setTrack("ALL");
            setPattern(null);
          }}
          className={`border px-3 py-1.5 font-mono text-[.55rem] uppercase tracking-[.14em] ${
            track === "ALL"
              ? "border-accent/70 text-accent"
              : "border-white/10 text-faint hover:border-white/25"
          }`}
        >
          All tracks
        </button>
        {BOARD_TRACKS.map((t) => (
          <button
            key={t}
            type="button"
            data-cursor="hover"
            onClick={() => {
              setTrack(t);
              setPattern(null);
            }}
            className={`border px-3 py-1.5 font-mono text-[.55rem] uppercase tracking-[.14em] ${
              track === t
                ? "border-accent/70 text-accent"
                : "border-white/10 text-faint hover:border-white/25"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="border border-white/[0.08] bg-bg-soft/25">
          <header className="border-b border-white/[0.06] px-4 py-3 font-mono text-[.58rem] uppercase tracking-[.16em] text-muted">
            {track === "ALL" ? "DSA" : track} · sub-tracks
          </header>
          <ul className="max-h-[70vh] overflow-y-auto p-2">
            {patterns.map((p) => {
              const active = p.pattern === activePattern;
              return (
                <li key={p.pattern}>
                  <button
                    type="button"
                    data-cursor="hover"
                    onClick={() => setPattern(p.pattern)}
                    className={`relative w-full border-l-2 px-3 py-2.5 text-left transition-colors ${
                      active
                        ? "border-accent bg-accent/[0.06]"
                        : "border-transparent hover:bg-white/[0.02]"
                    }`}
                  >
                    <p className={`font-mono text-[.72rem] ${active ? "text-text" : "text-muted"}`}>
                      {p.pattern}
                    </p>
                    <p className="mt-1 font-mono text-[.5rem] uppercase tracking-[.12em] text-faint">
                      {p.done} / {p.total} done
                    </p>
                    {active ? <span className="mt-2 block h-px bg-accent/70" /> : null}
                  </button>
                </li>
              );
            })}
            {patterns.length === 0 && (
              <li className="px-3 py-8 text-center font-mono text-[.55rem] uppercase tracking-[.14em] text-faint">
                no patterns
              </li>
            )}
          </ul>
        </aside>

        <div className="overflow-x-auto">
          <div className="flex min-w-[980px] gap-3">
            {BOARD_LANES.map((lane) => {
              const items = laneCards[lane.id] ?? [];
              return (
                <section key={lane.id} className="w-[190px] shrink-0">
                  <header className="mb-3 flex items-center gap-2 font-mono text-[.55rem] uppercase tracking-[.14em]">
                    <i className="inline-block h-2 w-2 rotate-45" style={{ background: lane.color }} />
                    <span className="text-muted">{lane.label}</span>
                    <span className="text-faint">{items.length}</span>
                  </header>
                  <ul className="space-y-2">
                    {items.map((c) => (
                      <li key={c.slug}>
                        <Card c={c} />
                      </li>
                    ))}
                    {items.length === 0 && (
                      <li className="flex h-24 items-center justify-center border border-dashed border-white/10 font-mono text-[.5rem] uppercase tracking-[.16em] text-faint">
                        empty
                      </li>
                    )}
                  </ul>
                </section>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
