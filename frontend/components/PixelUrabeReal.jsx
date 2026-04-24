/* PixelUrabeReal.jsx
   FULL FIX VERSION - IMAGE FIXED
   Next.js / React Ready

   TARUH FILE GAMBAR DI:
   /public/urabe-pixel.png   ← root public, BUKAN subfolder

   Kalau gambar masih tidak muncul:
   1. Nama file: urabe-pixel.png (huruf kecil, pakai dash)
   2. Lokasi: MY_PROJECT/public/urabe-pixel.png
   3. Restart dev server: Ctrl+C lalu npm run dev lagi
   4. Kalau file di /public/images/ → ganti src jadi "/images/urabe-pixel.png"
*/

"use client";

import { useEffect, useRef, useState } from "react";

export default function PixelUrabeReal() {
  const wrapRef   = useRef(null);
  const imgRef    = useRef(null);
  const shadowRef = useRef(null);
  const glowRef   = useRef(null);
  const sparkRef  = useRef(null);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    let frameId;

    const wrap   = wrapRef.current;
    const img    = imgRef.current;
    const shadow = shadowRef.current;
    const glow   = glowRef.current;
    const canvas = sparkRef.current;
    if (!wrap || !img || !shadow || !glow || !canvas) return;

    const ctx = canvas.getContext("2d");
    canvas.width  = 160;
    canvas.height = 160;

    function drawSparks(t) {
      ctx.clearRect(0, 0, 160, 160);

      for (let i = 0; i < 5; i++) {
        const angle  = t * 1.8 + i * (Math.PI * 2 / 5);
        const radius = 20 + Math.sin(t * 3 + i) * 8;
        const sx     = 80 + Math.cos(angle) * radius;
        const sy     = 80 + Math.sin(angle) * radius;
        const alpha  = 0.45 + 0.55 * Math.sin(t * 4 + i * 1.3);
        const sz     = 1.4 + Math.sin(t * 5 + i) * 0.7;

        ctx.save();
        ctx.translate(sx, sy);
        ctx.rotate(t * 1.5 + i);
        ctx.fillStyle = `rgba(200, 200, 255, ${alpha})`;
        ctx.beginPath();
        for (let p = 0; p < 8; p++) {
          const a = (p / 8) * Math.PI * 2;
          const r = p % 2 === 0 ? sz * 2.5 : sz * 0.9;
          p === 0
            ? ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r)
            : ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      // Snip flash burst
      const cycle = t % (Math.PI * 2);
      if (cycle > 5.5) {
        const progress = (cycle - 5.5) / (Math.PI * 2 - 5.5);
        ctx.beginPath();
        ctx.arc(80, 80, 35 * progress, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${0.4 * (1 - progress)})`;
        ctx.fill();
      }
    }

    function animate(timestamp) {
      const t = timestamp * 0.001;

      const floatY        = Math.sin(t * 2) * 6;
      const swayX         = Math.sin(t * 1.4) * 2;
      const scale         = 1 + Math.sin(t * 2) * 0.006;
      const shadowScale   = 1 + Math.sin(t * 2) * 0.08;
      const shadowOpacity = 0.22 + Math.sin(t * 2) * 0.05;
      const glowOpacity   = 0.5 + Math.sin(t * 2.5) * 0.3;
      const glowScale     = 1 + Math.sin(t * 2.5) * 0.12;

      wrap.style.transform   = `translateY(${floatY}px) scale(${scale})`;
      img.style.transform    = `translateX(${swayX}px)`;
      shadow.style.transform = `scale(${shadowScale})`;
      shadow.style.opacity   = shadowOpacity;
      glow.style.opacity     = glowOpacity;
      glow.style.transform   = `scale(${glowScale})`;

      drawSparks(t);

      frameId = requestAnimationFrame(animate);
    }

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, []);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-end",
        position: "relative",
        overflow: "visible",
        paddingBottom: "16px",
      }}
    >
      {/* GROUND SHADOW */}
      <div
        ref={shadowRef}
        style={{
          position: "absolute",
          bottom: "6%",
          left: "50%",
          marginLeft: "-80px",
          width: "160px",
          height: "24px",
          background: "rgba(0,0,0,0.28)",
          borderRadius: "50%",
          filter: "blur(9px)",
          zIndex: 1,
        }}
      />

      {/* NEON GROUND GLOW */}
      <div
        ref={glowRef}
        style={{
          position: "absolute",
          bottom: "5%",
          left: "50%",
          marginLeft: "-100px",
          width: "200px",
          height: "28px",
          background: "radial-gradient(ellipse, rgba(79,255,192,0.55) 0%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(8px)",
          zIndex: 1,
        }}
      />

      {/* SPARKLE CANVAS */}
      <canvas
        ref={sparkRef}
        style={{
          position: "absolute",
          bottom: "34%",
          left: "10%",
          width: "160px",
          height: "160px",
          pointerEvents: "none",
          zIndex: 4,
          mixBlendMode: "screen",
        }}
        aria-hidden="true"
      />

      {/* CHARACTER */}
      <div
        ref={wrapRef}
        style={{
          position: "relative",
          zIndex: 2,
          willChange: "transform",
        }}
      >
        {/* Fallback jika gambar gagal load */}
        {imgError && (
          <div style={{
            width: "260px",
            height: "320px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            border: "2px dashed rgba(185,103,255,0.5)",
            borderRadius: "8px",
            color: "#b967ff",
            fontFamily: "monospace",
            fontSize: "0.75rem",
            textAlign: "center",
            gap: "12px",
            lineHeight: 1.8,
            padding: "16px",
          }}>
            <span style={{ fontSize: "2rem" }}>⚠️</span>
            <span style={{ fontWeight: "bold" }}>Gambar tidak ditemukan!</span>
            <span style={{ color: "#7aada3", fontSize: "0.68rem" }}>
              Taruh file di:<br />
              <code style={{ color: "#4fffc0" }}>/public/images/urabe-pixel.png</code>
              <br /><br />
              Lalu restart:<br />
              <code style={{ color: "#4fffc0" }}>npm run dev</code>
            </span>
          </div>
        )}

        {/* 
          PENTING — Next.js serve file dari /public sebagai root URL.
          Jadi:
            /public/urabe-pixel.png          → src="/urabe-pixel.png"
            /public/images/urabe-pixel.png   → src="/images/urabe-pixel.png"
          
          Sesuaikan src di bawah dengan lokasi file kamu!
        */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imgRef}
          src="/images/urabe-pixel.png"
          alt="Urabe Mikoto Pixel Art"
          draggable="false"
          onError={() => setImgError(true)}
          style={{
            display: imgError ? "none" : "block",
            width: "380px",
            height: "auto",
            maxHeight: "560px",
            objectFit: "contain",
            imageRendering: "pixelated",
            userSelect: "none",
            pointerEvents: "none",
            filter: `
              drop-shadow(0 0 10px rgba(185,103,255,0.55))
              drop-shadow(0 0 22px rgba(79,255,192,0.22))
              drop-shadow(0 10px 18px rgba(0,0,0,0.30))
            `,
          }}
        />
      </div>

      {/* NAMETAG */}
      <div
        style={{
          position: "absolute",
          top: "4%",
          left: "50%",
          transform: "translateX(-50%)",
          background: "rgba(0,0,0,0.82)",
          border: "1px solid #b967ff",
          borderRadius: "6px",
          padding: "9px 20px",
          fontFamily: "'Press Start 2P', monospace",
          fontSize: "0.48rem",
          color: "#b967ff",
          textShadow: "0 0 10px #b967ff",
          boxShadow: "0 0 14px rgba(185,103,255,0.35)",
          whiteSpace: "nowrap",
          textAlign: "center",
          lineHeight: 2.2,
          zIndex: 5,
          letterSpacing: "0.06em",
        }}
      >
        URABE MIKOTO
        <br />
        <span style={{ color: "#d49aff", fontSize: "0.85em" }}>
          ★ MYSTERIOUS COMPANION ★
        </span>
      </div>
    </div>
  );
}
