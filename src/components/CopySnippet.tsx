"use client";

import { useRef, useState } from "react";

export function CopySnippet({ snippet }: { snippet: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | null>(null);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(snippet);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = snippet;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
      } catch {
        /* noop */
      }
      ta.remove();
    }
    setCopied(true);
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 1700);
  };

  return (
    <button
      type="button"
      onClick={onCopy}
      data-cursor="hover"
      aria-label="Copy quick snippet to clipboard"
      className={`w-fit border px-3.5 py-2 font-mono text-[10px] uppercase tracking-[.16em] transition-colors ${
        copied
          ? "border-[#ccff3d]/50 bg-[#ccff3d]/10 text-[#ccff3d]"
          : "border-line bg-bg-soft text-muted hover:border-[#ccff3d]/40 hover:text-[#ccff3d]"
      }`}
    >
      {copied ? "copied ✓" : "copy snippet"}
    </button>
  );
}
