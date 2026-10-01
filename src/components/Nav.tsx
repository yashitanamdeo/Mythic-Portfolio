"use client";

import Link from "next/link";
import { useContent } from "@/content/ContentProvider";
import { ScrambleText } from "@/components/motion/ScrambleText";
import { useShell } from "./ShellProvider";

export function Nav() {
  const content = useContent();
  const { booted, menuOpen, setMenuOpen, setPaletteOpen, activeSection } = useShell();

  if (!booted) return null;

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[800] pad-x">
        <div className="flex h-14 items-center justify-between md:h-16">
          <Link
            href="/#hero"
            data-cursor="hover"
            aria-label={`${content.identity.handle} — back to top`}
            className="inline-flex items-center gap-0.5 font-mono text-[.85rem] tracking-[.08em] text-text"
          >
            <span className="text-accent">~/</span>
            <ScrambleText text={content.identity.handle} hover durationMs={360} />
            <span
              className="ml-1 inline-block h-[0.95em] w-[0.55em] animate-blink bg-accent align-[-0.05em]"
              aria-hidden
            />
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
            {content.nav.map((link) => {
              const id = link.href.replace("#", "");
              const active =
                activeSection === id || (id === "about" && activeSection === "capabilities");
              return (
                <a
                  key={link.href}
                  href={link.href}
                  data-cursor="hover"
                  className={`px-2.5 py-1.5 font-mono text-[.62rem] uppercase tracking-[.18em] transition-colors duration-300 ${
                    active
                      ? "bg-accent text-bg"
                      : "text-muted hover:bg-accent hover:text-bg"
                  }`}
                >
                  <ScrambleText text={link.label} hover durationMs={320} />
                </a>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              data-cursor="hover"
              aria-label="Open command palette"
              onClick={() => setPaletteOpen(true)}
              className="hidden items-center gap-1 border border-white/15 px-2 py-1.5 font-mono text-[.58rem] tracking-[.12em] text-muted hover:border-accent/50 hover:text-accent md:inline-flex"
            >
              ⌘K
            </button>
            <button
              type="button"
              data-cursor="hover"
              aria-label="Open menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex h-11 w-11 items-center justify-center md:hidden"
            >
              <span className="flex w-5 flex-col gap-1.5">
                <span
                  className={`h-px bg-text transition-transform duration-300 ${
                    menuOpen ? "translate-y-[3.5px] rotate-45" : ""
                  }`}
                />
                <span
                  className={`h-px bg-text transition-transform duration-300 ${
                    menuOpen ? "-translate-y-[3.5px] -rotate-45" : ""
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-[790] bg-bg/95 pt-20 backdrop-blur-md md:hidden">
          <nav className="pad-x flex flex-col gap-1">
            {content.nav.map((link, i) => (
              <a
                key={link.href}
                href={link.href}
                data-cursor="hover"
                onClick={() => setMenuOpen(false)}
                className="border-b border-white/[0.06] py-5 font-display text-[1.6rem] tracking-[-0.02em] text-text"
              >
                <span className="mr-3 font-mono text-[.7rem] text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {link.label}
              </a>
            ))}
            <button
              type="button"
              data-cursor="hover"
              onClick={() => {
                setMenuOpen(false);
                setPaletteOpen(true);
              }}
              className="mt-6 border border-accent/50 px-4 py-3 text-left font-mono text-[.72rem] uppercase tracking-[.18em] text-accent"
            >
              Open command palette · ⌘K
            </button>
          </nav>
        </div>
      )}
    </>
  );
}
