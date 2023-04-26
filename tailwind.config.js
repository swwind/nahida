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
  content: ["src/**/*.{ts,tsx,css,md}", "app/**/*.ts"],
  theme: {
    extend: {
      spacing: vvSizes,
      fontSize: vvSizes,
      animation: {
        "to-top": "object-position-to-top 60s linear forwards",
        "to-left": "object-position-to-left 60s linear forwards",
        "to-right": "object-position-to-right 60s linear forwards",
        "to-bottom": "object-position-to-bottom 60s linear forwards",
      },
      keyframes: {
        "object-position-to-top": { to: { objectPosition: "top" } },
        "object-position-to-left": { to: { objectPosition: "left" } },
        "object-position-to-right": { to: { objectPosition: "right" } },
        "object-position-to-bottom": { to: { objectPosition: "bottom" } },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
