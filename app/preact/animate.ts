export function animate(
  fn: (t: number) => void,
  start: number,
  end: number,
  duration: number
) {
  fn(start);

  return new Promise<void>((resolve) => {
    const startTime = Date.now();

    function finish() {
      fn(end);
      resolve();
    }

    function frame() {
      const now = Date.now();

      if (now >= startTime + duration) {
        finish();
        return;
      }

      requestAnimationFrame(frame);

      const progress = (now - startTime) / duration;
      fn(progress * (end - start) + start);
    }

    frame();
  });
}
