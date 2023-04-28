import { ComponentChildren, Context, createContext } from "preact";

export type Routes = {
  [k in string]: () => ComponentChildren;
};

export type Router<T> = {
  routes: Context<T>;
};

export function createRouter<T extends Routes>(pages: T): Router<T> {
  const routes = createContext(pages);

  return { routes };
}
