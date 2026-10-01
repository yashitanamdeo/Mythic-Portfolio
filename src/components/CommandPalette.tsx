"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useContent } from "@/content/ContentProvider";
import { useShell } from "./ShellProvider";

type CmdKind = "go" | "run";

type Command = {
  id: string;
  kind: CmdKind;
  label: string;
  hint?: string;
  run: () => void;
};

export function CommandPalette() {
  const content = useContent();
  const { paletteOpen, setPaletteOpen, setTerminalOpen, setBooted } = useShell();
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const commands = useMemo<Command[]>(() => {
    const sections: { label: string; href: string; idx: string }[] = [
      { label: "Intro", href: "#hero", idx: "00" },
      { label: "About", href: "#about", idx: "01" },
      { label: "Capabilities", href: "#capabilities", idx: "02" },
      { label: "Experience", href: "#work", idx: "03" },
      { label: "Selected Work", href: "#projects", idx: "04" },
      { label: "Skills", href: "#skills", idx: "05" },
      { label: "Upskilling", href: "#upskilling", idx: "06" },
      { label: "Contact", href: "#contact", idx: "07" },
    ];

    const go: Command[] = sections.map((s) => ({
      id: `go-${s.idx}`,
      kind: "go",
      label: s.label,
      hint: s.idx,
      run: () => {
        document.querySelector(s.href)?.scrollIntoView({ behavior: "smooth" });
      },
    }));

    const { identity } = content;
    const run: Command[] = [
      {
        id: "copy-email",
        kind: "run",
        label: "Copy email",
        hint: identity.email,
        run: () => void navigator.clipboard.writeText(identity.email),
      },
      {
        id: "terminal",
        kind: "run",
        label: "Open terminal",
        hint: "tty0",
        run: () => setTerminalOpen(true),
      },
      {
        id: "reboot",
        kind: "run",
        label: "Replay boot sequence",
        hint: "reload",
        run: () => {
          window.sessionStorage.removeItem("mythic:booted");
          setBooted(false);
        },
      },
      {
        id: "board",
        kind: "run",
        label: "Upskilling board",
        hint: "↗ /upskilling",
        run: () => router.push("/upskilling"),
      },
      {
        id: "github",
        kind: "run",
        label: "GitHub",
        hint: "↗ github",
        run: () => window.open(identity.github, "_blank"),
      },
      {
        id: "linkedin",
        kind: "run",
        label: "LinkedIn",
        hint: "↗ linkedin",
        run: () => window.open(identity.linkedin, "_blank"),
      },
      {
        id: "resume",
        kind: "run",
        label: "Résumé",
        hint: "↗ pdf",
        run: () => window.open(identity.resume, "_blank"),
      },
    ];

    return [...go, ...run];
  }, [content, router, setBooted, setTerminalOpen]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.hint?.toLowerCase().includes(q) ||
        c.kind.includes(q),
    );
  }, [commands, query]);

  useEffect(() => {
    if (!paletteOpen) {
      setQuery("");
      setIndex(0);
      return;
    }
    const t = window.setTimeout(() => inputRef.current?.focus(), 30);
    return () => clearTimeout(t);
  }, [paletteOpen]);

  useEffect(() => {
    setIndex(0);
  }, [query]);

  if (!paletteOpen) return null;

  const run = (cmd: Command) => {
    setPaletteOpen(false);
    cmd.run();
  };

  return (
    <div
      className="fixed inset-0 z-[900] flex items-start justify-center bg-black/55 px-4 pt-[12vh] backdrop-blur-[3px]"
      onClick={() => setPaletteOpen(false)}
    >
      <div
        role="dialog"
        aria-label="Command palette"
        className="w-full max-w-[540px] overflow-hidden border border-white/10 bg-[#0c0c10]/92 shadow-[0_40px_120px_-24px_rgba(0,0,0,.9),0_0_60px_-28px_rgba(204,255,61,.15)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-white/[0.06] px-4 py-3.5">
          <span className="font-mono text-[.85rem] text-accent">&gt;</span>
          <input
            ref={inputRef}
            role="combobox"
            aria-expanded
            aria-controls="cmd-list"
            aria-label="Type a command"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setIndex((i) => Math.min(filtered.length - 1, i + 1));
              }
              if (e.key === "ArrowUp") {
                e.preventDefault();
                setIndex((i) => Math.max(0, i - 1));
              }
              if (e.key === "Enter" && filtered[index]) {
                e.preventDefault();
                run(filtered[index]);
              }
              if (e.key === "Escape") {
                e.preventDefault();
                setPaletteOpen(false);
              }
            }}
            placeholder="type a command…"
            className="w-full bg-transparent font-mono text-[.88rem] text-text outline-none placeholder:text-faint"
          />
          <kbd className="shrink-0 border border-white/10 px-1.5 py-0.5 font-mono text-[.55rem] tracking-[.14em] text-faint">
            ESC
          </kbd>
        </div>

        <div
          id="cmd-list"
          role="listbox"
          aria-label="Commands"
          className="max-h-[min(420px,55vh)] overflow-y-auto py-1.5"
        >
          {filtered.length === 0 && (
            <p className="px-4 py-6 font-mono text-[.72rem] text-faint">No matching commands.</p>
          )}
          {filtered.map((cmd, i) => {
            const active = i === index;
            return (
              <button
                key={cmd.id}
                type="button"
                role="option"
                aria-selected={active}
                data-cursor="hover"
                onMouseEnter={() => setIndex(i)}
                onClick={() => run(cmd)}
                className={`relative flex w-full items-center gap-3 px-3 py-2 text-left ${
                  active ? "bg-accent/[0.07]" : "hover:bg-white/[0.03]"
                }`}
              >
                {active && (
                  <span className="absolute left-0 top-1/2 h-7 w-[2px] -translate-y-1/2 bg-accent" aria-hidden />
                )}
                <span
                  className={`relative shrink-0 px-1.5 py-0.5 font-mono text-[.55rem] font-bold uppercase tracking-[.12em] ${
                    cmd.kind === "go"
                      ? active
                        ? "bg-accent text-bg"
                        : "bg-accent/90 text-bg"
                      : "bg-[#7c5cff]/85 text-white"
                  }`}
                >
                  {cmd.kind === "go" ? "GO" : "RUN"}
                </span>
                <span
                  className={`flex-1 font-mono text-[.8rem] ${
                    active ? "text-text" : "text-muted"
                  }`}
                >
                  {cmd.label}
                </span>
                {cmd.hint && (
                  <span className="shrink-0 font-mono text-[.58rem] tabular-nums tracking-[.08em] text-faint">
                    {cmd.hint}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between border-t border-white/[0.06] px-4 py-2.5 font-mono text-[.55rem] uppercase tracking-[.14em] text-faint">
          <span>
            ↑↓ navigate <span className="mx-2 text-white/20">·</span> ↵ run
          </span>
          <span>
            {filtered.length}/{commands.length} cmds
          </span>
        </div>
      </div>
    </div>
  );
}
