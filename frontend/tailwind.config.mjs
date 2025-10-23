/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'eco-green': {
          50: '#f0f9f0',
          100: '#dcf2dc',
          200: '#bce5bc',
          300: '#8bd18b',
          400: '#56b856',
          500: '#4CAF50',
          600: '#3d8b40',
          700: '#326e34',
          800: '#2b572d',
          900: '#254827',
        },
        colors: {
          // Minimal dark theme
          'dark-bg': '#0a0a0a',
          'card-bg': '#1a1a1a', 
          'card-border': '#2a2a2a',
          'text-primary': '#ffffff',
          'text-secondary': '#a0a0a0',
          'text-muted': '#666666',
          'accent-green': '#10b981',
          'accent-blue': '#3b82f6',
          'accent-orange': '#f59e0b'
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'pulse-glow': {
          '0%': { boxShadow: '0 0 5px rgba(76, 175, 80, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(76, 175, 80, 0.8)' },
        }
      }
    },
  },
  plugins: [],
}