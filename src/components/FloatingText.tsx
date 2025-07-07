'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';

interface FloatingTextProps {
  text: string;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.4,
      delayChildren: 0.8,
    },
  },
};

const lineVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: 'easeOut',
    },
  },
};

const FloatingText: React.FC<FloatingTextProps> = ({ text }) => {
  const lines = text.split('\n');

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{
        color: 'white',
        textShadow: '0 0 5px rgba(255, 255, 255, 0.7)',
        fontFamily: '"Courier New", Courier, monospace',
        fontSize: '1.2rem',
        textAlign: 'left',
        width: '40ch',
        whiteSpace: 'pre-wrap',
        pointerEvents: 'none',
      }}
    >
      {lines.map((line, index) => (
        <motion.p key={index} variants={lineVariants} style={{ margin: '0.2em 0' }}>
          {line || '\u00A0'}{/* Use non-breaking space for empty lines */}
        </motion.p>
      ))}
    </motion.div>
  );
};

export default FloatingText;
