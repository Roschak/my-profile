/* ParticleField.jsx */
"use client";

import { useEffect, useRef } from "react";

const PARTICLE_COUNT = 420;
const DRAGON_DURATION = 11200;
const SCATTER_DURATION = 3400;
const BASE_LINK_DISTANCE = 62;
const CURSOR_TRIGGER_DISTANCE = 130;

const randomBetween = (min, max) => Math.random() * (max - min) + min;

const rotatePoint = (x, y, angle) => ({
  x: x * Math.cos(angle) - y * Math.sin(angle),
  y: x * Math.sin(angle) + y * Math.cos(angle)
});

export default function ParticleField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    let width = 0;
    let height = 0;
    let animationFrame;
    let particles = [];

    let mode = "dragon";
    let modeElapsed = 0;
    let lastDragonCenter = { x: 0, y: 0 };

    let mouse = { x: 0, y: 0, active: false };

    const resize = () => {
      const dpr = Math.max(window.devicePixelRatio || 1, 1);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const initParticles = () => {
      particles = Array.from({ length: PARTICLE_COUNT }).map((_, index) => ({
        x: randomBetween(0, width),
        y: randomBetween(0, height),
        vx: randomBetween(-0.4, 0.4),
        vy: randomBetween(-0.4, 0.4),
        r: randomBetween(1.0, 2.4),
        tx: null,
        ty: null,
        targetIndex: index
      }));
    };

    const scatterImpulse = (centerX, centerY) => {
      particles.forEach((p) => {
        const angle = Math.atan2(p.y - centerY, p.x - centerX) + randomBetween(-0.55, 0.55);
        const speed = randomBetween(0.9, 2.8);
        p.vx = Math.cos(angle) * speed;
        p.vy = Math.sin(angle) * speed;
        p.tx = null;
        p.ty = null;
      });
    };

    const enterDragonMode = () => {
      mode = "dragon";
      modeElapsed = 0;
    };

    const enterScatterMode = () => {
      mode = "scatter";
      modeElapsed = 0;
      scatterImpulse(lastDragonCenter.x || width * 0.5, lastDragonCenter.y || height * 0.5);
    };

    const buildDragonTargets = (timeSec) => {
      const targets = [];

      // Wide lissajous-style path so dragon travels toward all screen edges.
      const orbitX =
        Math.cos(timeSec * 0.12) * width * 0.34 + Math.sin(timeSec * 0.27) * width * 0.12;
      const orbitY =
        Math.sin(timeSec * 0.14) * height * 0.3 + Math.cos(timeSec * 0.24) * height * 0.12;
      const centerX = width * 0.5 + orbitX;
      const centerY = height * 0.5 + orbitY;
      lastDragonCenter = { x: centerX, y: centerY };

      const bodyHalfLength = Math.min(width * 0.32, 330);
      const rotation = Math.sin(timeSec * 0.11) * 0.46;

      const bodyPoints = 300;
      for (let i = 0; i < bodyPoints; i += 1) {
        const t = i / (bodyPoints - 1);
        const x = -bodyHalfLength + t * (bodyHalfLength * 2);
        const waveA = 42 * (1 - t * 0.48);
        const y = Math.sin(t * 9.5 * Math.PI + timeSec * 2.4) * waveA;
        const local = rotatePoint(x, y, rotation);
        targets.push({ x: centerX + local.x, y: centerY + local.y });
      }

      const headX = bodyHalfLength;
      const headY = Math.sin(9.5 * Math.PI + timeSec * 2.4) * 16;
      const headLocal = rotatePoint(headX, headY, rotation);
      const headCx = centerX + headLocal.x;
      const headCy = centerY + headLocal.y;

      const hornLeft = rotatePoint(headX + 18, headY - 28, rotation);
      const hornRight = rotatePoint(headX + 18, headY + 28, rotation);
      const whiskerTop = rotatePoint(headX + 36, headY - 10, rotation);
      const whiskerBottom = rotatePoint(headX + 36, headY + 10, rotation);

      for (let i = 0; i < 64; i += 1) {
        const a = (i / 64) * Math.PI * 2;
        targets.push({ x: headCx + Math.cos(a) * 22, y: headCy + Math.sin(a) * 22 });
      }

      for (let i = 0; i < 28; i += 1) {
        const t = i / 27;
        targets.push({
          x: headCx + (hornLeft.x + Math.sin(t * Math.PI) * 8 - headCx) * t,
          y: headCy + (hornLeft.y - headCy) * t
        });
        targets.push({
          x: headCx + (hornRight.x + Math.sin(t * Math.PI) * 8 - headCx) * t,
          y: headCy + (hornRight.y - headCy) * t
        });
      }

      for (let i = 0; i < 36; i += 1) {
        const t = i / 35;
        targets.push({
          x: headCx + (whiskerTop.x + t * 24 - headCx) * t,
          y: headCy + (whiskerTop.y - Math.sin(t * Math.PI) * 9 - headCy) * t
        });
        targets.push({
          x: headCx + (whiskerBottom.x + t * 24 - headCx) * t,
          y: headCy + (whiskerBottom.y + Math.sin(t * Math.PI) * 9 - headCy) * t
        });
      }

      return targets;
    };

    const updateParticle = (p, seekingTarget) => {
      if (seekingTarget && p.tx !== null && p.ty !== null) {
        const dx = p.tx - p.x;
        const dy = p.ty - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const force = 0.12;
        p.vx += (dx / dist) * force;
        p.vy += (dy / dist) * force;
        p.vx *= 0.8;
        p.vy *= 0.8;
      } else {
        p.vx += randomBetween(-0.02, 0.02);
        p.vy += randomBetween(-0.02, 0.02);
        p.vx *= 0.993;
        p.vy *= 0.993;
      }

      p.vx = Math.max(-2.4, Math.min(2.4, p.vx));
      p.vy = Math.max(-2.4, Math.min(2.4, p.vy));

      p.x += p.vx;
      p.y += p.vy;

      if (p.x < -40) p.x = width + 40;
      if (p.x > width + 40) p.x = -40;
      if (p.y < -40) p.y = height + 40;
      if (p.y > height + 40) p.y = -40;
    };

    const maybeTriggerDragonFromCursor = () => {
      if (!mouse.active || mode !== "scatter") return;

      let nearestDistSq = Infinity;
      for (let i = 0; i < particles.length; i += 3) {
        const p = particles[i];
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < nearestDistSq) nearestDistSq = d2;
      }

      if (nearestDistSq < CURSOR_TRIGGER_DISTANCE * CURSOR_TRIGGER_DISTANCE) {
        enterDragonMode();
      }
    };

    const draw = (timestamp) => {
      modeElapsed += 16;
      const timeSec = timestamp * 0.001;

      if (mode === "dragon" && modeElapsed >= DRAGON_DURATION) {
        enterScatterMode();
      } else if (mode === "scatter" && modeElapsed >= SCATTER_DURATION) {
        enterDragonMode();
      }

      maybeTriggerDragonFromCursor();

      let dragonTargets = null;
      if (mode === "dragon") {
        dragonTargets = buildDragonTargets(timeSec);
        const targetCount = dragonTargets.length;
        particles.forEach((p, i) => {
          const idx = i % targetCount;
          p.targetIndex = idx;
          p.tx = dragonTargets[idx].x;
          p.ty = dragonTargets[idx].y;
        });
      } else {
        particles.forEach((p) => {
          p.tx = null;
          p.ty = null;
        });
      }

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i += 1) {
        const p = particles[i];
        updateParticle(p, mode === "dragon");

        ctx.beginPath();
        ctx.fillStyle = mode === "dragon" ? "rgba(122, 255, 218, 0.82)" : "rgba(98, 234, 197, 0.66)";
        ctx.shadowColor = "rgba(123, 255, 219, 0.55)";
        ctx.shadowBlur = mode === "dragon" ? 11 : 7;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.shadowBlur = 0;

      const linkDistance = mode === "dragon" ? 34 : BASE_LINK_DISTANCE;
      for (let i = 0; i < particles.length; i += 1) {
        for (let j = i + 1; j < particles.length; j += 1) {
          const a = particles[i];
          const b = particles[j];

          if (mode === "dragon") {
            const indexGap = Math.abs(a.targetIndex - b.targetIndex);
            if (indexGap > 7 && indexGap < particles.length - 7) continue;
          }

          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist >= linkDistance) continue;

          const alpha = (1 - dist / linkDistance) * (mode === "dragon" ? 0.62 : 0.08);
          ctx.beginPath();
          ctx.strokeStyle = `rgba(124, 255, 220, ${alpha})`;
          ctx.lineWidth = mode === "dragon" ? 1.2 : 0.8;
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      animationFrame = window.requestAnimationFrame(draw);
    };

    const onMouseMove = (event) => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
      mouse.active = true;
    };

    const onMouseLeave = () => {
      mouse.active = false;
    };

    resize();
    initParticles();
    animationFrame = window.requestAnimationFrame(draw);

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseleave", onMouseLeave);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
      window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  return <canvas className="particle-canvas" ref={canvasRef} aria-hidden="true" />;
}
