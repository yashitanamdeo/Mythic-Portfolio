import { TICKETS, type Ticket } from "@/data/tickets";
import { WRITEUPS, type Writeup } from "@/data/writeups";

export type BoardTrack = "DSA" | "SYSTEM DESIGN" | "LOW-LEVEL DESIGN" | "JS / TS";
export type BoardLane =
  | "backlog"
  | "solving"
  | "solved"
  | "revision-1"
  | "revision-2"
  | "revision-3";

export type BoardCard = {
  slug: string;
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard" | string;
  track: BoardTrack;
  pattern: string;
  lane: BoardLane;
  status: string;
  practiceUrl: string | null;
  hasWriteup: boolean;
  hours: number;
};

export const BOARD_LANES: { id: BoardLane; label: string; color: string }[] = [
  { id: "backlog", label: "BACKLOG", color: "#8a8a93" },
  { id: "solving", label: "SOLVING", color: "#7c5cff" },
  { id: "solved", label: "SOLVED", color: "#ccff3d" },
  { id: "revision-1", label: "REVISION 1", color: "#ededf0" },
  { id: "revision-2", label: "REVISION 2", color: "#5c9dff" },
  { id: "revision-3", label: "REVISION 3", color: "#ffa116" },
];

export const BOARD_TRACKS: BoardTrack[] = [
  "DSA",
  "SYSTEM DESIGN",
  "LOW-LEVEL DESIGN",
  "JS / TS",
];

function hashSlug(slug: string) {
  let h = 0;
  for (let i = 0; i < slug.length; i += 1) h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  return h;
}

function titleCasePattern(raw: string) {
  return raw
    .replace(/intervel/gi, "Interval")
    .replace(/dns/gi, "DNA")
    .split(/[\s/_-]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

/** Derive pattern from slug / topic — automated, no manual links. */
export function derivePattern(ticket: Pick<Ticket, "slug" | "topic">, writeup?: Writeup | null) {
  if (writeup?.pattern) return titleCasePattern(writeup.pattern);
  const s = ticket.slug.toLowerCase();
  const map: [RegExp, string][] = [
    [/sliding-window/, "Sliding Window"],
    [/binary-search/, "Binary Search"],
    [/backtracking/, "Backtracking"],
    [/dynamic-programming/, "Dynamic Programming"],
    [/two-heap|two_heap/, "Two Heap"],
    [/top-k/, "Top K Elements"],
    [/k-way-merge/, "K Way Merge"],
    [/merge-intervel|merge-interval/, "Merge Interval"],
    [/fast-and-slow/, "Fast And Slow Pointer"],
    [/in-place-reversal/, "In Place Reversal LinkedList"],
    [/subsets/, "Subsets"],
    [/greedy/, "Greedy Technique"],
    [/^js-/, "JS Engine"],
  ];
  for (const [re, label] of map) {
    if (re.test(s)) return label;
  }
  return titleCasePattern(ticket.topic || "Algorithms");
}

export function deriveTrack(ticket: Pick<Ticket, "slug" | "topic">, writeup?: Writeup | null): BoardTrack {
  if (writeup?.track) {
    const t = writeup.track.toUpperCase();
    if (t.includes("SYSTEM")) return "SYSTEM DESIGN";
    if (t.includes("LOW") || t.includes("LLD")) return "LOW-LEVEL DESIGN";
    if (t.includes("JS") || t.includes("TS")) return "JS / TS";
    return "DSA";
  }
  const blob = `${ticket.slug} ${ticket.topic}`.toLowerCase();
  if (blob.includes("system")) return "SYSTEM DESIGN";
  if (blob.includes("low-level") || blob.includes("lld")) return "LOW-LEVEL DESIGN";
  if (blob.startsWith("js-") || blob.includes("javascript") || blob.includes("typescript")) {
    return "JS / TS";
  }
  return "DSA";
}

function deriveLane(ticket: Ticket): BoardLane {
  if (ticket.column === "backlog") return "backlog";
  if (ticket.column === "in-progress") return "solving";
  // Solved tickets fan into solved + revision lanes (stable per slug).
  const bucket = hashSlug(ticket.slug) % 10;
  if (bucket < 4) return "solved";
  if (bucket < 7) return "revision-1";
  if (bucket < 9) return "revision-2";
  return "revision-3";
}

const writeupBySlug = new Map(WRITEUPS.map((w) => [w.slug, w]));

/** Full automated card index from tickets + writeups. */
export function buildBoardCards(): BoardCard[] {
  const fromTickets = TICKETS.map((t) => {
    const w = writeupBySlug.get(t.slug) ?? null;
    return {
      slug: t.slug,
      id: (w?.id ?? t.id).toUpperCase(),
      title: w?.title ?? t.title,
      difficulty: w?.difficulty ?? t.difficulty,
      track: deriveTrack(t, w),
      pattern: derivePattern(t, w),
      lane: deriveLane(t),
      status: w?.status ?? t.status,
      practiceUrl: w?.practiceUrl ?? null,
      hasWriteup: Boolean(w),
      hours: t.hours,
    } satisfies BoardCard;
  });

  // Include orphan writeups not in tickets
  const ticketSlugs = new Set(TICKETS.map((t) => t.slug));
  const orphans = WRITEUPS.filter((w) => !ticketSlugs.has(w.slug)).map((w) => ({
    slug: w.slug,
    id: w.id.toUpperCase(),
    title: w.title,
    difficulty: w.difficulty,
    track: deriveTrack({ slug: w.slug, topic: w.pattern }, w),
    pattern: derivePattern({ slug: w.slug, topic: w.pattern }, w),
    lane: "solved" as BoardLane,
    status: w.status,
    practiceUrl: w.practiceUrl,
    hasWriteup: true,
    hours: 0,
  }));

  return [...fromTickets, ...orphans];
}

export function getCardsByTrack(cards: BoardCard[], track: BoardTrack | "ALL") {
  if (track === "ALL") return cards;
  return cards.filter((c) => c.track === track);
}

export function getPatterns(cards: BoardCard[]) {
  const map = new Map<string, { pattern: string; total: number; done: number }>();
  for (const c of cards) {
    const cur = map.get(c.pattern) ?? { pattern: c.pattern, total: 0, done: 0 };
    cur.total += 1;
    if (c.lane !== "backlog" && c.lane !== "solving") cur.done += 1;
    map.set(c.pattern, cur);
  }
  return [...map.values()].sort((a, b) => b.total - a.total || a.pattern.localeCompare(b.pattern));
}

export function getSamePattern(slug: string, limit = 12): BoardCard[] {
  const cards = buildBoardCards();
  const self = cards.find((c) => c.slug === slug);
  if (!self) return [];
  return cards.filter((c) => c.pattern === self.pattern).slice(0, limit);
}

export function getTrackStats(cards: BoardCard[]) {
  return BOARD_TRACKS.map((track) => {
    const list = cards.filter((c) => c.track === track);
    const done = list.filter((c) => c.lane !== "backlog" && c.lane !== "solving").length;
    const total = list.length;
    const pct = total ? Math.round((done / total) * 100) : 0;
    return { track, done, total, pct };
  });
}

export function getSprintMeta(cards: BoardCard[]) {
  const closed = cards.filter((c) => c.lane !== "backlog" && c.lane !== "solving").length;
  const writeups = cards.filter((c) => c.hasWriteup).length;
  const hours = Math.round(cards.reduce((n, c) => n + c.hours, 0));
  return { closed, writeups, hours, sprint: 34 };
}
