/* ==========================================================================
   Chapter Vision docs — shared shell: sidebar, search, TOC, prev/next.
   Every docs page contains <div id="docs-shell"></div> before <main> and an
   <article class="doc-article" data-page="<id>"> — everything else is built here.
   ========================================================================== */
(function () {
  "use strict";

  var MANIFEST = [
    {
      section: "Start Here",
      pages: [
        { id: "index", file: "index.html", title: "Handbook home", desc: "The Chapter Vision handbook — every guide, tutorial and reference.", keywords: "home docs handbook help" },
        { id: "what-is-chapter-vision", file: "what-is-chapter-vision.html", title: "What is Chapter Vision?", desc: "The suite at a glance: Chapter Studio on Mac, Chapter Vision on Vision Pro, the player, and the ChapterScript format.", keywords: "overview intro introduction studio spatial player chapterscript suite apps" },
        { id: "install-and-setup", file: "install-and-setup.html", title: "Install & set up", desc: "System requirements and first-launch setup for Chapter Studio on macOS and Chapter Vision on visionOS.", keywords: "install setup requirements macos visionos download launch" },
        { id: "your-first-chapter", file: "your-first-chapter.html", title: "Your first chapter", desc: "A start-to-finish tutorial: import assets, build a segment, add actions, animate, gate, and play it live on Vision Pro.", keywords: "tutorial first chapter getting started walkthrough beginner" },
        { id: "connecting-vision-pro", file: "connecting-vision-pro.html", title: "Connecting a Vision Pro", desc: "Pair the headset with your Mac over Bonjour and start live-iterating in under a second per save.", keywords: "connect pair bonjour wifi network headset live session tether" }
      ]
    },
    {
      section: "Core Concepts",
      pages: [
        { id: "chapters-and-segments", file: "chapters-and-segments.html", title: "Chapters & segments", desc: "The document model: a chapter is the experience; segments are its timed scenes, each with steps, animation tracks and a backdrop.", keywords: "chapter segment document model scenes default segment structure" },
        { id: "steps-and-actions", file: "steps-and-actions.html", title: "Steps & actions", desc: "Steps are timed beats inside a segment; actions are what happens — reveals, moves, audio, video, effects — at step start or scheduled mid-step.", keywords: "step action scheduled duration beat timing structure" },
        { id: "assets-and-folders", file: "assets-and-folders.html", title: "Assets & folders", desc: "Importing video, USDZ, images and audio, organizing with folders, duplicating, and the Scene vs Backdrops sections.", keywords: "asset import video usdz image audio folder organize sidebar library" },
        { id: "presentation-modes", file: "presentation-modes.html", title: "Presentation modes & backdrops", desc: "Immersive, Mixed and Windowed segments — and wrapping a scene in a 360°/180° video sphere or USDZ environment.", keywords: "immersive mixed windowed passthrough backdrop skybox 360 180 video sphere usdz environment presentation" },
        { id: "gates", file: "gates.html", title: "Gates", desc: "Hold a step until the audience taps or a timeout fires — with optional prompts.", keywords: "gate tap timeout prompt hold interaction pause wait" }
      ]
    },
    {
      section: "The Timeline",
      pages: [
        { id: "timeline-overview", file: "timeline-overview.html", title: "Timeline overview", desc: "The multi-track editing surface: segment tabs, ruler, track groups, derived clips, playhead and scrubbing.", keywords: "timeline overview tracks clips ruler playhead scrub zoom lanes" },
        { id: "adding-actions", file: "adding-actions.html", title: "Adding actions", desc: "Drag chips from the action library onto tracks, snap to step boundaries, and drop onto empty rails.", keywords: "add action drag drop library chip snap boundary empty section" },
        { id: "editing-clips", file: "editing-clips.html", title: "Editing clips", desc: "Retime by dragging clip bodies and edges, drag step boundaries, use the clip inspector, and edit parameters inline.", keywords: "clip drag resize retime trim edge inspector move duplicate delete" },
        { id: "video-trimming", file: "video-trimming.html", title: "Video trimming & cropping", desc: "Non-destructive source windows — slip in-points, set out-points — and the destructive Crop to Clip Length command.", keywords: "video trim slip source in out crop consolidate non-destructive master" },
        { id: "audio-channels", file: "audio-channels.html", title: "Audio channels", desc: "How audio tracks work: channels, play/stop/fade actions, renaming channels safely, and volume control.", keywords: "audio channel sound music volume loop fade rename" }
      ]
    },
    {
      section: "Actions Reference",
      pages: [
        { id: "actions-reference", file: "actions-reference.html", title: "All actions", desc: "Every library action — Scene, Add, Video, Audio and Effects — with parameters and timeline behavior.", keywords: "action reference show hide reveal fade move scale rotate play stop pulse spark burst add asset image particle catalog list all" }
      ]
    },
    {
      section: "Animation",
      pages: [
        { id: "animation-overview", file: "animation-overview.html", title: "Animation overview", desc: "Segment-level animation tracks: ten channels per entity, absolute-time keys, and one evaluator everywhere.", keywords: "animation overview tracks channels keyframe segment pose opacity" },
        { id: "keyframes-and-autokey", file: "keyframes-and-autokey.html", title: "Keyframes & auto-key", desc: "Set Key, auto-key recording rules, moving and deleting keys, and keyframe lanes on the timeline.", keywords: "keyframe set key auto-key record autokey lane diamond pose" },
        { id: "graph-editor", file: "graph-editor.html", title: "The graph editor", desc: "Channel chips, tangent handles, interpolation modes, axis-locked drags, snapping, zoom and multi-select.", keywords: "graph editor curve bezier tangent handle interpolation linear stepped zoom scrub" },
        { id: "rotation-and-euler", file: "rotation-and-euler.html", title: "Rotation & Euler angles", desc: "Continuous Euler degrees, rotate orders, multi-turn wind-ups, and why your rotations never flip.", keywords: "rotation euler degrees order gimbal flip continuous turns" }
      ]
    },
    {
      section: "On Vision Pro",
      pages: [
        { id: "vision-studio-overview", file: "vision-studio-overview.html", title: "The spatial studio", desc: "Chapter Vision's single studio window: session rail, libraries, timeline, graph dock and inspectors.", keywords: "vision pro spatial studio window layout rail inspector library" },
        { id: "spatial-gizmo", file: "spatial-gizmo.html", title: "The gizmo & direct editing", desc: "Gaze-and-pinch entity edits: the mode picker, translate arms, rotation rings, uniform scale, and how auto-key interacts with drags.", keywords: "gizmo mode picker translate rotate scale rings arms pinch gaze drag axis grab bar direct manipulation" },
        { id: "spatial-timeline", file: "spatial-timeline.html", title: "The spatial timeline", desc: "The in-headset timeline: segment tabs, drag-retiming, trim mode, step boundaries, snapping and zoom.", keywords: "spatial timeline vision retime trim snap zoom step boundaries clips" },
        { id: "media-import", file: "media-import.html", title: "Importing media on-device", desc: "Pull video and images from Photos or Files on the headset — local-first, with background upload to the Mac.", keywords: "import photos files media icloud upload local-first background device" },
        { id: "solo-mode", file: "solo-mode.html", title: "Solo mode", desc: "Author complete chapters on Vision Pro with no Mac: create, open, save, undo/redo and recents.", keywords: "solo mode standalone offline no mac local save open create undo" }
      ]
    },
    {
      section: "Particles",
      pages: [
        { id: "particles-overview", file: "particles-overview.html", title: "Particles overview", desc: "Presets, the built-in catalog, attaching emitters to entities, bursts vs loops, and the live preview editor.", keywords: "particles overview emitter preset burst loop preview catalog effects" },
        { id: "particle-reference", file: "particle-reference.html", title: "Particle parameter reference", desc: "Every emitter parameter: emission, shapes, physics, color modes, visuals, force fields and spawned secondary emitters.", keywords: "particle reference emission shape physics color force field vortex attraction noise spawn parameters" }
      ]
    },
    {
      section: "Live Sync & Format",
      pages: [
        { id: "live-sync", file: "live-sync.html", title: "Live sync", desc: "How the live server works: Bonjour discovery, sub-second pushes, bidirectional edit ops, revisions, and Save on Mac.", keywords: "live sync server bonjour sse ops revision save push network" },
        { id: "chapterscript-format", file: "chapterscript-format.html", title: "The ChapterScript format", desc: "Inside a .chapterscript bundle: chapter.json structure, the asset manifest, versioning and compatibility.", keywords: "chapterscript format file json bundle manifest sha version open" },
        { id: "troubleshooting", file: "troubleshooting.html", title: "Troubleshooting & FAQ", desc: "Fixes for connection, playback, video, import and editing issues — plus frequently asked questions.", keywords: "troubleshooting faq problem fix error connection black video help" }
      ]
    }
  ];

  var FLAT = [];
  MANIFEST.forEach(function (s) {
    s.pages.forEach(function (p) { p.section = s.section; FLAT.push(p); });
  });

  var article = document.querySelector(".doc-article");
  var pageId = article ? article.getAttribute("data-page") : null;
  var current = FLAT.find(function (p) { return p.id === pageId; }) || null;

  /* ---------------- Shell ---------------- */
  var shell = document.getElementById("docs-shell");
  if (shell) {
    var markSvg =
      '<img class="mark" src="/assets/icon-256.png" alt="Chapter Vision icon" style="border-radius:50%">';

    var sidebarHtml = MANIFEST.map(function (s) {
      return (
        '<div class="sb-section"><h5>' + s.section + "</h5>" +
        s.pages.map(function (p) {
          var cls = p.id === pageId ? ' class="current"' : "";
          return '<a href="/docs/' + p.file + '"' + cls + ">" + p.title + "</a>";
        }).join("") +
        "</div>"
      );
    }).join("");

    shell.innerHTML =
      '<header class="docs-header">' +
      '<button class="menu-btn" aria-label="Toggle navigation"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button>' +
      '<a class="brand" href="/">' + markSvg + 'Chapter&nbsp;Vision <span class="docs-tag">Handbook</span></a>' +
      '<div class="docs-search">' +
      '<svg class="s-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.8-3.8"/></svg>' +
      '<input type="search" id="docs-search-input" placeholder="Search the handbook…" autocomplete="off">' +
      '<kbd class="slash">/</kbd>' +
      '<div class="search-results" id="search-results"></div>' +
      "</div>" +
      '<a class="home-link" href="/">← chapter.vision</a>' +
      "</header>" +
      '<div class="docs-layout">' +
      '<nav class="docs-sidebar" id="docs-sidebar">' + sidebarHtml + "</nav>" +
      "</div>";

    // Move <main> inside the layout grid so the sidebar sits beside it.
    var layout = shell.querySelector(".docs-layout");
    var main = document.querySelector(".doc-main");
    if (layout && main) layout.appendChild(main);

    // Scroll the current sidebar link into view.
    var cur = shell.querySelector(".docs-sidebar a.current");
    if (cur) cur.scrollIntoView({ block: "center" });

    // Mobile menu
    var menuBtn = shell.querySelector(".menu-btn");
    var sidebar = document.getElementById("docs-sidebar");
    if (menuBtn && sidebar) {
      menuBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        sidebar.classList.toggle("open");
      });
      document.addEventListener("click", function (e) {
        if (sidebar.classList.contains("open") && !sidebar.contains(e.target)) {
          sidebar.classList.remove("open");
        }
      });
    }
  }

  /* ---------------- Breadcrumb ---------------- */
  if (article && current && current.id !== "index") {
    var bc = document.createElement("div");
    bc.className = "doc-breadcrumb";
    bc.innerHTML =
      '<a href="/docs/" style="color:inherit;border:none">Handbook</a> / <b>' +
      current.section + "</b> / " + current.title;
    article.insertBefore(bc, article.firstChild);
  }

  /* ---------------- Prev / next ---------------- */
  if (article && current) {
    var idx = FLAT.indexOf(current);
    var prev = idx > 0 ? FLAT[idx - 1] : null;
    var next = idx < FLAT.length - 1 ? FLAT[idx + 1] : null;
    if (prev || next) {
      var nav = document.createElement("div");
      nav.className = "doc-footer-nav";
      nav.innerHTML =
        (prev
          ? '<a class="doc-nav-card prev" href="/docs/' + prev.file + '"><span class="dnc-label">← Previous</span><span class="dnc-title">' + prev.title + "</span></a>"
          : "") +
        (next
          ? '<a class="doc-nav-card next" href="/docs/' + next.file + '"><span class="dnc-label">Next →</span><span class="dnc-title">' + next.title + "</span></a>"
          : "");
      article.appendChild(nav);
    }
  }

  /* ---------------- TOC ---------------- */
  var main = document.querySelector(".doc-main");
  if (article && main && current && current.id !== "index") {
    var heads = article.querySelectorAll("h2, h3");
    if (heads.length >= 2) {
      var toc = document.createElement("aside");
      toc.className = "doc-toc";
      var links = [];
      heads.forEach(function (h, i) {
        if (!h.id) {
          h.id = h.textContent.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "h" + i;
        }
        links.push('<a href="#' + h.id + '" class="' + h.tagName.toLowerCase() + '">' + h.textContent + "</a>");
      });
      toc.innerHTML = "<h6>On this page</h6>" + links.join("");
      main.appendChild(toc);

      // Scroll-spy
      var tocLinks = toc.querySelectorAll("a");
      var spy = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (e) {
            if (e.isIntersecting) {
              tocLinks.forEach(function (l) {
                l.classList.toggle("active", l.getAttribute("href") === "#" + e.target.id);
              });
            }
          });
        },
        { rootMargin: "-80px 0px -70% 0px" }
      );
      heads.forEach(function (h) { spy.observe(h); });
    }
  }

  /* ---------------- Search ---------------- */
  var input = document.getElementById("docs-search-input");
  var results = document.getElementById("search-results");
  var selIndex = -1;

  function escapeHtml(s) {
    return s.replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  function runSearch(q) {
    q = q.trim().toLowerCase();
    selIndex = -1;
    if (!q) { results.classList.remove("open"); results.innerHTML = ""; return; }
    var terms = q.split(/\s+/);
    var scored = FLAT.filter(function (p) { return p.id !== "index"; })
      .map(function (p) {
        var hay = (p.title + " " + p.desc + " " + p.keywords + " " + p.section).toLowerCase();
        var score = 0;
        var all = terms.every(function (t) {
          if (hay.indexOf(t) === -1) return false;
          if (p.title.toLowerCase().indexOf(t) !== -1) score += 6;
          if (p.keywords.indexOf(t) !== -1) score += 3;
          score += 1;
          return true;
        });
        return all ? { p: p, score: score } : null;
      })
      .filter(Boolean)
      .sort(function (a, b) { return b.score - a.score; })
      .slice(0, 8);

    if (!scored.length) {
      results.innerHTML = '<div class="sr-none">No pages match “' + escapeHtml(q) + '”.</div>';
    } else {
      results.innerHTML = scored.map(function (r) {
        var t = escapeHtml(r.p.title);
        terms.forEach(function (term) {
          var re = new RegExp("(" + term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "ig");
          t = t.replace(re, "<em>$1</em>");
        });
        return (
          '<a href="/docs/' + r.p.file + '">' +
          '<span class="sr-section">' + r.p.section + "</span>" +
          '<div class="sr-title">' + t + "</div>" +
          '<div class="sr-desc">' + escapeHtml(r.p.desc) + "</div></a>"
        );
      }).join("");
    }
    results.classList.add("open");
  }

  if (input && results) {
    input.addEventListener("input", function () { runSearch(input.value); });
    input.addEventListener("keydown", function (e) {
      var items = results.querySelectorAll("a");
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        if (!items.length) return;
        selIndex = e.key === "ArrowDown"
          ? (selIndex + 1) % items.length
          : (selIndex - 1 + items.length) % items.length;
        items.forEach(function (it, i) { it.classList.toggle("sel", i === selIndex); });
        items[selIndex].scrollIntoView({ block: "nearest" });
      } else if (e.key === "Enter" && selIndex >= 0 && items[selIndex]) {
        window.location.href = items[selIndex].href;
      } else if (e.key === "Escape") {
        input.blur();
        results.classList.remove("open");
      }
    });
    document.addEventListener("click", function (e) {
      if (!e.target.closest(".docs-search")) results.classList.remove("open");
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "/" && document.activeElement !== input &&
          !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) {
        e.preventDefault();
        input.focus();
      }
    });
  }
})();
