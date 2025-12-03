/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['system-ui', 'ui-sans-serif', 'SF Pro Text', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'neon-cyan': '0 0 20px rgba(34, 211, 238, 0.7)',
        'neon-purple': '0 0 20px rgba(168, 85, 247, 0.7)',
      },
      backgroundImage: {
        'cyber-grid':
          'radial-gradient(circle at 1px 1px, rgba(148, 163, 184, 0.15) 1px, transparent 0)',
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: ['night', 'business'],
    darkTheme: 'night',
  },
};

