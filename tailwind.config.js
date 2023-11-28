/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/renderer/index.html', './src/renderer/**/*.{js,ts,jsx,tsx,vue}'],
  variants: {
    extend: {
      important: true
    }
  },
  theme: {
    extend: {}
  },
  plugins: []
}
