"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { SiteContent } from "@/content/types";

const ContentContext = createContext<SiteContent | null>(null);

export function ContentProvider({
  content,
  children,
}: {
  content: SiteContent;
  children: ReactNode;
}) {
  return <ContentContext.Provider value={content}>{children}</ContentContext.Provider>;
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error("useContent must be used within ContentProvider");
  return ctx;
}
