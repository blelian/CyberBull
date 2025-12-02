"use client";

import { useEffect, useRef } from "react";

interface SpiralDragonProps {
  className?: string;
}

export default function SpiralDragon({ className }: SpiralDragonProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Dark colors only
    const colors = [
      "#1a001f", "#2a0033", "#330033", "#4c007d",
      "#2b0035", "#3a004a", "#25001f", "#1b0026"
    ];

    const particles: { angle: number; radius: number; speed: number; color: string }[] = [];
    const num = 200;

    for (let i = 0; i < num; i++) {
      particles.push({
        angle: Math.random() * 2 * Math.PI,
        radius: Math.random() * 50 + 50,
        speed: 0.01 + Math.random() * 0.02,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height); // clear canvas instead of filling background

      const cx = width / 2;
      const cy = height / 2;

      particles.forEach((p) => {
        p.angle += p.speed;
        p.radius += 0.1; // spiral outwards
        const x = cx + Math.cos(p.angle) * p.radius;
        const y = cy + Math.sin(p.angle) * p.radius;

        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = p.color;
        ctx.fill();
      });

      requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return <canvas ref={canvasRef} className={className} />;
}
