import { useComputed, useSignal } from "@preact/signals";
import { ComponentChildren } from "preact";
import { useContext } from "preact/hooks";
import { Router, Routes } from "../create/createRouter";
import { RouterContext } from "../use/useRouter";

interface RouterProviderProps<T> {
  router: Router<T>;
  children?: ComponentChildren;
}

export function RouterProvider<T extends Routes>(
  props: RouterProviderProps<T>
) {
  const routes = useContext(props.router.routes);
  const stack = useSignal<{ name: string; component: ComponentChildren }[]>([]);

  const readonlyStack = useComputed(() => stack.value);

  return (
    <RouterContext.Provider
      value={{
        push(route: string) {
          if (!(route in routes)) {
            throw new Error(`Unknown route: ${route}`);
          }
          const page = routes[route]();
          stack.value = [...stack.value, { name: route, component: page }];
        },
        pop() {
          stack.value = stack.value.slice(0, -1);
        },
        stack: readonlyStack,
      }}
    >
      {props.children}
    </RouterContext.Provider>
  );
}
