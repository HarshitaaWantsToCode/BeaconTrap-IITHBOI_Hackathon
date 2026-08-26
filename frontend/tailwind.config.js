/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Nunito', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"IBM Plex Mono"', 'monospace'],
      },
      colors: {
        'navy-deep': '#1e1540',
        'purple-primary': '#6c4fc4',
        'purple-accent': '#9b7fda',
        'teal-accent': '#3aab8a',
        'gold-amber': '#d97706',
        'lavender-bg': '#f6f2ff',
        'purple-muted': '#7a6ea8',
        'brand-abyss': '#060B14',
        'brand-navy': '#0A0F1E',
        'brand-surface': '#111C33',
        'brand-border': '#1E2E4E',
        'neon-cyan': '#00E5FF',
        'neon-emerald': '#10B981',
        'neon-amber': '#F59E0B',
        'neon-crimson': '#EF4444',
        base: 'var(--bg-base)',
        panel: {
          DEFAULT: 'var(--bg-panel)',
          alt: 'var(--bg-panel-alt)',
        },
        border: 'var(--border)',
        accent: {
          DEFAULT: 'var(--accent)',
          cool: 'var(--accent-cool)',
        },
        primary: {
          DEFAULT: "var(--primary)",
          hover: "var(--primary-hover)",
        },
        background: {
          DEFAULT: "var(--background)",
          secondary: "var(--card-bg-secondary)",
        },
        card: {
          DEFAULT: "var(--card)",
          border: "var(--card-border)",
          secondary: "var(--card-bg-secondary)",
        },
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          muted: "var(--text-muted)",
        },
        severity: {
          critical: "var(--severity-critical)",
          high: "var(--severity-high)",
          medium: "var(--severity-medium)",
          low: "var(--severity-low)",
        }
      }
    },
  },
  plugins: [],
}

