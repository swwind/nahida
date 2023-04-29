import { RouterOutlet, StoryProvider, createRouter } from "@/preact";

import { Game } from "./pages/game";
import { Menu } from "./pages/menu";
import { Settings } from "./pages/settings";

const router = createRouter({
  game: () => <Game />,
  settings: () => <Settings />,
});

export function App() {
  return (
    <StoryProvider router={router}>
      <RouterOutlet>
        <Menu />
      </RouterOutlet>
    </StoryProvider>
  );
}
