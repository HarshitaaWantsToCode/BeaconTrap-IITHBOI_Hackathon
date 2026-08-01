/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "var(--primary)",
          hover: "var(--primary-hover)",
        },
        background: {
          DEFAULT: "var(--background)",
          secondary: "var(--bg-main)",
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
        }
      }
    },
  },
  plugins: [],
}
