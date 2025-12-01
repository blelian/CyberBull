"use client";
import React, { useEffect, useRef } from "react";

interface MovingBackgroundProps {
  className?: string;
}

/**
 * Sparse white snowfall on your exact site gradient (var(--bg-1) → #2a0033 → #1b0026)
 */
export default function MovingBackground({ className }: MovingBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    /** 
     * EXACT SITE GRADIENT  
     * matches:
     * background: linear-gradient(180deg, var(--bg-1) 0%, #2a0033 45%, #1b0026 100%);
     */
    function createGradient() {
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, "rgb(26,0,31)");       // var(--bg-1)
      grad.addColorStop(0.45, "#2a0033");         // mid-purple
      grad.addColorStop(1, "#1b0026");            // deep purple bottom
      return grad;
    }
    let gradient = createGradient();

    // Snowflake particles
    const particlesCount = Math.floor(width / 50);
    const particles = Array.from({ length: particlesCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2 + 1,
      speedY: Math.random() * 0.3 + 0.1,
      speedX: Math.random() * 0.2 - 0.1
    }));

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      gradient = createGradient();
    }
    window.addEventListener("resize", resize);

    function draw() {
      // Background (exact gradient)
      ctx.fillStyle = gradient as unknown as string;
      ctx.fillRect(0, 0, width, height);

      // Snow
      ctx.fillStyle = "#ffffff";
      ctx.shadowColor = "#ffffff";
      ctx.shadowBlur = 1;

      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        p.y += p.speedY;
        p.x += p.speedX;

        if (p.y > height) {
          p.y = 0;
          p.x = Math.random() * width;
        }
        if (p.x > width) p.x = 0;
        if (p.x < 0) p.x = width;
      });

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
