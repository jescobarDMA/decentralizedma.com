# PROJECT_LOG.md — decentralizedma.com

Internal reference document covering project context, design decisions, and work history. See `README.md` for public-facing info.

---

## 1. Project Overview

**What it is:** Marketing landing page for Decentralized Machine Automation (DMA) — engineering-led AI automation for electrical service companies in Houston and beyond.

| Field | Value |
|---|---|
| **Tagline** | Simplify. Automate. Execute. |
| **Contact** | jescobar@decentralizedma.com · 713-299-2339 |
| **Domain** | decentralizedma.com |
| **GitHub** | github.com/jescobarDMA/decentralizedma.com (public) |
| **Hosting** | Hostinger (Git-connected, auto-deploy from `main`) |
| **Positioning** | Engineering-led automation vs. generic AI consulting. ROI-focused. |

---

## 2. Tech Stack

- **Plain static site** — hand-written HTML + CSS + vanilla JS. No framework, no build step, no dependencies.
- **Single page** — sections: Hero, Problem, Services, Process, About, Proof, CTA, Footer.
- **Brand tokens** defined as CSS custom properties in `styles.css` `:root`:
  - Dark Green `#1c3423` · Sage Green `#67a97b` · Forest Green `#337551` · Warm White `#E8E4DD`
- **Fonts** self-hosted (TTF in `assets/fonts/`):
  - Instrument Sans — headings
  - Work Sans — body text

---

## 3. Architecture Notes

| File | Purpose |
|---|---|
| `index.html` | Full single-page markup. Inline `<script>` at bottom handles: mobile nav toggle, video `playbackRate`, scroll-state nav transition. |
| `styles.css` | All styles. CSS custom properties at `:root`. BEM-ish naming (`.hero__pre`, `.nav__links`, etc.). |
| `assets/fonts/` | 8 TTF files — Instrument Sans (4 weights) + Work Sans (4 weights) |
| `assets/images/` | `logo.png` (nav + footer), `icon.png` (favicon) |
| `assets/video/` | `mechanical-to-digital-gears.mp4` (~5.7 MB) — hero background |
| `.htaccess` | Apache config: disables HTML cache, aggressive cache for static assets, sets MP4 MIME type |
| `.gitignore` | `.DS_Store`, `*.log`, `.env`, `.vscode/`, `.idea/` |

---

## 4. Key Design Decisions

### Video Hero
- **Source video:** `Mechanical_to_Digital_Gears_Video.mp4` (mechanical → digital gears) — thematically matches DMA's "manual → automated" positioning.
- **Playback speed:** `0.5×` (half speed), set via `document.querySelector('.hero__video').playbackRate = 0.5` in the inline script.
- **Full-bleed cover method:** `top: 50%; left: 50%; transform: translate(-50%, -50%); min-width: 100%; min-height: 100%; width: auto; height: auto;`
  - **Why not `object-fit: cover`?** Unreliable on Hostinger/LiteSpeed for `<video>` elements. The transform-center approach works on every browser and hosting environment.
- **HTML attributes:** `autoplay muted loop playsinline` — the canonical four for cross-browser background video autoplay (iOS Safari requires `playsinline` + `muted`).

### Navigation
- `position: fixed` (not `sticky`) — so the nav overlays the hero video rather than pushing it down.
- **Transparent → solid transition** on scroll: JS `setNavState()` watches `window.scrollY` vs hero height and toggles `.nav--transparent` / `.nav--solid` classes.
- **Over video (transparent state):** logo gets `filter: brightness(0) invert(1)` (renders warm-white), links become `var(--warm-white)`.
- **Logo size:** `72px` height in an `80px`-tall nav bar.
- **Link font size:** `1.05rem`.

### Hero Scrim
- Single `linear-gradient(180deg, rgba(28,52,35,0.35) 0%, rgba(28,52,35,0.55) 50%, rgba(28,52,35,0.75) 100%)` over the video.
- Previously had a double-gradient (linear + radial). The radial component created a visible darker rectangle in the center — simplified to one gradient.
- Scrim element is `z-index: 1`; video is `z-index: 0`; hero content is `z-index: 2`.

### Hero Heading
- Two sentences, two lines via `<br>`. Each sentence stays on exactly one line using `white-space: nowrap` + `font-size: clamp(1.4rem, 3.2vw, 3.25rem)`.
- `max-width` removed from `.hero h1` — was causing mid-sentence wrapping.

### Calendar CTA
- Button href: `https://calendar.app.google/gd6ZC7kTfLV4Lqw1A`
- Located at line ~408 of `index.html` (the green CTA section near the bottom).

### Accessibility
- `prefers-reduced-motion: reduce` — hides video, shows plain dark-green hero background.
- Video has `aria-hidden="true"` — purely decorative, not announced to screen readers.
- Hero content (text, CTAs) is real DOM text — fully accessible.

---

## 5. Work Log (Chronological)

### Git Commits
| Commit | Date | Description |
|---|---|---|
| `ff08400` | 2026-04-15 | Initial commit — full site + video hero |
| `ac73bad` | 2026-04-15 | Add `.htaccess` — disable HTML cache, set MP4 MIME type |
| `9f27280` | 2026-04-15 | Lighten hero scrim — single gradient, fix video positioning |
| `ca0dd55` | 2026-04-15 | Fix video full-cover — transform centering for cross-browser compat |

### Within-Session Tweaks (all reflected in committed code)
- Dropped tagline ("Simplify. Automate. Execute.") from hero — user decision
- Nav: `position: sticky` → `position: fixed` so video fills behind it
- Nav: transparent-over-video behavior added (JS + CSS)
- Logo: `40px` → `72px` (iterated through 56, 68 first); nav bar `68px` → `80px`
- Nav link font: `0.92rem` → `1.05rem`
- Video speed: full speed → `0.5×`
- H1 layout: tried single-line (`white-space: nowrap`, no `<br>`) → reverted to two-sentences-two-lines
- Calendar link: updated from placeholder `calendar.google.com` to `calendar.app.google/gd6ZC7kTfLV4Lqw1A`
- Hero scrim: double-gradient → single gradient (fixed center-block visual artifact)
- Video cover: `object-fit: cover` + `inset: 0` → transform-center + `min-width/min-height` (fixed Hostinger rendering issue)

---

## 6. Deployment Setup

**GitHub** → `github.com/jescobarDMA/decentralizedma.com`
- Branch: `main`
- Visibility: Public
- `gh` CLI used for repo creation (`brew install gh` + `gh auth login` + `gh repo create`)

**Hostinger**
- Connected to GitHub repo via Hostinger's Git integration
- Redeploy: hPanel → Hosting → Git → Deploy / Pull
- Cache purge: hPanel → Cache → LiteSpeed Cache → Purge All
  - **Important:** LiteSpeed caches aggressively. After every push, always purge cache + hard-refresh (`Cmd+Shift+R`) to see changes.
- DNS: pre-existing, managed separately in Hostinger DNS panel

**Working copy (local, not committed to `agenticDMA_VA`):**
`/Users/joseescobar/Desktop/JESCOBAR/Programming/VS_Code/agenticDMA_VA/.tmp/dma-website/`
- Gitignored in `agenticDMA_VA` — stays local as a scratch pad
- Kept in sync manually when making changes

---

## 7. Known Issues / Open Items

- No critical issues outstanding as of 2026-04-16.
- Video rendering on Hostinger was unreliable with `object-fit: cover` — resolved with transform-center approach.
- LiteSpeed cache requires manual purge after every deployment.

**Future considerations (not yet done):**
- Compress video: produce a WebM + smaller MP4 variant for faster initial page load
- Add a `poster` frame (static image shown while video loads) — use `ffmpeg -i assets/video/mechanical-to-digital-gears.mp4 -vframes 1 assets/images/hero-poster.jpg`
- Set up Netlify/Vercel deploy preview for faster iteration without touching production
- Custom 404 page for Hostinger

---

## 8. Quick Reference

```bash
# Local preview — GitHub repo copy
open /Users/joseescobar/Desktop/JESCOBAR/Programming/VS_Code/decentralizedma.com/index.html

# Local preview — working copy
open /Users/joseescobar/Desktop/JESCOBAR/Programming/VS_Code/agenticDMA_VA/.tmp/dma-website/index.html

# Push a change
cd /Users/joseescobar/Desktop/JESCOBAR/Programming/VS_Code/decentralizedma.com
git add <files>
git commit -m "DDMMMYY_Description"
git push
# Then: Hostinger → Git → Deploy + Cache → Purge All

# Brand source of truth (canonical colors/fonts)
/Users/joseescobar/Desktop/JESCOBAR/Programming/VS_Code/agenticDMA_VA/DMA/colors.json
/Users/joseescobar/Desktop/JESCOBAR/Programming/VS_Code/agenticDMA_VA/DMA/brand-style-guide.pdf

# Source video (original file)
/Users/joseescobar/Desktop/JESCOBAR/Programming/VS_Code/agenticDMA_VA/Mechanical_to_Digital_Gears_Video.mp4
```
