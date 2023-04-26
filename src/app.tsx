import { useSignal } from "@preact/signals";
import Game from "./pages/game";

export default function () {
  const start = useSignal(false);

  if (start.value) {
    return <Game />;
  }

  return (
    <div
      class="text-white w-full h-full bg-black"
      onClick={() => (start.value = true)}
    >
      <h1 class="text-5vvw">点击任意位置开始</h1>
    </div>
  );
}
