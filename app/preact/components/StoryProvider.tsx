import { ComponentChildren } from "preact";
import { Router, Routes } from "../create/createRouter";
import { SettingsProvider } from "./SettingsProvider";
import { RouterProvider } from "./RouterProvider";
import { MarkdownStoryProvider } from "./MarkdownStoryProvider";
import { AudioContextProvider } from "./AudioContextProvider";

interface StoryProviderProps<T> {
  router: Router<T>;
  children?: ComponentChildren;
}

export function StoryProvider<T extends Routes>(props: StoryProviderProps<T>) {
  return (
    <RouterProvider router={props.router}>
      <SettingsProvider>
        <AudioContextProvider>
          <MarkdownStoryProvider>
            <div class="story">{props.children}</div>
          </MarkdownStoryProvider>
        </AudioContextProvider>
      </SettingsProvider>
    </RouterProvider>
  );
}
