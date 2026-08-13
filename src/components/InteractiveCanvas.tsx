import React, { useEffect, useRef } from 'react';
import { CanvasMode } from '../types';

interface InteractiveCanvasProps {
  mode: CanvasMode;
  rainColor?: string;
  dustColor?: string;
}

export const InteractiveCanvas: React.FC<InteractiveCanvasProps> = ({
  mode,
  rainColor = 'rgba(34, 199, 242, 0.4)',
  dustColor = 'rgba(255, 211, 138, 0.5)'
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Warm Ambient Dust Particles
    const particles = Array.from({ length: 65 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2 + 0.5,
      alpha: Math.random() * 0.5 + 0.2,
      vx: (Math.random() - 0.5) * 0.3,
      vy: Math.random() * 0.4 + 0.1
    }));

    // Rain Drops for Glass Window
    const rainDrops = Array.from({ length: 130 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      length: Math.random() * 25 + 10,
      speed: Math.random() * 8 + 4,
      opacity: Math.random() * 0.35 + 0.15
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw Window Rain Streaks
      ctx.lineWidth = 1.2;
      rainDrops.forEach((drop) => {
        drop.y += drop.speed;
        drop.x -= 0.5; // Slight wind angle
        if (drop.y > height) {
          drop.y = -20;
          drop.x = Math.random() * width;
        }

        ctx.strokeStyle = rainColor;
        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x - 2, drop.y + drop.length);
        ctx.stroke();

        // Small drop head dot
        ctx.fillStyle = `rgba(255, 255, 255, ${drop.opacity * 1.2})`;
        ctx.beginPath();
        ctx.arc(drop.x - 2, drop.y + drop.length, 1, 0, Math.PI * 2);
        ctx.fill();
      });

      // 2. Draw Dust Particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y > height) p.y = 0;
        if (p.x > width) p.x = 0;
        if (p.x < 0) p.x = width;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = dustColor;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [mode, rainColor, dustColor]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-10 opacity-70 transition-opacity duration-1000"
    />
  );
};


