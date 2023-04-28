import { RouterOutlet, StoryProvider, createRouter } from "@/preact";

import { Game } from "./pages/game";
import { Menu } from "./pages/menu";

const router = createRouter({
  game: () => <Game />,
});

export function App() {
  return (
    <StoryProvider>
      <RouterOutlet router={router}>
        <Menu />
      </RouterOutlet>
    </StoryProvider>
  );
}
