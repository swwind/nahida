export interface SimpleAnimation {
  finish(): void;
  finished: Promise<void>;
}

export type StoryAnimation = Animation | SimpleAnimation;

/**
 * Plays an animation which is skippable
 *
 * starts with callback(0), and ends with callback(1)
 */
export function animate(
  callback: (t: number) => void,
  duration: number
): SimpleAnimation {
  let skipped = false;
  callback(0);

  const finished = new Promise<void>((resolve) => {
    const startTime = Date.now();

    function frame() {
      const now = Date.now();

      if (skipped || now >= startTime + duration) {
        callback(1);
        resolve();
        return;
      }

      requestAnimationFrame(frame);
      callback((now - startTime) / duration);
    }

    frame();
  });

  function finish() {
    skipped = true;
  }

  return {
    finish,
    finished,
  };
}

export function justWait(time: number): SimpleAnimation {
  let resolveFn: (() => void) | null = null;

  const finished = new Promise<void>((resolve) => {
    resolveFn = resolve;
  });

  const finish = () => {
    if (resolveFn) {
      resolveFn();
      resolveFn = null;
    }
  };

  setTimeout(finish, time);

  return { finish, finished };
}
