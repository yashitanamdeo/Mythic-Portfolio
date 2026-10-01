"use client";

import { BootSequence } from "./BootSequence";
import { CommandPalette } from "./CommandPalette";
import { CustomCursor, Grain } from "./CustomCursor";
import { Nav } from "./Nav";
import { ScanLine, ScrollProgress } from "./motion/PageMotion";
import { ShellProvider } from "./ShellProvider";
import { StatusBar } from "./StatusBar";
import { Terminal } from "./Terminal";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <ShellProvider>
      <Grain />
      <CustomCursor />
      <ScanLine />
      <ScrollProgress />
      <BootSequence />
      <Nav />
      <CommandPalette />
      <Terminal />
      <StatusBar />
      <main className="relative z-[1]">{children}</main>
    </ShellProvider>
  );
}
