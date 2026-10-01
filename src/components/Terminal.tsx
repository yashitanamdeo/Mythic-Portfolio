"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { useContent } from "@/content/ContentProvider";
import { useShell } from "./ShellProvider";

type Line = { html?: string; text?: string; className?: string };

function help(): Line[] {
  return [
    { text: "available commands:", className: "text-accent" },
    { text: "  whoami     — identity dump", className: "text-muted" },
    { text: "  about      — short bio", className: "text-muted" },
    { text: "  stack      — tech stack", className: "text-muted" },
    { text: "  projects   — list case files", className: "text-muted" },
    { text: "  contact    — channels", className: "text-muted" },
    { text: "  clear      — clear screen", className: "text-muted" },
    { text: "  exit       — close terminal", className: "text-muted" },
  ];
}

export function Terminal() {
  const content = useContent();
  const { identity, about, skills, projects, hero } = content;
  const { terminalOpen, setTerminalOpen } = useShell();
  const welcome = useMemo<Line[]>(
    () => [
      {
        html: `<span class="text-text">${identity.id}.js</span><span class="text-faint"> — interactive shell [${identity.version}]</span>`,
      },
      {
        text: hero.tagline,
        className: "text-faint",
      },
      { text: "type help for commands.", className: "text-muted" },
    ],
    [identity.id, identity.version, hero.tagline],
  );
  const [lines, setLines] = useState<Line[]>(welcome);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!terminalOpen) return;
    setLines(welcome);
    setInput("");
    const t = window.setTimeout(() => inputRef.current?.focus(), 50);
    return () => clearTimeout(t);
  }, [terminalOpen, welcome]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "nearest" });
  }, [lines]);

  if (!terminalOpen) return null;

  const push = (...next: Line[]) => setLines((prev) => [...prev, ...next]);

  const run = (raw: string) => {
    const cmd = raw.trim().toLowerCase();
    push({ html: `<span class="text-accent">❯</span> <span class="text-text">${raw}</span>` });
    if (!cmd) return;

    switch (cmd) {
      case "help":
      case "?":
        push(...help());
        break;
      case "whoami":
        push(
          { text: identity.fullName, className: "text-accent" },
          {
            text: `${identity.title} · ${identity.location}`,
            className: "text-muted",
          },
          { text: "status: OPEN FOR SELECT OPERATIONS", className: "text-faint" },
        );
        break;
      case "about":
        push({
          text: about.body.slice(0, 220) + (about.body.length > 220 ? "…" : ""),
          className: "text-muted",
        });
        break;
      case "stack":
        push({
          text: skills.groups
            .flatMap((g) => g.items)
            .filter((i) => i !== "//" && i !== "0x" && i !== "::")
            .slice(0, 14)
            .join(" · "),
          className: "text-muted",
        });
        break;
      case "projects":
      case "ls":
        push(
          ...projects.items.map((p) => ({
            text: `${p.num}  ${p.title}`,
            className: "text-muted",
          })),
        );
        break;
      case "contact":
        push(
          { text: identity.email, className: "text-accent" },
          { text: identity.github, className: "text-muted" },
          { text: identity.linkedin, className: "text-muted" },
        );
        break;
      case "clear":
        setLines([]);
        break;
      case "exit":
      case "q":
        setTerminalOpen(false);
        break;
      default:
        push({
          text: `command not found: ${cmd}. try help.`,
          className: "text-accent3",
        });
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const value = input;
    setInput("");
    run(value);
  };

  return (
    <div className="fixed inset-0 z-[850] flex items-end justify-center bg-black/55 p-3 backdrop-blur-[2px] md:items-center md:p-6">
      <div className="flex h-[min(440px,70vh)] w-full max-w-[620px] flex-col overflow-hidden border border-white/10 bg-[#0e0e12] shadow-2xl">
        <div className="flex items-center gap-2 border-b border-white/[0.06] px-3 py-2.5">
          <button
            type="button"
            aria-label="Close terminal"
            data-cursor="hover"
            onClick={() => setTerminalOpen(false)}
            className="h-3 w-3 rounded-full bg-[#ff5f57]/90"
          />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]/90" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]/90" />
          <p className="ml-2 font-mono text-[.62rem] tracking-[.14em] text-faint">
            {identity.id}.js — shell
          </p>
        </div>

        <div className="flex-1 space-y-1 overflow-y-auto px-3 py-3 font-mono text-[.78rem] leading-[1.7]">
          {lines.map((line, i) =>
            line.html ? (
              <p key={i} className={line.className} dangerouslySetInnerHTML={{ __html: line.html }} />
            ) : (
              <p key={i} className={line.className}>
                {line.text}
              </p>
            ),
          )}
          <div ref={endRef} />
        </div>

        <form
          onSubmit={onSubmit}
          className="flex items-center gap-2 border-t border-white/[0.06] px-3 py-2.5"
        >
          <span className="font-mono text-accent">❯</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            aria-label="Terminal command input"
            className="w-full bg-transparent font-mono text-[.8rem] text-text outline-none caret-accent"
            autoComplete="off"
            spellCheck={false}
          />
        </form>
      </div>
    </div>
  );
}
