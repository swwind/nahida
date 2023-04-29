/**
 * Manage all callbacks when user clicks
 */
export class CallbackStack {
  animations: Set<Animation> = new Set();

  /**
   * click callbacks
   *
   * text waiting
   */
  callbacks: (() => void)[] = [];

  /**
   * selection waiting
   *
   * no click callbacks can trigger before this resolves
   */
  selection: ((data: number) => void) | null = null;

  async waitClick() {
    await new Promise<void>((resolve) => {
      this.callbacks.push(() => {
        this.callbacks.pop();
        resolve();
      });
    });
  }

  async waitSelection(fn: (selection: number) => void) {
    await new Promise<void>((resolve) => {
      this.selection = (selection) => {
        this.selection = null;
        fn(selection);
        resolve();
      };
    });
  }

  async waitAnimation() {
    const animations = [...this.animations];
    await Promise.all(animations.map((animation) => animation.finished));
  }

  async waitAnimations(animations: Animation[]) {
    await Promise.all(
      animations.map(async (animation) => {
        this.animations.add(animation);
        await animation.finished;
        this.animations.delete(animation);
      })
    );
  }

  step() {
    if (this.selection) {
      // skip if a selection is wanted
      return;
    }

    if (this.animations.size > 0) {
      // finish all unfinished animations
      this.animations.forEach((animation) => {
        animation.finish();
      });
      return;
    }

    if (this.callbacks.length > 0) {
      // handle callback
      this.callbacks[this.callbacks.length - 1]();
    }
  }

  select(selection: number) {
    if (this.selection) {
      this.selection(selection);
    }
  }
}
