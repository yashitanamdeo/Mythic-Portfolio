export type SiteIdentity = {
  id: string;
  handle: string;
  firstName: string;
  lastName: string;
  fullName: string;
  title: string;
  location: string;
  email: string;
  phone: string;
  github: string;
  linkedin: string;
  resume: string;
  timezone: string;
  version: string;
  seoTitle: string;
  seoDescription: string;
};

export type SiteHero = {
  signalLabel: string;
  tagline: string;
  dwgTitle: string;
  dwgNo: string;
  rev: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
};

export type SiteAbout = {
  sectionId: string;
  eyebrow: string;
  headline: string;
  body: string;
  highlights: string[];
  subjectLabel: string;
  statusLabel: string;
  verifiedLabel: string;
  asciiInitials: string;
  stats: { value: string; label: string }[];
};

export type SiteCapability = {
  id: string;
  title: string;
  blurb: string;
  body: string;
  tags: string[];
};

export type SiteExperience = {
  hex: string;
  range: string;
  meta: string;
  role: string;
  company: string;
  summary: string;
  bullets: string[];
  tags: string[];
};

export type SiteProject = {
  num: string;
  category: string;
  org: string;
  year: string;
  title: string;
  tagline: string;
  body: string;
  bullets: string[];
  outcome: string;
  tags: string[];
  image?: string;
};

export type SiteSkillGroup = {
  key: string;
  title: string;
  items: string[];
};

export type SiteUpskillPreview = {
  slug: string;
  id: string;
  status: string;
  title: string;
  topic: string;
  difficulty: string;
};

export type SiteUpskilling = {
  sectionId: string;
  eyebrow: string;
  headline: string;
  body: string;
  stats: { closed: number; writeups: number; hours: number };
  preview: SiteUpskillPreview[];
  boardCta: string;
};

export type SiteContact = {
  sectionId: string;
  eyebrow: string;
  headline: string;
  channelLabel: string;
  statusLabel: string;
  footerCopy: string;
};

export type SiteNavItem = { href: string; label: string };

export type SiteBootLine = { text: string; status: "ok" | "wait" | "warn" };

export type SiteContent = {
  identity: SiteIdentity;
  nav: SiteNavItem[];
  boot: {
    title: string;
    signalLock: string;
    skipLabel: string;
    accessGranted: string;
    lines: SiteBootLine[];
  };
  hero: SiteHero;
  about: SiteAbout;
  capabilities: {
    sectionId: string;
    eyebrow: string;
    headline: string;
    items: SiteCapability[];
  };
  experience: {
    sectionId: string;
    eyebrow: string;
    headline: string;
    items: SiteExperience[];
  };
  projects: {
    sectionId: string;
    eyebrow: string;
    headline: string;
    items: SiteProject[];
  };
  skills: {
    sectionId: string;
    eyebrow: string;
    headline: string;
    groups: SiteSkillGroup[];
  };
  upskilling: SiteUpskilling;
  contact: SiteContact;
};
