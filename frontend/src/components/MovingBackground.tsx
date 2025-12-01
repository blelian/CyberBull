"use client";
import React, { useEffect, useRef } from "react";

interface MovingBackgroundProps {
  className?: string;
}

/**
 * Very calm binary rain background.
 */
export default function MovingBackground({ className }: MovingBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const fontSize = Math.max(12, Math.floor(width / 140));
    const columns = Math.floor(width / fontSize);
    const drops = new Array(columns).fill(0); // vertical position per column

    const chars = ["0", "1"];
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "rgba(209,0,255,0.2)"); // magenta
    gradient.addColorStop(0.5, "rgba(0,234,255,0.15)"); // cyan
    gradient.addColorStop(1, "rgba(255,255,255,0.05)");

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", resize);

    function draw() {
      // fade layer more gently
      ctx.fillStyle = "rgba(0,0,0,0.05)";
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = gradient as unknown as string;
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.shadowColor = "rgba(209,0,255,0.2)";
        ctx.shadowBlur = 4;
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        // much slower fall
        drops[i] += Math.random() * 0.2 + 0.1;

        if (drops[i] * fontSize > height || Math.random() > 0.998) {
          drops[i] = 0;
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`canvas-bg ${className || ""}`}
      aria-hidden
    />
  );
}
