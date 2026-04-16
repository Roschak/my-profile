"use client";

import { useEffect, useRef } from "react";

const PARTICLE_COUNT = 70;
const TAG_PARTICLE_COUNT = 9;
const TECH_TAGS = ["JS", "TS", "PY", "PHP", "GO", "SQL", "HTML", "CSS", "NODE"];

export default function ParticleField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationFrame;
    let width = 0;
    let height = 0;
    let particles = [];
    let tagParticles = [];

    const randomBetween = (min, max) => Math.random() * (max - min) + min;

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
      particles = Array.from({ length: PARTICLE_COUNT }).map(() => ({
        x: randomBetween(0, width),
        y: randomBetween(0, height),
        vx: randomBetween(-0.35, 0.35),
        vy: randomBetween(-0.35, 0.35),
        r: randomBetween(1.1, 2.6)
      }));

      tagParticles = Array.from({ length: TAG_PARTICLE_COUNT }).map((_, index) => ({
        x: randomBetween(0, width),
        y: randomBetween(0, height),
        vx: randomBetween(-0.22, 0.22),
        vy: randomBetween(-0.22, 0.22),
        label: TECH_TAGS[index % TECH_TAGS.length]
      }));
    };

    const moveParticle = (item) => {
      item.x += item.vx;
      item.y += item.vy;

      if (item.x <= -24) item.x = width + 24;
      if (item.x >= width + 24) item.x = -24;
      if (item.y <= -24) item.y = height + 24;
      if (item.y >= height + 24) item.y = -24;
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i += 1) {
        const p = particles[i];
        moveParticle(p);

        ctx.beginPath();
        ctx.fillStyle = "rgba(86, 255, 194, 0.75)";
        ctx.shadowColor = "rgba(86, 255, 194, 0.5)";
        ctx.shadowBlur = 8;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.shadowBlur = 0;

      for (let i = 0; i < tagParticles.length; i += 1) {
        const tag = tagParticles[i];
        moveParticle(tag);

        const label = tag.label;
        const badgeWidth = 34;
        const badgeHeight = 18;
        const x = tag.x - badgeWidth / 2;
        const y = tag.y - badgeHeight / 2;

        ctx.beginPath();
        ctx.fillStyle = "rgba(20, 41, 37, 0.62)";
        ctx.strokeStyle = "rgba(112, 255, 220, 0.45)";
        ctx.lineWidth = 1;
        ctx.roundRect(x, y, badgeWidth, badgeHeight, 8);
        ctx.fill();
        ctx.stroke();

        ctx.font = "600 9px Sora, sans-serif";
        ctx.fillStyle = "rgba(198, 255, 237, 0.9)";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(label, tag.x, tag.y + 0.5);
      }

      for (let i = 0; i < particles.length; i += 1) {
        for (let j = i + 1; j < particles.length; j += 1) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            const alpha = (1 - dist / 130) * 0.25;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(110, 255, 220, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      animationFrame = window.requestAnimationFrame(draw);
    };

    resize();
    initParticles();
    draw();

    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  return <canvas className="particle-canvas" ref={canvasRef} aria-hidden="true" />;
}
