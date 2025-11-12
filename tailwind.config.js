/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: 'hsl(var(--primary))',
        alpha: 'hsl(var(--primary) , 0.1)',
        darker: 'hsl(var(--darker))',
      },
      fontSize: {
        x2sm: '0.6rem',
      },
    },
  },
  plugins: [],
}
