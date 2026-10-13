/** Ridgeline Outfitters — Tailwind config
 *  Build:  npm run build:css      Watch: npm run watch:css
 *  Semantic colours (page, surface, ink, muted, line, accent) read CSS variables
 *  declared in src/input.css, so light/dark/RTL need no per-element overrides.
 */
const rgb = (v) => `rgb(var(${v}) / <alpha-value>)`;

module.exports = {
  darkMode: 'class',
  content: ['./index.html', './404.html', './coming-soon.html', './pages/**/*.html', './assets/js/**/*.js'],
  theme: {
    container: { center: true, padding: { DEFAULT: '1rem', sm: '1.5rem', lg: '2rem' } },
    extend: {
      colors: {
        pine: {
          50: '#eef3ee', 100: '#dbe6dd', 200: '#b9cdbd', 300: '#8fae97', 400: '#5f8a6e',
          500: '#3f6d51', 600: '#2e5a41', 700: '#234632', 800: '#1a3526', 900: '#12261b', 950: '#0b1710'
        },
        lichen: { 50: '#f5f7f1', 100: '#eaeee4', 200: '#dbe2d1', 300: '#c4cfb6', 400: '#a6b595' },
        blaze: { 300: '#ffa070', 400: '#ff7d3d', 500: '#ff5f15', 600: '#e24a05', 700: '#b83a04' },
        kraft: { 300: '#dcb987', 400: '#c79a5b', 500: '#a97c40', 700: '#6e4f27' },
        page: rgb('--c-page'),
        surface: rgb('--c-surface'),
        sunken: rgb('--c-sunken'),
        tile: rgb('--c-tile'),
        ink: rgb('--c-ink'),
        muted: rgb('--c-muted'),
        line: rgb('--c-line'),
        accent: rgb('--c-accent')
      },
      fontFamily: {
        display: ['"Big Shoulders Display"', '"Cairo Variable"', '"Heebo Variable"', 'Impact', 'sans-serif'],
        body: ['"Literata Variable"', '"Cairo Variable"', '"Heebo Variable"', 'Georgia', 'serif']
      },
      borderRadius: { DEFAULT: '3px', md: '4px', lg: '6px' },
      maxWidth: { prose: '62ch' },
      boxShadow: {
        card: '0 1px 0 rgb(var(--c-line) / .6), 0 10px 24px -14px rgb(11 23 16 / .35)'
      }
    }
  },
  plugins: []
};
