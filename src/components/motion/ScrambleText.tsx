"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { scrambleTo } from "@/lib/scramble";

type Props = {
  text: string;
  className?: string;
  style?: CSSProperties;
  /** Scramble on pointer enter */
  hover?: boolean;
  /** Scramble when element enters viewport */
  reveal?: boolean;
  /** Scramble when clicked */
  click?: boolean;
  as?: "span" | "div" | "p" | "h1" | "h2" | "h3";
  durationMs?: number;
};

export function ScrambleText({
  text,
  className,
  style,
  hover = false,
  reveal = false,
  click = false,
  as: Tag = "span",
  durationMs = 480,
}: Props) {
  const [value, setValue] = useState(text);
  const stopRef = useRef<(() => void) | null>(null);
  const ref = useRef<HTMLElement | null>(null);
  const doneReveal = useRef(false);

  const run = () => {
    stopRef.current?.();
    stopRef.current = scrambleTo(text, setValue, durationMs);
  };

  useEffect(() => {
    setValue(text);
  }, [text]);

  useEffect(() => () => stopRef.current?.(), []);

  useEffect(() => {
    if (!reveal || !ref.current) return;
    const el = ref.current;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !doneReveal.current) {
          doneReveal.current = true;
          run();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reveal, text]);

  return (
    <Tag
      ref={ref as never}
      className={className}
      style={style}
      onPointerEnter={hover ? run : undefined}
      onClick={click ? run : undefined}
    >
      {value}
    </Tag>
  );
}
