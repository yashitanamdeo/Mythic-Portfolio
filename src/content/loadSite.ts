import type { SiteContent } from "./types";
import dhruv from "./sites/dhruv.json";
import personA from "./sites/person-a.json";
import personB from "./sites/person-b.json";

const SITES: Record<string, SiteContent> = {
  dhruv: dhruv as SiteContent,
  "person-a": personA as SiteContent,
  "person-b": personB as SiteContent,
};

export const SITE_IDS = Object.keys(SITES);

export function getSiteId(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_ID?.trim();
  if (fromEnv && SITES[fromEnv]) return fromEnv;
  return "dhruv";
}

export function getSiteContent(siteId?: string): SiteContent {
  const id = siteId && SITES[siteId] ? siteId : getSiteId();
  return SITES[id];
}

export function listSites() {
  return SITE_IDS.map((id) => ({
    id,
    fullName: SITES[id].identity.fullName,
    handle: SITES[id].identity.handle,
  }));
}
