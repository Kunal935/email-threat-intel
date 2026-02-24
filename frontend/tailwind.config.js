/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          black: "#050510",
          navy: "#0a0a20",
          blue: "#00f2ff",
          purple: "#bc13fe",
          green: "#00ff9f",
          red: "#ff0055",
        }
      },
      backgroundImage: {
        'cyber-grid': "radial-gradient(circle, rgba(0, 242, 255, 0.1) 1px, transparent 1px)",
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(0, 242, 255, 0.5), 0 0 10px rgba(0, 242, 255, 0.3)' },
          '100%': { boxShadow: '0 0 20px rgba(0, 242, 255, 0.8), 0 0 40px rgba(0, 242, 255, 0.5)' },
        }
      }
    },
  },
  plugins: [],
}
