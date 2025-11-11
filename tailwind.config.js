/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          amethyst: '#9966CC',
          purple: '#7c3aed',
        },
        text: {
          starwhite: '#F5F5F5',
        },
        ok: {
          emerald: '#2ECC71',
        },
        hl: {
          gold: '#FFD700',
        },
        bg: {
          dark: '#0b0b10',
          panel: 'rgba(255, 255, 255, 0.06)',
        }
      },
      borderRadius: {
        'yoni': '14px',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Inter', 'Roboto', 'Arial', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'yoni-starfield': 'radial-gradient(1200px 600px at 20% 0%, #1b1030 0, transparent 60%), radial-gradient(1200px 600px at 100% 100%, #0d2230 0, transparent 50%)',
      },
    },
  },
  plugins: [],
}
