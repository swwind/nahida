import { useContext } from "preact/hooks";
import { RouterContext } from "../route";

export function useRouter() {
  const router = useContext(RouterContext);

  if (!router) {
    throw new Error(
      "Failed to get router, please nest your component in <StoryProvider />"
    );
  }

  return router;
}
