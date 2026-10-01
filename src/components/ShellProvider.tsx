"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type ShellContextValue = {
  booted: boolean;
  setBooted: (v: boolean) => void;
  paletteOpen: boolean;
  setPaletteOpen: (v: boolean) => void;
  terminalOpen: boolean;
  setTerminalOpen: (v: boolean) => void;
  menuOpen: boolean;
  setMenuOpen: (v: boolean) => void;
  activeSection: string;
  setActiveSection: (id: string) => void;
  scrollProgress: number;
  istClock: string;
};

const ShellContext = createContext<ShellContextValue | null>(null);

function formatIST(date = new Date()) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(date);
}

export function ShellProvider({ children }: { children: ReactNode }) {
  const [booted, setBootedState] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [istClock, setIstClock] = useState("--:--:--");

  const setBooted = useCallback((v: boolean) => {
    setBootedState(v);
    if (!v && typeof window !== "undefined") {
      try {
        window.sessionStorage.removeItem("mythic:booted");
      } catch {
        /* ignore */
      }
    }
  }, []);

  useEffect(() => {
    setIstClock(formatIST());
    const id = window.setInterval(() => setIstClock(formatIST()), 1000);
    return () => window.clearInterval(id);
  }, []);

  // Smooth scroll progress via rAF lerp (CSS var for bar; throttled React state for HUD).
  useEffect(() => {
    let target = 0;
    let current = 0;
    let raf = 0;
    let lastSection = "hero";
    let lastPublished = -1;

    const measure = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      target = max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0;

      const ids = ["hero", "about", "capabilities", "work", "projects", "skills", "upskilling", "contact"];
      let next = "hero";
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= window.innerHeight * 0.35) next = id;
      }
      if (next !== lastSection) {
        lastSection = next;
        setActiveSection(next);
      }
    };

    const tick = () => {
      current += (target - current) * 0.16;
      if (Math.abs(target - current) < 0.04) current = target;
      document.documentElement.style.setProperty("--scroll-progress", `${current}%`);
      // Publish to React ~12fps for status HUD — keeps motion smooth without thrashing.
      if (Math.abs(current - lastPublished) >= 0.8) {
        lastPublished = current;
        setScrollProgress(current);
      }
      raf = requestAnimationFrame(tick);
    };

    measure();
    raf = requestAnimationFrame(tick);
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("palette-open", paletteOpen);
    document.documentElement.classList.toggle("terminal-open", terminalOpen);
  }, [paletteOpen, terminalOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const meta = e.metaKey || e.ctrlKey;
      if (meta && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
        setTerminalOpen(false);
        setMenuOpen(false);
      }
      if (e.key === "Escape") {
        setPaletteOpen(false);
        setTerminalOpen(false);
        setMenuOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const value = useMemo(
    () => ({
      booted,
      setBooted,
      paletteOpen,
      setPaletteOpen,
      terminalOpen,
      setTerminalOpen,
      menuOpen,
      setMenuOpen,
      activeSection,
      setActiveSection,
      scrollProgress,
      istClock,
    }),
    [
      booted,
      setBooted,
      paletteOpen,
      terminalOpen,
      menuOpen,
      activeSection,
      scrollProgress,
      istClock,
    ],
  );

  return <ShellContext.Provider value={value}>{children}</ShellContext.Provider>;
}

export function useShell() {
  const ctx = useContext(ShellContext);
  if (!ctx) throw new Error("useShell must be used within ShellProvider");
  return ctx;
}
