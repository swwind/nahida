import { useContext } from "preact/hooks";
import { ComponentChildren, createContext } from "preact";
import { ReadonlySignal } from "@preact/signals";

export interface Router {
  push(route: string): void;
  pop(): void;

  stack: ReadonlySignal<{ name: string; component: ComponentChildren }[]>;
}

export const RouterContext = createContext<Router | null>(null);

export function useRouter() {
  const router = useContext(RouterContext);

  if (!router) {
    throw new Error(
      "Failed to get router, please nest your component in <StoryProvider />"
    );
  }

  return router;
}
