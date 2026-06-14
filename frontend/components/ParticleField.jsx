/* ParticleField.jsx — Cinematic Jazz Night Sky */
"use client";

import { useEffect, useRef } from "react";

export default function ParticleField({ onMoonChange }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let width = 0;
    let height = 0;
    let raf = null;

    // ── Easing ──────────────────────────────────────────────
    const easeInOutCubic = (t) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);
    const easeInOutSine = (t) => -(Math.cos(Math.PI * t) - 1) / 2;

    // ── Star layers ──────────────────────────────────────────
    const starLayers = [
      { count: 70, depth: 0.2, sizeRange: [0.15, 0.5], opacityBase: 0.3 },
      { count: 50, depth: 0.5, sizeRange: [0.4, 0.9], opacityBase: 0.5 },
      { count: 35, depth: 0.85, sizeRange: [0.7, 1.5], opacityBase: 0.75 }
    ];
    let allStars = [];
    let fallingStars = [];
    let dustParticles = [];

    // ── Shooting stars pool ──────────────────────────────────
    // Multiple autonomous shooting stars, diagonal upper-right → lower-left
    const shootingStarPool = [];
    const MAX_SHOOTING = 3;

    const spawnShootingStar = () => {
      if (shootingStarPool.length >= MAX_SHOOTING) return;
      // Start from upper-right quadrant
      const startX = width * (0.55 + Math.random() * 0.45);
      const startY = height * (Math.random() * 0.3);
      // Direction: upper-right → lower-left
      // Canvas Y axis: positive = DOWN. So vy must be POSITIVE to go down.
      // vx must be NEGATIVE to go left.
      const speed = 7 + Math.random() * 7;
      const spread = (Math.random() - 0.5) * 0.4; // slight angle variation
      shootingStarPool.push({
        x: startX,
        y: startY,
        vx: -(speed * (0.7 + Math.abs(spread))),   // always negative = left
        vy: (speed * (0.55 + spread)),             // always positive = down
        life: 1,
        decay: 0.011 + Math.random() * 0.007,
        trailLen: 90 + Math.random() * 90,
        width: 1.5 + Math.random() * 2,
        hue: Math.random() < 0.5 ? "gold" : "blue"
      });
    };

    // Spawn interval — random between 2–6 s
    let nextSpawn = 2 + Math.random() * 4;
    let spawnTimer = 0;

    // ── Star system ──────────────────────────────────────────
    const createStarSystem = () => {
      allStars = [];
      starLayers.forEach((layer) => {
        for (let i = 0; i < layer.count; i++) {
          allStars.push({
            x: Math.random() * width,
            y: Math.random() * height,
            r: layer.sizeRange[0] + Math.random() * (layer.sizeRange[1] - layer.sizeRange[0]),
            phase: Math.random() * Math.PI * 2,
            twinkleSpd: 0.15 + Math.random() * 0.35,
            driftSpd: 0.004 + Math.random() * 0.006,
            depth: layer.depth,
            opacityBase: layer.opacityBase,
            hue: Math.random() < 0.08 ? "violet" : Math.random() < 0.12 ? "blue" : "gold",
            isDying: false
          });
        }
      });

      dustParticles = [];
      for (let i = 0; i < 28; i++) {
        dustParticles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          r: 0.08 + Math.random() * 0.28,
          vy: 0.008 + Math.random() * 0.018,
          vx: (Math.random() - 0.5) * 0.01,
          opacity: 0.04 + Math.random() * 0.12,
          phase: Math.random() * Math.PI * 2
        });
      }
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      createStarSystem();
    };

    // ── Background ───────────────────────────────────────────
    const drawBackground = () => {
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, "#040508");
      grad.addColorStop(0.3, "#07090f");
      grad.addColorStop(0.65, "#0a0c14");
      grad.addColorStop(1, "#050608");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Nebula wisps
      const n1 = ctx.createRadialGradient(
        width * 0.18, height * 0.28, 0,
        width * 0.18, height * 0.28, width * 0.55
      );
      n1.addColorStop(0, "rgba(147,85,247,0.045)");
      n1.addColorStop(1, "rgba(96,165,250,0)");
      ctx.fillStyle = n1;
      ctx.fillRect(0, 0, width, height);

      const n2 = ctx.createRadialGradient(
        width * 0.78, height * 0.6, 0,
        width * 0.78, height * 0.6, width * 0.45
      );
      n2.addColorStop(0, "rgba(212,175,55,0.03)");
      n2.addColorStop(1, "rgba(147,85,247,0)");
      ctx.fillStyle = n2;
      ctx.fillRect(0, 0, width, height);

      // Vignette
      const vig = ctx.createRadialGradient(
        width * 0.5, height * 0.38, 0,
        width * 0.5, height * 0.38, Math.hypot(width, height) * 0.72
      );
      vig.addColorStop(0, "rgba(0,0,0,0)");
      vig.addColorStop(0.75, "rgba(0,0,0,0.12)");
      vig.addColorStop(1, "rgba(0,0,0,0.45)");
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, width, height);
    };

    // ── Dust ─────────────────────────────────────────────────
    const drawDust = (t) => {
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      for (const d of dustParticles) {
        d.y += d.vy;
        d.x += d.vx;
        if (d.y > height + 4) d.y = -4;
        if (d.x < -4) d.x = width + 4;
        if (d.x > width + 4) d.x = -4;

        const wobble = Math.sin(t * 0.25 + d.phase) * 0.6;
        const px = d.x + wobble;
        const g = ctx.createRadialGradient(px, d.y, 0, px, d.y, d.r * 6);
        g.addColorStop(0, `rgba(255,255,255,${d.opacity})`);
        g.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(px, d.y, d.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    };

    // ── Stars ────────────────────────────────────────────────
    const drawStars = (t) => {
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      const colors = {
        gold: ["rgba(255,248,215,", "rgba(212,175,55,"],
        blue: ["rgba(215,235,255,", "rgba(96,165,250,"],
        violet: ["rgba(235,215,255,", "rgba(168,85,247,"]
      };

      for (const s of allStars) {
        if (s.isDying) continue;
        const twinkle = 0.3 + Math.sin(t * s.twinkleSpd + s.phase) * 0.7;
        const driftX = Math.sin(t * s.driftSpd * s.depth + s.phase) * s.depth * 3;
        const driftY = Math.cos(t * s.driftSpd * 0.7 * s.depth + s.phase) * s.depth * 2;
        const x = s.x + driftX;
        const y = s.y + driftY;
        const c = colors[s.hue];
        const glowR = s.r * (8 + s.depth * 6);

        const g = ctx.createRadialGradient(x, y, 0, x, y, glowR);
        g.addColorStop(0, `${c[0]}${(twinkle * s.opacityBase).toFixed(3)})`);
        g.addColorStop(0.2, `rgba(255,255,255,${(twinkle * s.opacityBase * 0.55).toFixed(3)})`);
        g.addColorStop(0.65, `${c[1]}${(twinkle * s.opacityBase * 0.18).toFixed(3)})`);
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, s.r * (0.6 + twinkle * 0.55), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    };

    // ── Click-launched falling stars ─────────────────────────
    const drawFallingStars = () => {
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      for (let i = fallingStars.length - 1; i >= 0; i--) {
        const fs = fallingStars[i];
        fs.vy += 0.18;
        fs.vx *= 0.985;
        fs.x += fs.vx;
        fs.y += fs.vy;
        fs.life -= 0.022;
        fs.trailLength = fs.trailLength * 0.93 + 12;

        if (fs.life <= 0) { fallingStars.splice(i, 1); continue; }

        const angle = Math.atan2(fs.vy, fs.vx);
        const tx = fs.x - Math.cos(angle) * fs.trailLength;
        const ty = fs.y - Math.sin(angle) * fs.trailLength;

        const tg = ctx.createLinearGradient(tx, ty, fs.x, fs.y);
        tg.addColorStop(0, "rgba(212,175,55,0)");
        tg.addColorStop(0.35, `rgba(96,165,250,${fs.life * 0.35})`);
        tg.addColorStop(0.8, `rgba(255,248,200,${fs.life * 0.65})`);
        tg.addColorStop(1, `rgba(255,255,255,${fs.life * 0.85})`);
        ctx.strokeStyle = tg;
        ctx.lineWidth = fs.r * 2.2;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(fs.x, fs.y);
        ctx.stroke();

        const cg = ctx.createRadialGradient(fs.x, fs.y, 0, fs.x, fs.y, fs.r * 9);
        cg.addColorStop(0, `rgba(255,252,230,${fs.life * 0.9})`);
        cg.addColorStop(1, "rgba(212,175,55,0)");
        ctx.fillStyle = cg;
        ctx.beginPath();
        ctx.arc(fs.x, fs.y, fs.r * 1.4, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    };

    // ── Autonomous shooting stars (diagonal UR→LL) ───────────
    const drawShootingStars = (dt) => {
      ctx.save();
      ctx.globalCompositeOperation = "screen";

      spawnTimer += dt;
      if (spawnTimer >= nextSpawn) {
        spawnShootingStar();
        spawnTimer = 0;
        nextSpawn = 2 + Math.random() * 5;
      }

      for (let i = shootingStarPool.length - 1; i >= 0; i--) {
        const ss = shootingStarPool[i];
        ss.x += ss.vx;
        ss.y += ss.vy;
        ss.life -= ss.decay;

        if (ss.life <= 0 || ss.x < -100 || ss.y > height + 100) {
          shootingStarPool.splice(i, 1);
          continue;
        }

        const fade = easeOutQuart(ss.life);
        const tx = ss.x - ss.vx / ss.decay * ss.trailLen * 0.012;
        const ty = ss.y - ss.vy / ss.decay * ss.trailLen * 0.012;

        const isGold = ss.hue === "gold";
        const tg = ctx.createLinearGradient(tx, ty, ss.x, ss.y);
        tg.addColorStop(0, "rgba(0,0,0,0)");
        tg.addColorStop(0.3, isGold
          ? `rgba(212,175,55,${fade * 0.3})`
          : `rgba(96,165,250,${fade * 0.3})`);
        tg.addColorStop(0.75, isGold
          ? `rgba(255,240,180,${fade * 0.7})`
          : `rgba(180,220,255,${fade * 0.7})`);
        tg.addColorStop(1, `rgba(255,255,255,${fade * 0.95})`);

        ctx.strokeStyle = tg;
        ctx.lineWidth = ss.width * (0.5 + fade * 0.5);
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(ss.x, ss.y);
        ctx.stroke();

        // Core glow
        const cg = ctx.createRadialGradient(ss.x, ss.y, 0, ss.x, ss.y, ss.width * 8);
        cg.addColorStop(0, `rgba(255,255,255,${fade * 0.9})`);
        cg.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = cg;
        ctx.beginPath();
        ctx.arc(ss.x, ss.y, ss.width * 1.2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    };

    // ── Moon ─────────────────────────────────────────────────
    // Smooth arc path across sky — no teleport, no snap
    // moonT: 0→1 over ~120s. Moon glides from right edge → left edge
    // in a gentle arc. Phase: full (0–0.45), transition (0.45–0.55), crescent (0.55–1)
    const drawMoon = (t) => {
      ctx.save();

      const cycleLen = 120; // seconds per full cycle
      const moonT = (t % cycleLen) / cycleLen; // 0→1

      // Smooth arc: x goes right→left, y dips slightly in middle
      const arcX = width * (0.92 - moonT * 0.84);
      const arcY = height * (0.12 + Math.sin(moonT * Math.PI) * 0.06);

      // Gentle float on top of arc
      const floatY = Math.sin(t * 0.18) * 4;
      const moonX = arcX;
      const moonY = arcY + floatY;

      // Phase blend: 0–0.42 = full, 0.42–0.58 = transition, 0.58–1 = crescent
      const phaseBlend = moonT < 0.42 ? 0
        : moonT > 0.58 ? 1
          : easeInOutSine((moonT - 0.42) / 0.16);

      // Moon size — slightly smaller so it feels more distant
      const baseR = Math.min(width, height) * 0.072;

      // ── Atmosphere halo ──
      ctx.globalCompositeOperation = "lighter";
      const haloColor = phaseBlend < 0.5
        ? `rgba(255,248,220,${0.18 * (1 - phaseBlend)})`
        : `rgba(212,175,55,${0.14 * phaseBlend})`;
      const halo = ctx.createRadialGradient(moonX, moonY, 0, moonX, moonY, baseR * 2.8);
      halo.addColorStop(0, haloColor);
      halo.addColorStop(0.5, phaseBlend < 0.5
        ? `rgba(212,175,55,${0.07 * (1 - phaseBlend)})`
        : `rgba(147,85,247,${0.06 * phaseBlend})`);
      halo.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(moonX, moonY, baseR * 2.6, 0, Math.PI * 2);
      ctx.fill();

      // ── Full moon body ──
      if (phaseBlend < 1) {
        ctx.globalCompositeOperation = "lighter";
        const alpha = 1 - phaseBlend;

        const body = ctx.createRadialGradient(
          moonX - baseR * 0.18, moonY - baseR * 0.18, 0,
          moonX, moonY, baseR * 1.15
        );
        body.addColorStop(0, `rgba(255,253,248,${alpha})`);
        body.addColorStop(0.55, `rgba(248,238,215,${alpha * 0.96})`);
        body.addColorStop(0.82, `rgba(225,205,158,${alpha * 0.82})`);
        body.addColorStop(1, `rgba(185,155,85,${alpha * 0.28})`);
        ctx.fillStyle = body;
        ctx.beginPath();
        ctx.arc(moonX, moonY, baseR, 0, Math.PI * 2);
        ctx.fill();

        // Rim light
        const rim = ctx.createRadialGradient(
          moonX + baseR * 0.28, moonY - baseR * 0.28, baseR * 0.78,
          moonX, moonY, baseR * 1.08
        );
        rim.addColorStop(0, "rgba(168,210,255,0)");
        rim.addColorStop(0.7, `rgba(168,210,255,${alpha * 0.12})`);
        rim.addColorStop(1, `rgba(168,210,255,${alpha * 0.06})`);
        ctx.fillStyle = rim;
        ctx.beginPath();
        ctx.arc(moonX, moonY, baseR * 1.04, 0, Math.PI * 2);
        ctx.fill();

        // Subtle surface texture
        ctx.globalCompositeOperation = "source-over";
        ctx.fillStyle = `rgba(195,178,138,${alpha * 0.06})`;
        for (let i = 0; i < 12; i++) {
          const a = (i / 12) * Math.PI * 2;
          const r = baseR * (0.38 + Math.sin(a * 3 + t * 0.08) * 0.18);
          const cx = moonX + Math.cos(a) * r;
          const cy = moonY + Math.sin(a) * r * 0.62;
          ctx.beginPath();
          ctx.arc(cx, cy, baseR * 0.038, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // ── Crescent moon body ──
      if (phaseBlend > 0) {
        const alpha = phaseBlend;

        // Crescent body
        ctx.globalCompositeOperation = "source-over";
        const cBody = ctx.createLinearGradient(
          moonX - baseR, moonY,
          moonX + baseR, moonY
        );
        cBody.addColorStop(0, `rgba(255,253,248,${alpha * 0.92})`);
        cBody.addColorStop(0.55, `rgba(242,232,205,${alpha * 0.94})`);
        cBody.addColorStop(1, `rgba(222,202,162,${alpha * 0.88})`);
        ctx.fillStyle = cBody;
        ctx.beginPath();
        ctx.arc(moonX, moonY, baseR, 0, Math.PI * 2);
        ctx.fill();

        // Cut shadow to make crescent
        ctx.globalCompositeOperation = "destination-out";
        ctx.fillStyle = `rgba(0,0,0,${alpha})`;
        ctx.beginPath();
        ctx.arc(moonX + baseR * 0.52, moonY, baseR * 0.96, 0, Math.PI * 2);
        ctx.fill();

        // Crescent rim glow
        ctx.globalCompositeOperation = "lighter";
        const cRim = ctx.createRadialGradient(
          moonX - baseR * 0.55, moonY - baseR * 0.38, baseR * 0.55,
          moonX, moonY, baseR * 1.12
        );
        cRim.addColorStop(0, `rgba(200,225,255,${alpha * 0.18})`);
        cRim.addColorStop(0.5, `rgba(147,85,247,${alpha * 0.1})`);
        cRim.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = cRim;
        ctx.beginPath();
        ctx.arc(moonX, moonY, baseR * 1.06, 0, Math.PI * 2);
        ctx.fill();

        // Gold aura for crescent
        ctx.globalCompositeOperation = "lighter";
        const cAura = ctx.createRadialGradient(moonX, moonY, baseR * 0.4, moonX, moonY, baseR * 2.2);
        cAura.addColorStop(0, `rgba(212,175,55,${alpha * 0.16})`);
        cAura.addColorStop(0.5, `rgba(147,85,247,${alpha * 0.08})`);
        cAura.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = cAura;
        ctx.beginPath();
        ctx.arc(moonX, moonY, baseR * 2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    };

    // ── Clouds ───────────────────────────────────────────────
    const drawClouds = (t) => {
      ctx.save();
      ctx.globalCompositeOperation = "lighter";

      const drawCloud = (cx, cy, size, opacity) => {
        ctx.globalAlpha = opacity;
        ctx.fillStyle = "rgba(190,210,255,0.55)";
        const puffs = [
          [-0.44, 0, 0.38], [-0.1, -0.1, 0.44],
          [0.34, 0, 0.36], [0.05, 0.14, 0.3]
        ];
        for (const [dx, dy, r] of puffs) {
          ctx.beginPath();
          ctx.arc(cx + dx * size, cy + dy * size, r * size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      };

      const lx = width * 0.14 + Math.sin(t * 0.038 + 1) * 9;
      const ly = height * 0.28 + Math.cos(t * 0.032 + 1) * 5;
      drawCloud(lx, ly, width * 0.12, 0.1 + Math.sin(t * 0.05) * 0.04);

      const rx = width * 0.86 + Math.sin(t * 0.042 + 2) * 11;
      const ry = height * 0.3 + Math.cos(t * 0.038 + 2) * 6;
      drawCloud(rx, ry, width * 0.14, 0.1 + Math.cos(t * 0.05) * 0.04);

      ctx.restore();
    };

    // ── Main loop ────────────────────────────────────────────
    let lastT = 0;
    const frame = (ts) => {
      const t = ts * 0.001;
      const dt = t - lastT;
      lastT = t;

      ctx.clearRect(0, 0, width, height);
      drawBackground();
      drawDust(t);
      drawStars(t);
      drawFallingStars();
      drawShootingStars(dt);
      drawClouds(t);
      drawMoon(t);

      raf = window.requestAnimationFrame(frame);
    };

    // ── Click → launch star ──────────────────────────────────
    const onCanvasClick = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      for (let i = allStars.length - 1; i >= 0; i--) {
        const s = allStars[i];
        const dx = x - s.x;
        const dy = y - s.y;
        if (Math.hypot(dx, dy) < s.r * 20) {
          fallingStars.push({
            x: s.x, y: s.y,
            vx: -(2 + Math.random() * 2.5),        // left
            vy: (3.5 + Math.random() * 2.5),      // down
            r: s.r,
            life: 1,
            trailLength: 8,
            hue: s.hue
          });
          s.isDying = true;
          allStars.splice(i, 1);
          break;
        }
      }
    };

    resize();
    raf = window.requestAnimationFrame(frame);
    window.addEventListener("resize", resize);
    canvas.addEventListener("click", onCanvasClick);

    return () => {
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("click", onCanvasClick);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [onMoonChange]);

  return (
    <canvas
      className="particle-canvas"
      ref={canvasRef}
      aria-hidden="true"
      style={{ cursor: "crosshair" }}
    />
  );
}
