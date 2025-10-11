/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f4ff',
          100: '#e0e7ff',
          500: '#6366f1',
          600: '#5b5bd6',
          700: '#4f46e5',
        },
        dark: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#0b1020',
        },
        success: '#86efac',
        error: '#f87171',
        warning: '#fbbf24',
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Oxygen',
          'Ubuntu',
          'Cantarell',
          'Fira Sans',
          'Droid Sans',
          'Helvetica Neue',
          'sans-serif',
        ],
        mono: [
          'source-code-pro',
          'Menlo',
          'Monaco',
          'Consolas',
          'Courier New',
          'monospace',
        ],
      },
      backgroundImage: {
        // Light background gradients with stronger, still subtle contrast
        'gradient-radial': 'radial-gradient(80% 80% at 50% 0%, rgba(99,102,241,0.16), transparent 60%)',
        'gradient-linear': 'linear-gradient(180deg, #e9edf5 0%, #f6f8fc 60%, #ffffff 100%)',
        'gradient-main': 'radial-gradient(80% 80% at 50% 0%, rgba(99,102,241,0.16), transparent 60%), radial-gradient(60% 60% at 100% 100%, rgba(15,23,42,0.08), transparent 60%), linear-gradient(180deg, #e9edf5 0%, #f6f8fc 60%, #ffffff 100%)',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'spin-slow': 'spin 1s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 2s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}

