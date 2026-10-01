import writeupsJson from "./writeups.json";

export type Writeup = {
  slug: string;
  id: string;
  title: string;
  tldr: string;
  difficulty: string;
  practiceUrl: string | null;
  status: string;
  date: string;
  track: string;
  pattern: string;
  writeupHtml: string;
};

export const WRITEUPS = writeupsJson as Writeup[];

export function getWriteup(slug: string) {
  return WRITEUPS.find((w) => w.slug === slug);
}
