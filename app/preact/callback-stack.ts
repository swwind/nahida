/**
 * Manage all callbacks when user clicks
 */
export class CallbackStack {
  callbacks: (() => void)[] = [];

  async waitClick() {
    await new Promise<void>((resolve) => {
      this.callbacks.push(() => {
        this.callbacks.pop();
        resolve();
      });
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
    if (this.callbacks.length > 0) {
      this.callbacks[this.callbacks.length - 1]();
    }
  }
}
