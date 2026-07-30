/* Chapter Vision — site interactions */
(function () {
  "use strict";

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Nav scroll state ---- */
  const nav = document.querySelector(".nav");
  if (nav) {
    const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---- Headline word reveal: wrap [data-words] words in staggered spans.
         Text nodes split per word; element children (the gradient <em>)
         animate as one unit so background-clip: text stays intact. ---- */
  if (!reduced) {
    document.querySelectorAll("[data-words]").forEach((h) => {
      [...h.childNodes].forEach((child) => {
        if (child.nodeType === 3) {
          const frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach((piece) => {
            if (!piece) return;
            if (/^\s+$/.test(piece)) {
              frag.appendChild(document.createTextNode(piece));
            } else {
              const s = document.createElement("span");
              s.className = "w";
              s.textContent = piece;
              frag.appendChild(s);
            }
          });
          h.replaceChild(frag, child);
        } else if (child.nodeType === 1 && child.tagName !== "BR") {
          child.classList.add("w");
        }
      });
      let i = 0;
      h.querySelectorAll(".w").forEach((s) => {
        s.style.setProperty("--wd", (i++ * 0.055).toFixed(3) + "s");
      });
    });
  }

  /* ---- Scroll reveal ---- */
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add("in-view");
          io.unobserve(e.target);
        }
      }
    },
    { threshold: 0.18, rootMargin: "0px 0px -40px 0px" }
  );
  document.querySelectorAll(".reveal, [data-words]").forEach((el) => io.observe(el));

  /* ---- Chapter rail: show after hero, spotlight the current section ---- */
  const rail = document.querySelector(".rail");
  if (rail) {
    const links = [...rail.querySelectorAll("a")];
    const byId = {};
    links.forEach((a) => { byId[a.getAttribute("href").slice(1)] = a; });

    const spy = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            links.forEach((a) => a.classList.remove("active"));
            const link = byId[e.target.id];
            if (link) link.classList.add("active");
          }
        }
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    Object.keys(byId).forEach((id) => {
      const sec = document.getElementById(id);
      if (sec) spy.observe(sec);
    });

    const hero = document.querySelector(".hero");
    const railVis = () => {
      const past = hero ? window.scrollY > hero.offsetHeight * 0.6 : true;
      const beforeFooter = window.scrollY + window.innerHeight <
        document.body.scrollHeight - (document.querySelector("footer")?.offsetHeight || 0);
      rail.classList.toggle("visible", past && beforeFooter);
    };
    window.addEventListener("scroll", railVis, { passive: true });
    railVis();
  }

  /* ---- Scroll scrubbing: progress bar, hero fade, film scale, parallax ---- */
  const progressBar = document.getElementById("progress-bar");
  const heroInner = document.getElementById("hero-inner");
  const scrubs = [...document.querySelectorAll("[data-scrub]")];
  const parallaxEls = [...document.querySelectorAll("[data-parallax]")];

  if (!reduced && (progressBar || heroInner || scrubs.length || parallaxEls.length)) {
    let ticking = false;
    const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);

    const update = () => {
      ticking = false;
      const vh = window.innerHeight;
      const max = document.body.scrollHeight - vh;

      if (progressBar) {
        progressBar.style.transform = "scaleX(" + (max > 0 ? clamp01(window.scrollY / max) : 0) + ")";
      }
      if (heroInner) {
        heroInner.style.setProperty("--hero-p", clamp01(window.scrollY / (vh * 0.8)).toFixed(4));
      }
      for (const el of scrubs) {
        const r = el.getBoundingClientRect();
        if (r.bottom < -80 || r.top > vh + 80) continue;
        // 0 when the frame's top touches the viewport bottom → 1 once it is
        // ~55% of the way in. Eased by the CSS transition on transform.
        const p = clamp01((vh - r.top) / (vh * 0.55));
        el.style.setProperty("--p", p.toFixed(4));
      }
      for (const el of parallaxEls) {
        const f = parseFloat(el.dataset.parallax) || 0;
        el.style.translate = "0 " + (window.scrollY * f).toFixed(1) + "px";
      }
    };
    const onScroll = () => {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    update();
  } else {
    // Reduced motion: pin everything to its settled state.
    scrubs.forEach((el) => el.style.setProperty("--p", "1"));
    if (progressBar) progressBar.style.display = "none";
  }

  /* ---- Hero canvas: drifting spatial dust + constellation ---- */
  const heroCanvas = document.getElementById("hero-canvas");
  if (heroCanvas && !reduced) {
    const ctx = heroCanvas.getContext("2d");
    let w, h, dpr, pts;
    let mouse = { x: -9999, y: -9999 };

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = heroCanvas.clientWidth;
      h = heroCanvas.clientHeight;
      heroCanvas.width = w * dpr;
      heroCanvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(130, Math.floor((w * h) / 16000));
      pts = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        z: 0.3 + Math.random() * 0.7, // depth → size + speed
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.12,
        tw: Math.random() * Math.PI * 2,
      }));
    }

    window.addEventListener("resize", resize);
    heroCanvas.parentElement.addEventListener("pointermove", (e) => {
      const r = heroCanvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    });
    heroCanvas.parentElement.addEventListener("pointerleave", () => {
      mouse.x = -9999; mouse.y = -9999;
    });
    resize();

    let t = 0;
    function frame() {
      t += 0.008;
      ctx.clearRect(0, 0, w, h);

      for (const p of pts) {
        p.x += p.vx * p.z + Math.sin(t + p.tw) * 0.05;
        p.y += p.vy * p.z + Math.cos(t * 0.7 + p.tw) * 0.05;
        if (p.x < -10) p.x = w + 10; if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10; if (p.y > h + 10) p.y = -10;

        // gentle repulsion from cursor
        const dx = p.x - mouse.x, dy = p.y - mouse.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 14400) {
          const d = Math.sqrt(d2) || 1;
          const f = (120 - d) / 120;
          p.x += (dx / d) * f * 1.4;
          p.y += (dy / d) * f * 1.4;
        }

        const alpha = 0.25 + 0.45 * Math.abs(Math.sin(t * 1.4 + p.tw));
        const r = 0.6 + p.z * 1.5;
        const warm = p.tw % (Math.PI * 2) > Math.PI;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fillStyle = warm
          ? `rgba(243, 207, 154, ${alpha * p.z})`
          : `rgba(160, 140, 255, ${alpha * p.z * 0.8})`;
        ctx.fill();
      }

      // constellation lines between close, deep points
      ctx.lineWidth = 0.5;
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const a = pts[i], b = pts[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 9000) {
            const o = (1 - d2 / 9000) * 0.13 * a.z * b.z;
            ctx.strokeStyle = `rgba(200, 180, 255, ${o})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(frame);
    }
    frame();
  }
})();
