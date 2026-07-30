"use client";
import { useEffect, useState, useMemo } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

export default function ParticlesBackground() {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const options = useMemo(
    () => ({
      background: { color: { value: "transparent" } },
      fpsLimit: 60,
      interactivity: {
        events: { resize: true },
      },
      particles: {
        color: { value: ["#d4a853", "#e04040", "#ffffff"] }, // Gold, Fire, Marble White
        move: {
          direction: "top",
          enable: true,
          outModes: { default: "out" },
          random: true,
          speed: 0.8,
          straight: false,
        },
        number: {
          density: { enable: true, area: 800 },
          value: 40, // Low for performance
        },
        opacity: {
          value: { min: 0.1, max: 0.6 },
          animation: { enable: true, speed: 1, minimumValue: 0.1 },
        },
        shape: { type: "circle" },
        size: { value: { min: 1, max: 3 }, random: true },
      },
      detectRetina: true,
    }),
    []
  );

  if (!init) return null;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
      <Particles id="tsparticles" options={options} />
    </div>
  );
}
