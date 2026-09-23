import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: '#fffdfa',
        maroon: '#7a1c00',
        gold: '#d48806',
        burnt: '#d96b1b',
        choc: '#2c0d0d',
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
        serif: ['"Source Serif 4"', 'Georgia', 'ui-serif', 'serif'],
      },
      boxShadow: {
        block: '4px 4px 0px 0px #7a1c00',
        blockSm: '2px 2px 0px 0px #7a1c00',
        blockGold: '4px 4px 0px 0px #d48806',
        blockPress: '1px 1px 0px 0px #7a1c00',
      },
      keyframes: {
        popIn: {
          '0%': { transform: 'scale(0.96)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      animation: {
        popIn: 'popIn 0.15s ease-out',
      },
    },
  },
  plugins: [],
};

export default config;
