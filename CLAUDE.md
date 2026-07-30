# CLAUDE.md

Guidance for Claude Code when working in this repository.

## What this is

The marketing site + documentation handbook for **Chapter Vision**, the immersive
experience authoring suite for Apple Vision Pro. Lives at the domain **chapter.vision**;
served locally by Laravel Herd at **http://chaptervision.test**. Built 2026-07-28.

Pure static HTML/CSS/JS — **no build step, no framework, no package.json**. The only
external dependency is Google Fonts (Fraunces, Outfit, JetBrains Mono). Deploy = upload
the whole directory to any static host at the domain root (all links are root-relative,
so it will NOT work from a subdirectory). Configure the host to serve `404.html` for
not-found routes.

The product's actual source code lives at `~/code/Maestro` (a Mac + visionOS Xcode
project). Its `CLAUDE.md` and `README.md` are the authoritative source of truth for how
the software behaves — **docs pages here were written from that source; verify claims
against it before documenting new features.**

## Branding rules (strict — the #1 thing to not get wrong)

| Public name (use on site) | Internal name (never on site) |
|---|---|
| Chapter Vision (the suite) | Maestro |
| **Chapter Studio** (Mac app) | MaestroStudio |
| **Chapter Vision** (Vision Pro app — yes, same name as the suite) | MaestroVision |
| the player | SharedVisions / ChapterPlayer |
| the particle editor | Afterburn |
| ChapterScript / `.chapterscript` bundle / `chapter.json` | (same — this one is public) |

- Never let `Maestro`, `SharedVisions`, `Afterburn`, or `_maestro._tcp` appear in site copy.
- Naming history: "Chapter Vision Studio" / "Chapter Vision Spatial" are **deprecated**
  earlier names — if you see them anywhere, fix them.
- Wordmark renders in **title case** ("Chapter Vision"), never all-caps.
- Document model vocabulary: a **chapter** (the whole document) contains **segments**
  (timed scenes) → **steps** (timed beats) → **actions**. Segments also carry animation
  tracks, a presentation mode (Immersive/Mixed/Windowed), an optional backdrop; steps can
  have **gates**. On the site, gates are described as Tap + optional timeout ONLY — the
  product's Orchestrator and Either gate types are not officially announced yet, so
  "Orchestrator", "Either" gates, and operator/show-cue phrasing must not appear in copy.
- Docs voice: second person, present tense, for creative authors not programmers. No
  Swift type names or source paths (live-sync + format pages may show HTTP/JSON).

## Theme (derived from the real app icon — don't invent new colors)

The palette was sampled from the app icon (an open storybook with a glowing portal),
copied from `~/code/Maestro/MaestroStudio/Assets.xcassets/AppIcon.appiconset/` into
`assets/icon-256.png` and `assets/icon-512.png`. The icon is the brand mark everywhere
(nav, footer, docs header, favicon, final CTA) — there is no SVG logo.

Tokens in `:root` of `assets/css/site.css`:

- Backgrounds: `--bg #0d0c1d`, `--bg-2 #14122a`, `--bg-3 #1d1a38` (indigo night)
- Text: `--ink #f0ecf9`, `--ink-dim #a49ec6`, `--ink-faint #6b6591`
- Accents: `--peri #9c8cf2` (periwinkle, primary), `--gold #f3cf9a` (warm gold),
  `--sky #6596dc` (sky blue)
- Gradients: `--grad-glow` (peri→gold, used on CTAs), `--grad-aurora` (sky→peri→gold,
  used on gradient text)
- Fonts: `--font-display` Fraunces (serif, headlines), `--font-body` Outfit,
  `--font-mono` JetBrains Mono
- Dark text on gradient buttons is literal `#14102e`

Use the CSS variables, not literal hex, for anything new.

## File map

```
index.html                Marketing homepage (nav, hero w/ canvas, marquee, sections
                          01–08, final CTA, footer). Section anchors: #studio #spatial
                          #animation #sync #particles #everything #format #learn
404.html                  Themed not-found page (reuses hero canvas)
README.md                 Human-facing: structure, local dev, deploy instructions
CLAUDE.md                 This file
assets/
  css/site.css            ALL design tokens + homepage styles (nav, hero, panels,
                          timeline mock .tl-*, graph mock, gizmo mock .gz-*, sync
                          diagram, grid cards, docs teaser, footer, .reveal scroll
                          animations)
  js/site.js              Homepage interactions: nav scroll state, IntersectionObserver
                          reveals, hero constellation canvas, particle emitter demo
                          canvas (hues: gold 34±14 / periwinkle 250)
  icon-256.png            App icon (brand mark + favicon on every page)
  icon-512.png            App icon hi-res (final CTA on homepage)
docs/
  index.html              Handbook home (card grid; data-page="index")
  _TEMPLATE.html          Boilerplate for new docs pages — copy this, don't hand-roll
  <slug>.html             29 content pages, flat, filename = page id
  assets/docs.css         Docs layout: header, sidebar, article typography, callouts,
                          .steps walkthroughs, tables, TOC, prev/next cards, responsive
  assets/docs.js          THE HUB: `MANIFEST` array (sections → pages with id/file/
                          title/desc/keywords) drives the sidebar, fuzzy search ("/" to
                          focus), breadcrumbs, TOC generation + scroll-spy, and
                          prev/next. Also injects the shared header/sidebar into
                          `#docs-shell` on every page.
```

## How docs pages work

Every docs page is a thin shell: standard `<head>` → `<body class="docs">` →
`<div id="docs-shell"></div>` → `<main class="doc-main"><article class="doc-article"
data-page="SLUG">…content…</article></main>` → `<script src="/docs/assets/docs.js">`.
Everything chrome-related is injected by docs.js at runtime.

**To add a page:**
1. Copy `docs/_TEMPLATE.html` → `docs/<slug>.html`; set `<title>` ("… — Chapter Vision
   Handbook"), meta description, and `data-page="<slug>"` (MUST equal the filename).
2. Add `{ id, file, title, desc, keywords }` to the right section of `MANIFEST` in
   `docs/assets/docs.js`. That's it — nav/search/prev-next all update.

Content conventions (all markup lives in `_TEMPLATE.html`): `<p class="doc-lede">` under
the h1; callouts `.callout.tip|.note|.warn` (with their inline SVG icons); numbered
walkthroughs `<ol class="steps">`; `<kbd>` for Mac shortcuts only; `<code>` for
filenames/values; cross-link generously with root-relative `/docs/<file>` hrefs.

Docs sections & pages (29 + index): Start Here (what-is-chapter-vision, install-and-setup,
your-first-chapter, connecting-vision-pro) · Core Concepts (chapters-and-segments,
steps-and-actions, assets-and-folders, presentation-modes, gates) · The Timeline
(timeline-overview, adding-actions, editing-clips, video-trimming, audio-channels) ·
Actions Reference (actions-reference) · Animation (animation-overview,
keyframes-and-autokey, graph-editor, rotation-and-euler) · On Vision Pro
(vision-studio-overview, spatial-gizmo, spatial-timeline, media-import, solo-mode) ·
Particles (particles-overview, particle-reference) · Live Sync & Format (live-sync,
chapterscript-format, troubleshooting).

## Verification (run after any sitewide change)

```bash
cd ~/Herd/chaptervision

# manifest ↔ files agree, no orphans
node -e "const fs=require('fs');const js=fs.readFileSync('docs/assets/docs.js','utf8');
const m=[...js.matchAll(/file: \"([^\"]+)\"/g)].map(x=>x[1]);
const f=fs.readdirSync('docs').filter(x=>x.endsWith('.html')&&x!=='_TEMPLATE.html');
console.log('missing:',m.filter(x=>!f.includes(x)),'orphans:',f.filter(x=>!m.includes(x)))"

# data-page matches filename
for f in docs/*.html; do b=$(basename $f .html); [ "$b" = _TEMPLATE ] && continue; \
  grep -q "data-page=\"$b\"" $f || echo "MISMATCH: $f"; done

# no broken internal links
grep -rhoE 'href="/(docs/)?[^"#]*\.html"' index.html 404.html docs/*.html | \
  sed 's/href="//;s/"//' | sort -u | while read u; do [ -f ".$u" ] || echo "MISSING: $u"; done

# no internal codenames or deprecated names leaked
grep -rni "maestro\|sharedvisions\|afterburn\|Vision Studio\|Vision Spatial" \
  index.html 404.html README.md docs/*.html docs/assets/*.js

# pages actually serve
curl -s -o /dev/null -w "%{http_code}\n" http://chaptervision.test/
```

## Gotchas

- **Renames must be contextual.** App-name strings wrap across lines in prose
  (`Chapter\n Vision …`), so plain `sed` misses them — use `perl -0pi` multiline
  patterns and re-grep afterwards. Watch legitimate generic uses: "spatial video"
  (Apple's format), "spatial storytelling", "Spatial gizmos" are NOT app references.
- **docs.js MANIFEST is the single source of truth** for docs nav/search. A page not in
  it is invisible (no sidebar entry, no search hits) even though the file serves fine.
- Homepage product mockups (timeline `.tl-*`, graph SVG, gizmo `.gz-*`, sync diagram)
  are hand-built CSS/SVG in index.html — keep them consistent with real product behavior.
- `prefers-reduced-motion` is honored: canvases don't run, reveals show instantly. Keep
  that true for anything new.
- Timeline clip colors (`.tl-clip.c-*`) are thematically tinted (scene=gold,
  video=blue, audio=green, fx=lavender, move=periwinkle) — they intentionally echo the
  real editor's track tints.
