/// <reference types="vite/client" />

declare module "*.md" {
  const story: import("../app/core/parser").Story;
  export default story;
}
