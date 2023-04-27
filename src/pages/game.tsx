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

      {story.selections.value && (
        <div class="selection">
          {story.selections.value.map((option, index) => (
            <div
              class="option"
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                story.select(index);
              }}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
