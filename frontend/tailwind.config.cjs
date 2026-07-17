/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          green:       "#16a34a",
          greenLight:  "#dcfce7",
          greenDark:   "#14532d",
          orange:      "#ea580c",
          orangeLight: "#ffedd5",
          orangeDark:  "#9a3412",
        },
      },
      fontFamily: {
        sans: ["-apple-system", "Segoe UI", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in":   "fadeIn 0.4s ease-in-out",
        "slide-up":  "slideUp 0.4s ease-out",
        "pulse-slow":"pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeIn:  { "0%": { opacity: 0 }, "100%": { opacity: 1 } },
        slideUp: { "0%": { opacity: 0, transform: "translateY(16px)" }, "100%": { opacity: 1, transform: "translateY(0)" } },
      },
    },
  },
  plugins: [],
}
