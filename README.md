# chapter.vision

Marketing site + handbook for **Chapter Vision**, the immersive experience authoring
suite for Apple Vision Pro (Chapter Studio on macOS, Chapter Vision on visionOS,
ChapterScript format).

## Structure

```
index.html               Marketing homepage (scroll experience with six video
                         placeholder slots awaiting real product captures)
404.html                 Not-found page
assets/
  css/site.css           Design system + homepage styles
  js/site.js             Hero canvas, scroll scrubbing, reveals, chapter rail
  icon-256.png           App icon (brand mark + favicon)
  icon-512.png           App icon, hi-res
docs/
  index.html             Handbook home
  *.html                 29 handbook pages (flat)
  _TEMPLATE.html         Boilerplate for new handbook pages
  assets/docs.css        Docs layout + typography
  assets/docs.js         Sidebar, search, TOC, prev/next, all driven by the
                         MANIFEST array at the top of the file
```

## Homepage videos

The homepage has six video slots (`.film-frame` blocks), all currently labeled
placeholders with capture specs in adjacent HTML comments.

To fill one:

1. Drop the raw capture in `videos/` (gitignored; raw files never deploy).
2. Run `scripts/encode-web-video.sh videos/<file> <slug>` (needs `brew install ffmpeg`).
   It writes three files to `assets/video/`: `<slug>.av1.mp4` (AV1 10-bit primary,
   VMAF-tuned to ~95 at roughly 15% of source size), `<slug>.mp4` (H.264 fallback),
   and `<slug>-poster.jpg`. Audio is stripped; clips autoplay muted.
3. Replace the slot's `.vp` div with the `<video>` markup the script prints
   (AV1 `<source>` first, H.264 second).

## Local dev

Served by Laravel Herd at http://chaptervision.test with no build step. Everything is
static HTML/CSS/JS; the only external dependency is Google Fonts.

## Adding a handbook page

1. Copy `docs/_TEMPLATE.html` to `docs/<slug>.html`, set `<title>`, meta description,
   and `data-page="<slug>"` on the article.
2. Add an entry `{ id, file, title, desc, keywords }` to the right section of the
   `MANIFEST` array in `docs/assets/docs.js`. Sidebar, search, breadcrumbs and
   prev/next all pick it up automatically.

## Deploying to chapter.vision

Upload the directory as-is to any static host (Cloudflare Pages, Netlify, S3+CDN,
nginx). Configure the host to serve `404.html` for not-found routes. All internal
links are root-relative (`/docs/...`, `/assets/...`), so the site must live at the
domain root.
