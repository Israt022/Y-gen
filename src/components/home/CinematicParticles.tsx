"use client";

import { useMemo } from "react";

interface CinematicParticlesProps {
  tintColor?: string | null;
}

export default function CinematicParticles({ tintColor }: CinematicParticlesProps) {
  // Generate a static, deterministic set of subtle floating ember particles
  const particles = useMemo(() => {
    return Array.from({ length: 18 }, (_, i) => ({
      id: i,
      size: (i % 3) + 2, // 2px, 3px, or 4px
      left: `${(i * 19) % 96 + 2}%`,
      top: `${(i * 23) % 90 + 5}%`,
      duration: 12 + (i % 8) * 2, // 12s - 26s slow drift
      delay: (i % 6) * 1.5,
      opacity: 0.25 + (i % 4) * 0.15,
    }));
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[1] overflow-hidden select-none motion-reduce:hidden"
    >
      {/* Soft dynamic atmospheric lighting glow tailored to the active anime's color */}
      <div
        className="absolute -top-24 left-1/4 h-[450px] w-[600px] -translate-x-1/2 rounded-full opacity-20 blur-[130px] transition-all duration-1000"
        style={{
          background: tintColor || "var(--accent)",
        }}
      />
      <div
        className="absolute top-1/3 right-1/4 h-[400px] w-[500px] rounded-full opacity-15 blur-[120px] transition-all duration-1000"
        style={{
          background: "var(--accent-secondary)",
        }}
      />

      {/* Floating cinematic particles */}
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute rounded-full pointer-events-none animate-pulse"
          style={{
            width: `${p.size}px`,
            height: `${p.size}px`,
            left: p.left,
            top: p.top,
            backgroundColor: tintColor || "var(--primary)",
            opacity: p.opacity,
            boxShadow: `0 0 10px ${tintColor || "var(--primary)"}`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
