import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { markdownStory } from "./app/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    preact(),
    tsconfigPaths(),
    markdownStory({
      deserializeSource: "./app/parser/serialize.ts",
    }),
  ],
});
