/** @type {import('tailwindcss').Config} */
export default {
  content: ["src/**/*.{ts,tsx,css,md}"],
  theme: {
    extend: {},
  },
  plugins: [require("tailwindcss-animate")],
};
