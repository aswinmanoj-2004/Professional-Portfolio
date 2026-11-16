/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // All theme-aware: see the `--c-*` triplets in src/index.css.
        bg: 'rgb(var(--c-bg) / <alpha-value>)',
        panel: 'rgb(var(--c-panel) / <alpha-value>)',
        panel2: 'rgb(var(--c-panel2) / <alpha-value>)',
        fg: 'rgb(var(--c-fg) / <alpha-value>)',
        muted: 'rgb(var(--c-fg) / 0.68)',
        faint: 'rgb(var(--c-fg) / 0.45)',
        line: 'rgb(var(--c-line) / var(--c-line-a))',
        rose: 'rgb(var(--c-rose) / <alpha-value>)',
        clay: 'rgb(var(--c-clay) / <alpha-value>)',
        ember: 'rgb(var(--c-ember) / <alpha-value>)',
        emberSoft: 'rgb(var(--c-ember-soft) / <alpha-value>)',
        field: 'rgb(var(--c-fg) / 0.05)',
      },
      fontFamily: {
        sans: ['Figtree', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SF Mono', 'Menlo', 'Consolas', 'monospace'],
      },
      letterSpacing: {
        label: '0.16em',
      },
      borderRadius: {
        pill: '9999px',
        card: '2rem',
        cardSm: '1.25rem',
        control: '0.875rem',
      },
      maxWidth: {
        shell: '88rem',
      },
      transitionTimingFunction: {
        spring: 'cubic-bezier(0.22, 1, 0.36, 1)',
        soft: 'cubic-bezier(0.16, 1, 0.3, 1)',
        snap: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
      },
    },
  },
  plugins: [],
};
