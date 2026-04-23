/* ParticleField.jsx */
"use client";

import { useEffect, useRef } from "react";

export default function ParticleField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    let width = 0;
    let height = 0;
    let animationFrame;
    let pointerX = 0;
    let pointerActive = false;

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

    const drawAuroraRibbon = (time, offset, hueA, hueB, opacity) => {
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, `hsla(${hueA}, 100%, 72%, ${opacity})`);
      gradient.addColorStop(0.5, `hsla(${hueB}, 100%, 66%, ${opacity * 0.7})`);
      gradient.addColorStop(1, `hsla(${hueA + 18}, 100%, 62%, ${opacity * 0.45})`);

      ctx.beginPath();
      for (let x = -40; x <= width + 40; x += 14) {
        const waveA = Math.sin((x + time * 58 + offset) * 0.0052) * 58;
        const waveB = Math.cos((x - time * 42 + offset) * 0.0037) * 36;
        const pointerPull = pointerActive
          ? Math.max(0, 240 - Math.abs(x - pointerX)) * 0.12 * Math.sin((time + x) * 0.01)
          : 0;
        const y = height * 0.22 + waveA + waveB + offset + pointerPull;

        if (x <= -40) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      for (let x = width + 40; x >= -40; x -= 14) {
        const waveA = Math.sin((x + time * 58 + offset + 280) * 0.0052) * 54;
        const waveB = Math.cos((x - time * 42 + offset + 160) * 0.0037) * 34;
        const pointerPull = pointerActive
          ? Math.max(0, 220 - Math.abs(x - pointerX)) * 0.1 * Math.cos((time + x) * 0.01)
          : 0;
        const y = height * 0.44 + waveA + waveB + offset * 1.08 + pointerPull;
        ctx.lineTo(x, y);
      }

      ctx.closePath();
      ctx.fillStyle = gradient;
      ctx.fill();
    };

    const draw = (timestamp) => {
      const time = timestamp * 0.001;
      ctx.clearRect(0, 0, width, height);

      const sky = ctx.createLinearGradient(0, 0, 0, height);
      sky.addColorStop(0, "rgba(2, 16, 15, 0.55)");
      sky.addColorStop(1, "rgba(2, 10, 11, 0.2)");
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, width, height);

      ctx.globalCompositeOperation = "lighter";
      drawAuroraRibbon(time, 0, 166, 149, 0.32);
      drawAuroraRibbon(time * 0.9, 90, 155, 176, 0.27);
      drawAuroraRibbon(time * 1.1, 178, 171, 143, 0.2);
      ctx.globalCompositeOperation = "source-over";

      animationFrame = window.requestAnimationFrame(draw);
    };

    const onMouseMove = (event) => {
      pointerX = event.clientX;
      pointerActive = true;
    };

    const onMouseLeave = () => {
      pointerActive = false;
    };

    resize();
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
