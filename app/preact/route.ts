import { createContext } from "preact";

export interface Router {
  push(route: string): void;
  pop(): void;
}

export const RouterContext = createContext<Router | null>(null);
