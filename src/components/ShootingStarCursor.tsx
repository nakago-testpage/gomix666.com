'use client';

import { useState, useEffect, useCallback } from 'react';

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  vx: number;
  vy: number;
}

export default function ShootingStarCursor() {
  const [stars, setStars] = useState<Star[]>([]);

  const addStar = useCallback((x: number, y: number) => {
    const newStar: Star = {
      id: Date.now() + Math.random(),
      x,
      y,
      size: Math.random() * 3 + 1,
      opacity: 1,
      vx: (Math.random() - 0.5) * 3,
      vy: (Math.random() - 0.5) * 3,
    };
    setStars((prev) => [...prev, newStar]);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      addStar(e.clientX, e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [addStar]);

  useEffect(() => {
    const animationFrame = requestAnimationFrame(() => {
      setStars((prevStars) =>
        prevStars
          .map((star) => ({
            ...star,
            x: star.x + star.vx,
            y: star.y + star.vy,
            opacity: star.opacity - 0.02,
          }))
          .filter((star) => star.opacity > 0)
      );
    });
    return () => cancelAnimationFrame(animationFrame);
  }, [stars]);

  return (
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[9999]">
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-cyan-300 shadow-[0_0_10px_2px_#00ffff]"
          style={{
            left: star.x,
            top: star.y,
            width: star.size,
            height: star.size,
            opacity: star.opacity,
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}
    </div>
  );
}
