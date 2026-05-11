/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          500: "#6d28d9",
          600: "#5b21b6"
        }
      }
    }
  },
  plugins: []
};
