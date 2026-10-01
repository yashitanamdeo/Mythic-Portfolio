# Mythic Portfolio (dhruvjs.com replica)

High-fidelity recreation of [dhruvjs.com](https://www.dhruvjs.com/) — tactical blueprint / terminal aesthetic.

Multi-site: one codebase, content switched via `NEXT_PUBLIC_SITE_ID`.

| `NEXT_PUBLIC_SITE_ID` | Person |
| --- | --- |
| `dhruv` (default) | Dhruv Parmar |
| `person-a` | Shashwat Bangar — Data Engineer |
| `person-b` | Yashita Namdeo — Senior Software Engineer |

## Stack

- **Next.js 15** (App Router) + TypeScript
- **Tailwind CSS v4**
- Fonts: Space Grotesk · Inter · JetBrains Mono

## Run locally

```bash
npm install

# Dhruv (default)
npm run dev

# Shashwat
NEXT_PUBLIC_SITE_ID=person-a npm run dev

# Yashita
NEXT_PUBLIC_SITE_ID=person-b npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Content lives in `src/content/sites/*.json`.

## What's included

- Boot sequence intro (every reload)
- Custom cursor + grain overlay
- Blueprint hero (radar, sys modules, DWG stamp)
- About (ASCII portrait canvas) + stats
- Capabilities accordion
- Experience, projects, skills
- Upskilling preview + full kanban board (`/upskilling`) + ticket pages
- Contact email copy + links
- ⌘K command palette
- Interactive terminal (`whoami`)
- Live IST clock + scroll progress status bar
- Mobile nav drawer

---

## Host for free — two independent sites (Shashwat & Yashita)

Best free path: **two Vercel projects** from the same Git repo, each with its own `NEXT_PUBLIC_SITE_ID` and its own custom domain.

### 1. Push the repo to GitHub

```bash
# once
git remote add origin https://github.com/<you>/PFolio.git
git push -u origin main
```

### 2. Create Project A — Shashwat

1. Go to [vercel.com](https://vercel.com) → **Add New Project** → import the repo.
2. Project name e.g. `shashwat-portfolio`.
3. **Environment Variables** → add:
   - `NEXT_PUBLIC_SITE_ID` = `person-a`
4. Deploy.

You get a free URL like `shashwat-portfolio.vercel.app`.

### 3. Create Project B — Yashita

1. **Add New Project** again → same repo.
2. Project name e.g. `yashita-portfolio`.
3. Env: `NEXT_PUBLIC_SITE_ID` = `person-b`
4. Deploy → `yashita-portfolio.vercel.app`.

Same commits rebuild both; each site only shows its JSON.

### 4. Free custom domains (pick one path each)

**Option A — Free subdomain (easiest)**

| Who | Free domain ideas |
| --- | --- |
| Shashwat | `shashwatbangar.vercel.app` (rename in Vercel) or GitHub Pages `shashwatbangar.github.io` |
| Yashita | She already has [`yashitanamdeo.github.io`](https://yashitanamdeo.github.io/) — can point a new Vercel alias, or keep Pages for V1 and use `yashita-portfolio.vercel.app` for this build |

**Option B — Free custom domain from Freenom / similar**

Truly free apex domains (`.tk`, `.ml`, etc.) are unreliable in 2026. Prefer:

- **Cloudflare** Registrar (paid domain cheap, DNS free) — ~$10/yr for `.dev` / `.in`
- **Namecheap** / **Porkbun** promo `.dev` / `.xyz`
- **GitHub Student Pack** — free domains if eligible (Namecheap, DigitalOcean credits, etc.)

Recommended free-*feeling* setup:

1. Buy one cheap domain each (e.g. `shashwatbangar.dev`, `yashitanamdeo.dev`) — often <$15/yr.
2. In each Vercel project → **Settings → Domains** → add the domain.
3. Vercel shows DNS records; at your registrar add:

```text
# Apex
A     @     76.76.21.21

# or recommended
CNAME  www   cname.vercel-dns.com
```

4. Wait for SSL (auto via Vercel). Done — each person has their own live site on their own domain.

**Option C — 100% free with GitHub Pages (static export)**

Next.js App Router needs `output: 'export'` for pure static Pages hosting. This repo uses server features lightly; for Pages:

1. Set `output: 'export'` in `next.config.ts` (and drop anything that needs a Node server).
2. Build with `NEXT_PUBLIC_SITE_ID=person-a` (or `person-b`).
3. Publish `out/` to `username.github.io` or a `gh-pages` branch.
4. Custom domain: repo **Settings → Pages → Custom domain** + DNS `CNAME` to `username.github.io`.

Vercel is simpler for this stack (no static-export changes).

### 5. Optional: separate forks

If Shashwat and Yashita should not share one Git remote:

1. Fork / copy the repo twice.
2. In fork A delete other site JSON (or leave them; env still selects).
3. Hardcode default in `loadSite.ts` or set env only on that Vercel project.
4. Each person connects their fork to their Vercel + domain.

### 6. Resumes / assets

Drop PDFs into `public/`:

- `public/Shashwat_Bangar_Resume.pdf`
- `public/Yashita_Namdeo_Resume.pdf`

Rebuild after adding.

---

## Note

Site content for Shashwat / Yashita is assembled from public LinkedIn, GitHub, LeetCode and (for Yashita) her older portfolio, with reasoned experience/project copy where public detail was thin. Edit `src/content/sites/person-a.json` / `person-b.json` before shipping as production personal sites.
