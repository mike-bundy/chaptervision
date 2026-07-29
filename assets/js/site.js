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
  document.querySelectorAll(".reveal, .graph-wrap").forEach((el) => io.observe(el));

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

  /* ---- Particle emitter demo ---- */
  const pc = document.getElementById("particle-canvas");
  if (pc && !reduced) {
    const ctx = pc.getContext("2d");
    let w, h, dpr;
    const parts = [];

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = pc.clientWidth; h = pc.clientHeight;
      pc.width = w * dpr; pc.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    window.addEventListener("resize", resize);
    resize();

    let running = false;
    const pio = new IntersectionObserver((es) => {
      running = es[0].isIntersecting;
    }, { threshold: 0.1 });
    pio.observe(pc);

    function spawn() {
      const cx = w / 2, cy = h * 0.78;
      const ang = -Math.PI / 2 + (Math.random() - 0.5) * 0.9; // spread cone
      const speed = 1.2 + Math.random() * 2.4;
      parts.push({
        x: cx + (Math.random() - 0.5) * 30,
        y: cy,
        vx: Math.cos(ang) * speed,
        vy: Math.sin(ang) * speed,
        life: 1,
        decay: 0.004 + Math.random() * 0.008,
        size: 1.5 + Math.random() * 3,
        hue: Math.random() < 0.7 ? 34 + Math.random() * 14 : 250, // gold or periwinkle
        spin: (Math.random() - 0.5) * 0.06,
      });
    }

    function frame() {
      if (running) {
        for (let i = 0; i < 4; i++) spawn();
        ctx.clearRect(0, 0, w, h);
        ctx.globalCompositeOperation = "lighter";
        for (let i = parts.length - 1; i >= 0; i--) {
          const p = parts[i];
          p.life -= p.decay;
          if (p.life <= 0) { parts.splice(i, 1); continue; }
          // vortex-ish curl + slight gravity fade
          const ang = Math.atan2(p.vy, p.vx) + p.spin;
          const sp = Math.hypot(p.vx, p.vy) * 0.996;
          p.vx = Math.cos(ang) * sp;
          p.vy = Math.sin(ang) * sp + -0.004;
          p.x += p.vx; p.y += p.vy;
          const a = p.life * p.life * 0.85;
          const s = p.size * (0.4 + p.life);
          const sat = p.hue > 100 ? 80 : 95;
          ctx.beginPath();
          ctx.arc(p.x, p.y, s, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${p.hue}, ${sat}%, ${55 + p.life * 20}%, ${a})`;
          ctx.fill();
        }
        ctx.globalCompositeOperation = "source-over";
      }
      requestAnimationFrame(frame);
    }
    frame();
  }
})();
