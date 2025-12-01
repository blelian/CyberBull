"use client";
import React, { useEffect, useRef } from "react";

/**
 * Binary rain animated background canvas.
 * Mobile-first: reduces density on small screens for performance.
 */
export default function MovingBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let width = (canvas.width = innerWidth);
    let height = (canvas.height = innerHeight);

    // density tuned by screen width
    const density = width < 640 ? 0.009 : width < 1024 ? 0.014 : 0.02;
    const columns = Math.floor(width * density);
    const fontSize = Math.max(10, Math.floor(width / 120)); // scales
    const drops = new Array(columns).fill(0).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      speed: Math.random() * 1.4 + 0.6,
      charIndex: Math.floor(Math.random() * 2),
    }));

    const chars = ["0", "1"];
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "rgba(209,0,255,0.08)"); // subtle magenta glow
    gradient.addColorStop(0.5, "rgba(0,234,255,0.06)"); // cyan
    gradient.addColorStop(1, "rgba(255,255,255,0.02)");

    ctx.font = `${fontSize}px monospace`;

    function resize() {
      width = canvas.width = innerWidth;
      height = canvas.height = innerHeight;
    }
    window.addEventListener("resize", resize);

    function draw() {
      // fade layer
      ctx.fillStyle = "rgba(0,0,0,0.18)";
      ctx.fillRect(0, 0, width, height);

      // jittered binary
      ctx.fillStyle = gradient as unknown as string;
      ctx.font = `${fontSize}px monospace`;
      for (let i = 0; i < drops.length; i++) {
        const d = drops[i];
        const text = chars[Math.floor(Math.random() * chars.length)];
        // glow
        ctx.shadowColor = "rgba(209,0,255,0.18)";
        ctx.shadowBlur = 6;
        ctx.fillText(text, d.x, d.y);
        d.y += d.speed + Math.random() * 2;
        if (d.y > height + 20) {
          d.y = -20;
          d.x = Math.random() * width;
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    }

    // initial clear
    ctx.fillStyle = "#0a0010";
    ctx.fillRect(0, 0, width, height);
    draw();

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      className="canvas-bg"
      ref={canvasRef}
      aria-hidden
    />
  );
}
