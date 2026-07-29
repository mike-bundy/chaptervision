# chapter.vision

Marketing site + handbook for **Chapter Vision**, the immersive experience authoring
suite for Apple Vision Pro (Studio on macOS, Chapter Vision on visionOS, ChapterScript format).

## Structure

```
index.html               Marketing homepage
404.html                 Not-found page
assets/
  css/site.css           Design system + homepage styles
  js/site.js             Hero canvas, particle demo, scroll reveals
  favicon.svg            Brand mark
docs/
  index.html             Handbook home
  *.html                 29 handbook pages (flat)
  _TEMPLATE.html         Boilerplate for new handbook pages
  assets/docs.css        Docs layout + typography
  assets/docs.js         Sidebar, search, TOC, prev/next — all driven by the
                         MANIFEST array at the top of the file
```

## Local dev

Served by Laravel Herd at http://chaptervision.test — no build step. Everything is
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
