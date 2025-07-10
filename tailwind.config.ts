import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 8s linear infinite',
      },
      dropShadow: {
        'glow-cyan': '0 0 8px rgba(0, 255, 255, 0.7)',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
export default config;
