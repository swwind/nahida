/**
 * Manage all callbacks when user clicks
 */
export class CallbackStack {
  /**
   * click callbacks
   *
   * text waiting, or animation skipping
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

  async waitAnimations(elem: Element) {
    const animations = elem.getAnimations();

    // on skip
    this.callbacks.push(() => {
      animations.forEach((animation) => animation.finish());
    });

    // on finish (or skipped)
    await Promise.all(animations.map((animation) => animation.finished));
    this.callbacks.pop();
  }

  step() {
    if (this.selection) {
      // skip if a selection is wanted
      return;
    }

    if (this.callbacks.length > 0) {
      this.callbacks[this.callbacks.length - 1]();
    }
  }

  select(selection: number) {
    if (this.selection) {
      this.selection(selection);
    }
  }
}
