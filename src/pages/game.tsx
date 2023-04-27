import { useMarkdownStory } from "@/preact";

import "./game.scss";

import intro from "../story/intro.md";

export default function () {
  const story = useMarkdownStory(intro);

  return (
    <div class="game" onClick={() => story.step()}>
      <div class="background" ref={story.refs.background}></div>

      <div class="console" style={{ opacity: story.show.value ? 1 : 0 }}>
        <div class="name">{story.name.value}</div>
        <div class="text" ref={story.refs.text} />
      </div>
    </div>
  );
}
