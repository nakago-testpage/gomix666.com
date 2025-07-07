'use client';

import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, MotionValue } from 'framer-motion';

function Letter({ children, mouseX }: { children: string; mouseX: MotionValue<number> }) {
  const ref = useRef<HTMLSpanElement>(null);

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

    const scale = useTransform(distance, [-150, -50, 0, 50, 150], [1, 0.7, 3.5, 0.7, 1]);
  
  const scaleSpring = useSpring(scale, { mass: 0.1, stiffness: 150, damping: 12 });

  return (
    <motion.span
      ref={ref}
      style={{ scale: scaleSpring, display: 'inline-block' }}
      className="text-xl font-bold text-glow"
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
