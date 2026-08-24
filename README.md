# Comanager — Website

The Comanager website (`comanager.com`), built with the in-house Comanager
design system on **Astro** (Cloudflare adapter, server output).

## URL structure

| Path | Owned by | Lives here? |
|---|---|---|
| `/` | **Claude Code** (this repo) | ✅ `src/pages/index.astro` — the home page |
| `/chat` | **Claude Code** (this repo) | ✅ `src/pages/chat.astro` — the AI launcher (chat input + manager prompts) |
| `/cmngr/<slug>` | **Claude Code** (this repo) | ✅ `src/pages/cmngr/<slug>.astro` — campaign landing pages |
| `/hub/blog` | **Webflow CMS** | ❌ Not in this repo — do not touch |
| `/hub/case-studies` | **Webflow CMS** | ❌ Not in this repo — do not touch |

Everything under `/hub/*` is a Webflow-managed CMS section. This repo only owns
the home page and the `/cmngr/*` landing pages. At the domain level, `/hub/*` is
routed to Webflow and everything else to this app (routing/mount configured at
deploy time — see **Deploy** below).

## What's here

```
comanager-claude/
├── src/
│   ├── layouts/Campaign.astro     ← shared <head>, inlined CSS, LCP preload, modal, JS
│   └── pages/
│       ├── index.astro            ← home page (/)
│       ├── chat.astro             ← AI launcher (/chat)
│       └── cmngr/
│           ├── artist-aura.astro  ← /cmngr/artist-aura
│           └── social.astro       ← /cmngr/social
├── public/assets/
│   ├── css/styles.css             ← the one canonical stylesheet (design system)
│   ├── js/components.js           ← tiny vanilla JS (reveal, carousel, modal)
│   ├── fonts/                     ← self-hosted WOFF2 (Syne · Newsreader · Manrope)
│   └── img/                       ← WebP photos + logo marks
├── components/                    ← copy-paste HTML reference blocks (design-system docs)
├── STYLEGUIDE.md                  ← the written build manual (read before composing a page)
├── astro.config.mjs               ← base '/', server output, Cloudflare adapter
├── wrangler.json · webflow.json   ← Cloudflare Workers / Webflow Cloud config
```

## Design system

This repo uses the established **Comanager design system** — do not fork it or
introduce off-system colors/fonts. Everything comes from `public/assets/css/styles.css`
(canonical tokens) + `src/layouts/Campaign.astro` + the component classes.
Read **`STYLEGUIDE.md`** before building any page, including the §10 performance
rules (WebP images, WOFF2 fonts, LCP preload, no above-the-fold animation).

## Add a landing page

1. Copy an existing page in `src/pages/cmngr/` to `src/pages/cmngr/<slug>.astro`.
2. It goes live at `/cmngr/<slug>`. Set the layout's `heroImg` to that page's hero.
3. Compose from existing components; add new reusable blocks to `styles.css` only
   when a pattern is genuinely new (never one-off per-page CSS).

## Local dev

```bash
npm install
npm run build        # astro build → dist/_worker.js + static assets
# preview the built Worker locally:
npx wrangler dev
```

Note: the Cloudflare adapter enables Astro sessions (a `SESSION` KV binding).
For local `wrangler dev` add a placeholder KV to `wrangler.json`; the hosting
platform provisions it in production. Do not commit the placeholder.

## Deploy

Not wired up yet. This app is a single Astro/Cloudflare project; the home lives
at `/` and campaigns at `/cmngr/*`. The `/hub/*` Webflow split is handled at the
domain/routing layer, not in this repo.
