/// <reference types="vite/client" />

declare module "*.md" {
  const story: import("../app/parser").Story;
  export default story;
}
