/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#132A3A",
        "primary-dark": "#0B1F2A",
        "accent": "#C6A15B",
        "accent-hover": "#D8B86A",
        "background": "#F8F5EE",
        "surface": "#FFFFFF",
        "surface-alt": "#EEE7DA",
        "text-primary": "#20262B",
        "text-secondary": "#667078",
        "text-on-dark": "#F8F5EE",
        "border-custom": "#DDD6C9",
        "success-custom": "#2F7D62",
        "danger-custom": "#B54747"
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "2xl": "1rem",
        "full": "9999px"
      },
      fontFamily: {
        "headline": ["Playfair Display", "serif"],
        "body": ["Plus Jakarta Sans", "sans-serif"]
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries'),
  ],
}
