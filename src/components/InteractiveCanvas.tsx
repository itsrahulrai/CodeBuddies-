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

    // Warm Ambient Dust & Anime Glimmer Particles
    const particles = Array.from({ length: 75 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2.2 + 0.6,
      alpha: Math.random() * 0.6 + 0.2,
      vx: (Math.random() - 0.5) * 0.35,
      vy: Math.random() * 0.45 + 0.1,
      isSparkle: Math.random() > 0.65,
      sparklePhase: Math.random() * Math.PI * 2,
      sparkleSpeed: Math.random() * 0.05 + 0.02
    }));

    // Rain Drops for Glass Window
    const rainDrops = Array.from({ length: 140 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      length: Math.random() * 26 + 12,
      speed: Math.random() * 9 + 4.5,
      opacity: Math.random() * 0.35 + 0.15
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw Window Rain Streaks
      ctx.lineWidth = 1.3;
      rainDrops.forEach((drop) => {
        drop.y += drop.speed;
        drop.x -= 0.6; // Slight wind angle
        if (drop.y > height) {
          drop.y = -20;
          drop.x = Math.random() * (width + 50);
        }

        ctx.strokeStyle = rainColor;
        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x - 2.5, drop.y + drop.length);
        ctx.stroke();

        // Small drop head dot
        ctx.fillStyle = `rgba(255, 255, 255, ${drop.opacity * 1.2})`;
        ctx.beginPath();
        ctx.arc(drop.x - 2.5, drop.y + drop.length, 1.2, 0, Math.PI * 2);
        ctx.fill();
      });

      // 2. Draw Dust & Anime Sparkle Motes
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.sparklePhase += p.sparkleSpeed;

        if (p.y > height) p.y = 0;
        if (p.x > width) p.x = 0;
        if (p.x < 0) p.x = width;

        const dynamicAlpha = p.isSparkle
          ? Math.max(0.1, Math.sin(p.sparklePhase) * 0.5 + 0.5) * p.alpha
          : p.alpha;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = dustColor;
        ctx.globalAlpha = dynamicAlpha;
        ctx.fill();

        // Soft outer glow for sparkles
        if (p.isSparkle && dynamicAlpha > 0.4) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 2.2, 0, Math.PI * 2);
          ctx.fillStyle = dustColor;
          ctx.globalAlpha = dynamicAlpha * 0.25;
          ctx.fill();
        }
      });
      ctx.globalAlpha = 1.0;

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


