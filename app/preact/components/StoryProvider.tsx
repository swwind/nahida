import { ComponentChildren } from "preact";

interface StoryProviderProps {
  children?: ComponentChildren;
}

export function StoryProvider(props: StoryProviderProps) {
  return <div class="story">{props.children}</div>;
}
