'use client';

import { useRef, useState } from 'react';
import { motion, useMotionValue, useTransform, MotionValue } from 'framer-motion';

function Letter({ children, mouseX }: { children: string; mouseX: MotionValue<number> }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  // 距離に基づいて発光の強度を計算
  const glowIntensity = useTransform(
    distance,
    [-150, -50, 0, 50, 150],
    [0, 0.5, 1, 0.5, 0]
  );

  // スタイルを動的に生成
  const style = {
    display: 'inline-block',
    color: useTransform(
      glowIntensity,
      [0, 1],
      ['#a0f0ff', '#ff69b4'] // 青白い色からピンク色へ
    ),
    textShadow: useTransform(
      glowIntensity,
      [0, 1],
      ['0 0 5px #00ccff, 0 0 8px #00ccff', '0 0 10px #ff69b4, 0 0 15px #ff1493'] // 青白い発光からピンクの発光へ
    ),
    transition: 'color 0.3s ease-in-out, text-shadow 0.3s ease-in-out'
  };

  return (
    <motion.span
      ref={ref}
      style={style}
      className="text-xl font-bold"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children === ' ' ? '\u00A0' : children}
    </motion.span>
  );
}

export default function DockText({ children }: { children: string }) {
  const mouseX = useMotionValue(Infinity);
  const letters = children.split('');

  return (
    <motion.h1
      onMouseMove={(e) => mouseX.set(e.nativeEvent.x)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className="flex items-center"
    >
      {letters.map((letter, i) => (
        <Letter key={i} mouseX={mouseX}>
          {letter}
        </Letter>
      ))}
    </motion.h1>
  );
}
