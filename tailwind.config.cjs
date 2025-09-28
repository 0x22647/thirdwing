module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        surface: 'var(--surface)',
        accent: 'var(--accent)'
      }
    }
  },
  plugins: []
}
