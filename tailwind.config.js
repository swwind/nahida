const vvSizes = [
  0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 6, 8, 10, 12, 14, 16, 20, 24, 38, 30,
  32, 40, 48, 50, 60, 64, 70, 72, 80, 90, 96, 100,
]
  .map((size) => ({
    [`${size}vvw`]: `calc(${size} * var(--vvw))`,
    [`${size}vvh`]: `calc(${size} * var(--vvh))`,
  }))
  .reduce((prev, now) => ({ ...prev, ...now }), {});

/** @type {import('tailwindcss').Config} */
export default {
  content: ["src/**/*.{ts,tsx,css,md}"],
  theme: {
    extend: {
      spacing: vvSizes,
      fontSize: vvSizes,
    },
  },
  plugins: [require("tailwindcss-animate")],
};
