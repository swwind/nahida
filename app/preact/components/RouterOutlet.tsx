import { ComponentChildren } from "preact";
import { Router, Routes } from "../create/createRouter";
import { useContext, useMemo, useState } from "preact/hooks";
import { RouterContext } from "../route";
import { useSignal } from "@preact/signals";

interface RouterProps<T> {
  router: Router<T>;
  children?: ComponentChildren;
}

export function RouterOutlet<T extends Routes>(props: RouterProps<T>) {
  const routes = useContext(props.router.routes);
  const stack = useSignal<ComponentChildren[]>([]);

  return (
    <RouterContext.Provider
      value={{
        push(route) {
          console.log(route);
          if (!(route in routes)) {
            throw new Error(`Unknown route: ${route}`);
          }
          const page = routes[route]();
          stack.value = [...stack.value, page];
        },
        pop() {
          stack.value = stack.value.slice(0, -1);
        },
      }}
    >
      {props.children && <div class="page">{props.children}</div>}
      {stack.value.map((page, index) => (
        <div class="page" key={index}>
          {page}
        </div>
      ))}
    </RouterContext.Provider>
  );
}
