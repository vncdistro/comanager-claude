# Comanager Landing — Style Guide & Build Manual

This is the written companion to `styleguide.html`. Read it before composing a
campaign page from a screenshot. The golden rule: **compose existing components;
do not write new CSS per campaign.**

---

## 1. Brand voice & feel

"Studio at night" — warm, editorial, confident. Near-black background, cream
type, one warm orange-red accent. Headlines are tight and lower-key (Syne 700,
not 800); editorial leads are set in italic serif (Newsreader). Generous
vertical rhythm. Subtle motion only (slow drifting glow, gentle reveals).

## 2. Design tokens (CSS variables)

Always reference the variable, never the raw hex — that's what makes per-campaign
theming possible.

| Token | Value | Use |
|---|---|---|
| `--bg` | `#060605` | Page background |
| `--surface` | `#131311` | Cards, modal |
| `--surface-2` | `#1B1B19` | Raised surfaces |
| `--hover` | `#2F2E29` | Inactive dots, hover fills |
| `--cream` | `#FBF8E8` | Primary text / headlines |
| `--cream-warm` | `#FBF5D5` | Warm headline text |
| `--cream-dim` | `#E0DBBF` | Primary button fill |
| `--text-2` | `#C5C1A8` | Body copy |
| `--text-3` | `#AAA690` | Secondary text, cites |
| `--text-4` | `#8F8B7A` | Muted labels |
| `--line` / `--line-2` | cream @ 10% / 16% | Hairline borders |
| **`--accent`** ★ | `#C8512C` | **Per-campaign.** Eyebrows, links, step numerals, hover |
| **`--glow`** ★ | `#2E6FB0` | **Per-campaign.** Steps-section radial glow |
| `--maxw` | `1200px` | Content max width |
| `--pad` | `clamp(20px,4.5vw,56px)` | Horizontal page padding |
| `--radius-sm/md/lg/pill` | `6 / 8 / 16 / 999px` | `md` is the workhorse; `lg` for large panels & framed images |

These landing tokens are thin aliases over the **canonical Comanager design
system** now defined at the top of `styles.css`: the full warm gray ramp
(`--gray-100` … `--gray-950`), base status accents (`--base-blue/green/red/
yellow` + `*-overlay`), semantic aliases (`--surface-*`, `--text-*`,
`--border-*`, `--status-*`), the **manager-color system** (see §7), a 4px
spacing scale (`--space-1` … `--space-16`), a shadow scale (`--shadow-xs/sm/
card/pop`), and `--card-veil`. Prefer a canonical token when one exists; the
aliases just keep the component classes terse.

★ **Per-campaign theming:** override `--accent` and `--glow` in a tiny inline
`<style>:root{--accent:#741541;--glow:#390552;}</style>` in the page head, or on
any wrapper element. Tested accent options: `#C8512C` `#D66D6C` `#B6890A`
`#741541`. Glow options: `#2E6FB0` `#205058` `#741541` `#390552`. To theme a page
to one persona, point `--accent` at a manager color, e.g.
`--accent:var(--mgr-social-bright)`.

## 3. Typography

| Family | Variable | Used for |
|---|---|---|
| **Syne** (400–800) | `--font-display` | Headlines, eyebrows, labels, nav, step titles, buttons |
| **Newsreader** (200–800, roman + italic) | `--font-serif` (display 60pt cut) · `--font-serif-text` (24pt text cut) | Editorial section leads (`.serif-lead`), accent words (`.serif`), quotes, numerals. Use the text cut below ~28px, the display cut above. |
| **Manrope** (200–800) | `--font-body` | Body copy, sub-text, fine print |

All three families are fully self-hosted in `/assets/fonts/` across the weight
ranges above — there are **zero CDN font dependencies**.

Helper classes: `.eyebrow` (accent uppercase + dot), `.label` (muted uppercase),
`.serif-lead` (the italic section heading), `.serif` (inline italic accent word).
Syne and Newsreader are deliberately sized to read at the same visual scale when
adjacent — keep that balance if you resize.

## 4. Buttons & the arrow

- `.btn .btn-primary` — cream fill, dark text. The main CTA.
- `.btn .btn-outline` — transparent, hairline border.
- `.btn-sm` — smaller padding.
- `.btn-google` — white "Continue with Google" button (sign-in CTA only).
- `.nav-cta` / `.fc-cta` — underlined uppercase text links.
- Arrow icon: `<span class="arrow"></span>` inside a button/link — inherits color
  and slides right on hover. `.arrow-sm` for the smaller version.

## 5. Component catalog

Every section is a block in `/components/`. Pick the variant that matches the
screenshot. All blocks are mobile-responsive already.

| Component | Files | Variants / knobs |
|---|---|---|
| **Nav** | `nav.html` | Transparent, sits over hero. Edit links + CTA label. |
| **Hero** | `hero-split.html`, `hero-centered.html` | Split: `data-side="left\|right"`. Photo via `--hero-img`. |
| **Aura grid** | `aura.html` | 2-col numbered pills. Renumber `.idx` if you change count. |
| **Steps** | `steps.html` | Add `steps-grid-bordered` for bordered cards. Glow via `--glow`. |
| **Quotes** | `quotes-carousel.html`, `quotes-grid.html` | Carousel auto-rotates (JS); grid is static (good for 6). |
| **CTA** | `cta-banner.html`, `cta-signin.html` | Full-bleed banner, or split Google sign-in. Photo via `--cta-img`. |
| **Footer** | `footer-classical.html`, `footer-centered.html` | Full link columns, or minimal logo-only. |
| **Manager tag** | `manager-tag.html` | Persona pill. Set persona with `data-mgr="…"`. |
| **Tinted manager card** | `manager-card.html` | Signature glowing card. `data-mgr="…"`; add `.solid` to tint the whole surface. |
| **Waitlist modal** | `waitlist-modal.html` | Place once. Opens from any `data-open-waitlist`. |

### The two reference layouts (both built only from the above)

- **Split landing ("B")**: nav → hero-split → aura → steps → quotes-carousel →
  cta-banner → footer-classical → modal. (This is what `_template.html` ships.)
- **Aura landing ("A")**: nav → hero-centered → aura → steps *(bordered)* →
  quotes-grid → cta-signin → footer-centered → modal.

## 6. Behavior hooks (data attributes)

`components.js` wires these — never edit the JS to build a page, just use the hooks:

- `class="reveal"` + optional `data-d="1|2|3"` — fades/slides in on scroll (staggered).
- `data-carousel` on `.q-stage` (+ `data-interval="ms"`), with a sibling
  `[data-dots]` holding one `<button>` per card. **Keep card count = dot count.**
- `data-open-waitlist` on any button/link — opens the modal.
- Inside the modal: `[data-close]`, `[data-modal-form]`, `[data-modal-ok]`,
  `[data-ok-email]` — handled automatically.

## 7. The manager-color system (the brand's signature)

Comanager has eight "manager" personas; each owns a color. A persona **signs**
the card it produced with a colored tag, and cards **glow** in the persona's hue.
The palette is chroma-normalized — only the hue changes between personas.

| Persona | `data-mgr` key | regular / bright tokens |
|---|---|---|
| A&R | `ar` | `--mgr-ar` / `--mgr-ar-bright` |
| Booking Agent | `booking` | `--mgr-booking` / `--mgr-booking-bright` |
| Creative Director | `creative` | `--mgr-creative` / `--mgr-creative-bright` |
| Fan Manager | `fan` | `--mgr-fan` / `--mgr-fan-bright` |
| Marketing Manager | `marketing` | `--mgr-marketing` / `--mgr-marketing-bright` |
| Opportunities Manager | `opportunities` | `--mgr-opportunities` / `--mgr-opportunities-bright` |
| Project Manager | `project` | `--mgr-project` / `--mgr-project-bright` |
| Social Manager | `social` | `--mgr-social` / `--mgr-social-bright` |

Set `data-mgr="<key>"` on a `.mgr-tag` or `.mgr-card` and it themes everything
inside (the blob, the eyebrow, the tag dot) — no per-persona CSS needed. The
`-regular` value is the deep fill; `-bright` is the lighter accent/glow.

- **`.mgr-tag`** — the small Syne pill (`<span class="tdot">` for the dot).
- **`.mgr-card`** — dark surface + blurred colored blob under `--card-veil`.
  Add **`.solid`** for the big "Good News / service" treatment that tints the
  whole surface. Compose cards in a `.mgr-card-grid`.

## 8. Asset paths

- From a page in `/campaigns/`, reference CSS/JS/logo as `../assets/...`.
- Background photos in CSS (`--hero-img`, `--cta-img`, defaults) resolve relative
  to `styles.css`, so `url('../img/photo.jpg')` works from any page depth.
- The logo `<img src>` is HTML-relative — use `../assets/img/...` from `/campaigns/`.

## 9. Do / Don't

**Do**
- Build a new page by copying `_template.html` and swapping component blocks.
- Override `--accent` / `--glow` per campaign in the page head.
- Add a genuinely new, reusable pattern as a *variant block* in `styles.css`
  plus a new file in `components/`.

**Don't**
- Don't fork or inline-rewrite `styles.css` per campaign.
- Don't add a `<style>` block of one-off layout CSS inside a campaign page
  (per-campaign `--accent`/`--glow` overrides are the only allowed inline style).
- Don't change card/dot counts out of sync in the carousel.
- Don't duplicate the waitlist modal more than once per page.

## 10. Performance rules (required for every LP)

Some of this is automatic — the `Campaign.astro` layout inlines the stylesheet
(no render-blocking request), preloads the hero, and the fonts are already WOFF2
with `font-display: swap`. **Don't undo those** (no external `<link
rel="stylesheet">`, don't remove the hero preload). The rest is on the author of
each new page:

**Do**
- **Export every photo as WebP**, ≤1920px wide, quality ≈80. A hero should be
  well under ~300 KB. (`cwebp -q 80 -resize 1920 0 in.png -o out.webp`.)
- **Set `heroImg`** on the `<Campaign>` layout to the page's LCP image so it gets
  preloaded with `fetchpriority="high"`.
- Keep above-the-fold content static — let it paint on first render.

**Don't**
- Don't commit multi-MB PNG/JPG images, or `.ttf` fonts (use WebP / WOFF2).
- **Don't put `reveal` (or any load/entrance animation) on above-the-fold
  elements** (nav, hero). Scroll-reveals are for below-the-fold sections only —
  a hidden-until-JS hero delays first paint and LCP.
- Don't add render-blocking `<link>`s or large blocking scripts in the head.
