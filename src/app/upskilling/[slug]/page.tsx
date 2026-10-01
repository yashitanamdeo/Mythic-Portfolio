import Link from "next/link";
import { notFound } from "next/navigation";
import { getSiteContent } from "@/content/loadSite";
import { getTicket, TICKETS } from "@/data/tickets";
import { getWriteup, WRITEUPS } from "@/data/writeups";
import { buildBoardCards, getSamePattern } from "@/lib/board";
import { CopySnippet } from "@/components/CopySnippet";

function extractSnippet(html: string | undefined, fallback: string) {
  if (!html) return fallback;
  const pre = html.match(/<pre[^>]*>([\s\S]*?)<\/pre>/i);
  if (!pre?.[1]) return fallback;
  return pre[1]
    .replace(/<[^>]+>/g, "")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .trim()
    .slice(0, 2400);
}

export function generateStaticParams() {
  const slugs = new Set([
    ...TICKETS.map((t) => t.slug),
    ...WRITEUPS.map((w) => w.slug),
  ]);
  return [...slugs].map((slug) => ({ slug }));
}

export default async function TicketPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const site = getSiteContent();
  const writeup = getWriteup(slug);
  const ticket = getTicket(slug);
  if (!writeup && !ticket) notFound();

  const cards = buildBoardCards();
  const self = cards.find((c) => c.slug === slug);
  const title = writeup?.title ?? ticket!.title;
  const difficulty = writeup?.difficulty ?? ticket!.difficulty;
  const pattern = self?.pattern ?? writeup?.pattern ?? ticket!.topic;
  const track = self?.track ?? writeup?.track ?? "DSA";
  const status = writeup?.status ?? ticket!.status;
  const id = (writeup?.id ?? ticket!.id).toUpperCase();
  const tldr = writeup?.tldr ?? `${title} — pattern notes`;
  const practiceUrl = writeup?.practiceUrl ?? null;
  const samePattern = getSamePattern(slug, 14);
  const snippet = extractSnippet(writeup?.writeupHtml, tldr);

  return (
    <div className="min-h-screen cursor-auto bg-bg font-body text-text">
      <div className="pad-x flex items-center justify-between py-5">
        <Link
          href="/"
          data-cursor="hover"
          className="inline-flex items-center font-mono text-[.85rem] font-medium tracking-[.01em] text-muted hover:text-accent"
        >
          <span className="text-accent">~/</span>
          {site.identity.handle}
        </Link>
        <Link
          href="/upskilling"
          data-cursor="hover"
          className="font-mono text-[10.5px] uppercase tracking-[.16em] text-faint hover:text-accent"
        >
          Upskilling
        </Link>
      </div>

      <main className="pad-x pb-24 pt-2">
        <div className="flex flex-wrap items-center gap-3.5 border-b border-line pb-[1.125rem] font-mono text-[10.5px] uppercase tracking-[.16em] text-muted">
          <Link href="/upskilling" data-cursor="hover" className="transition-colors duration-300 hover:text-accent">
            ← board
          </Link>
          <span className="text-[#3a3a42]">/</span>
          <span>{track}</span>
          <span className="text-[#3a3a42]">/</span>
          <span>{pattern}</span>
          <span className="text-[#3a3a42]">/</span>
          <span className="text-accent">{id}</span>
        </div>

        <div className="mt-11 grid grid-cols-1 gap-14 lg:grid-cols-[minmax(0,1fr)_300px]">
          <article>
            <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[.18em]">
              <i aria-hidden className="inline-block h-2 w-2 rotate-45 bg-[#5c9dff]" />
              <span className="text-[#5c9dff]">{status}</span>
              {writeup?.date ? (
                <>
                  <span className="text-[#3a3a42]">·</span>
                  <span className="text-faint">{writeup.date}</span>
                </>
              ) : null}
            </div>

            <h1 className="mt-[1.125rem] text-balance font-display text-[clamp(1.9rem,5vw,3.6rem)] font-bold leading-[1] tracking-[-.03em]">
              {title}
            </h1>

            <div className="mt-8 grid grid-cols-1 gap-px bg-line sm:grid-cols-2">
              <MetaCell
                label="Difficulty"
                value={difficulty}
                valueClass={
                  String(difficulty).toLowerCase() === "hard"
                    ? "text-accent3"
                    : String(difficulty).toLowerCase() === "easy"
                      ? "text-accent"
                      : "text-[#ededf0]"
                }
              />
              <MetaCell label="Pattern" value={pattern} />
              <MetaCell label="Track" value={track} valueClass="text-accent" />
              <div className="flex flex-col justify-between gap-1.5 bg-bg-soft p-5">
                <span className="font-mono text-[9.5px] uppercase tracking-[.18em] text-[#6e6e78]">
                  Practice
                </span>
                {practiceUrl ? (
                  <a
                    href={practiceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="hover"
                    className="group inline-flex items-center gap-2 font-display text-[15px] font-medium text-[#ededf0] transition-colors duration-300 hover:text-[#ffa116]"
                  >
                    <LeetCodeIcon />
                    <span>Solve on LeetCode</span>
                    <span
                      aria-hidden
                      className="font-mono text-xs text-[#6e6e78] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#ffa116]"
                    >
                      ↗
                    </span>
                  </a>
                ) : (
                  <span className="font-display text-[15px] text-faint">No practice link</span>
                )}
              </div>
              <div className="flex flex-col justify-between gap-1.5 bg-bg-soft p-5 sm:col-span-2">
                <span className="font-mono text-[9.5px] uppercase tracking-[.18em] text-[#6e6e78]">
                  Snippet
                </span>
                <CopySnippet snippet={snippet} />
              </div>
            </div>

            <div className="mt-11 border-t border-line pt-5">
              <span className="font-mono text-[9.5px] uppercase tracking-[.2em] text-accent">
                tl;dr
              </span>
              <p className="mt-3.5 text-pretty pb-10 font-display text-[clamp(1.05rem,1.8vw,1.35rem)] leading-[1.45] tracking-[-.01em] text-text">
                {tldr}
              </p>
            </div>

            <div className="mt-13 border-t border-line pt-5">
              <span className="font-mono text-[9.5px] uppercase tracking-[.2em] text-muted">
                full write-up
              </span>
              {writeup?.writeupHtml ? (
                <div
                  className="writeup-body [&_h2]:mt-9 [&_h2]:font-display [&_h2]:text-[clamp(1.25rem,2.2vw,1.7rem)] [&_h2]:font-semibold [&_h2]:tracking-[-.02em] [&_h2]:text-text [&_h3]:mt-7 [&_h3]:font-display [&_h3]:text-[1.1rem] [&_h3]:font-semibold [&_h3]:tracking-[-.01em] [&_h3]:text-text [&_p]:mt-3.5 [&_p]:text-[16px] [&_p]:leading-[1.7] [&_p]:text-muted [&_pre]:mt-5 [&_pre]:overflow-x-auto [&_pre]:border [&_pre]:border-line [&_pre]:bg-bg-soft [&_pre]:px-5 [&_pre]:py-[1.125rem] [&_pre]:font-mono [&_pre]:text-[13px] [&_pre]:leading-[1.65] [&_pre]:text-[#d6d6de] [&_code]:font-mono [&_code]:text-[13px] [&_ol]:mt-3.5 [&_ol]:list-decimal [&_ol]:space-y-1.5 [&_ol]:pl-5 [&_ol]:text-muted [&_ul]:mt-3.5 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5 [&_ul]:text-muted [&_strong]:font-semibold [&_strong]:text-text"
                  dangerouslySetInnerHTML={{ __html: writeup.writeupHtml }}
                />
              ) : (
                <p className="mt-9 text-[16px] leading-[1.7] text-muted">
                  Write-up content isn’t available for this slug yet. Pattern: {pattern}. Open the
                  board to continue related tickets in this track.
                </p>
              )}
            </div>
          </article>

          <aside className="flex flex-col gap-9 lg:sticky lg:top-6 lg:self-start">
            {samePattern.length > 0 && (
              <div>
                <span className="font-mono text-[9.5px] uppercase tracking-[.2em] text-[#6e6e78]">
                  same pattern
                </span>
                <div className="mt-3.5 flex flex-col">
                  {samePattern.map((w) => {
                    const active = w.slug === slug;
                    return (
                      <Link
                        key={w.slug}
                        href={`/upskilling/${w.slug}`}
                        data-cursor="hover"
                        className={`flex items-baseline gap-2.5 border-t border-line py-2.5 transition-opacity duration-300 ${
                          active ? "opacity-100" : "hover:opacity-65"
                        }`}
                      >
                        <i
                          aria-hidden
                          className={`mt-1 inline-block h-1.5 w-1.5 shrink-0 translate-y-0.5 rotate-45 ${
                            active ? "bg-accent" : "bg-[#5c9dff]"
                          }`}
                        />
                        <span
                          className={`shrink-0 font-mono text-[9.5px] tracking-[.1em] ${
                            active ? "text-accent" : "text-[#6e6e78]"
                          }`}
                        >
                          {w.id}
                        </span>
                        <span
                          className={`font-body text-[13.5px] leading-[1.35] ${
                            active ? "text-accent" : "text-[#a6a6ae]"
                          }`}
                        >
                          {w.title}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            <div>
              <span className="font-mono text-[9.5px] uppercase tracking-[.2em] text-[#6e6e78]">
                how it indexes
              </span>
              <div className="mt-3.5 border border-line bg-bg-soft p-4">
                <p className="break-all font-body text-[11.5px] text-muted">
                  /upskilling/{slug}
                </p>
                <p className="mt-2 font-body text-[15px] leading-[1.3] text-accent">
                  {title} — pattern notes
                </p>
                <p className="mt-2 font-body text-[12.5px] leading-[1.5] text-muted">{tldr}</p>
              </div>
              <p className="mt-4 font-mono text-[9px] uppercase tracking-[.16em] text-faint">
                static route · og image · tech article
              </p>
              <p className="mt-1 font-mono text-[9px] uppercase tracking-[.16em] text-faint">
                jsonld · in sitemap
              </p>
            </div>
          </aside>
        </div>
      </main>

      <footer className="pad-x flex flex-wrap items-center justify-between gap-4 border-t border-line py-7">
        <Link
          href="/#upskilling"
          data-cursor="hover"
          className="font-mono text-[10.5px] uppercase tracking-[.16em] text-faint transition-colors duration-300 hover:text-accent"
        >
          ← back to portfolio
        </Link>
        <Link
          href="/upskilling"
          data-cursor="hover"
          className="font-mono text-[10.5px] uppercase tracking-[.16em] text-accent"
        >
          open board →
        </Link>
      </footer>
    </div>
  );
}

function MetaCell({
  label,
  value,
  valueClass = "text-[#ededf0]",
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5 bg-bg-soft p-5">
      <span className="font-mono text-[9.5px] uppercase tracking-[.18em] text-[#6e6e78]">
        {label}
      </span>
      <span className={`font-display text-[16px] font-medium ${valueClass}`}>{value}</span>
    </div>
  );
}

function LeetCodeIcon() {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-4 w-4 shrink-0 text-[#ffa116] transition-transform duration-300 group-hover:scale-110"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z" />
    </svg>
  );
}
