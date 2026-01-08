/* JS/Dog.js
 * Updated: add liftGroundToDog() to raise the .bushes (ground) top to the dog's feet
 * and update CSS variables. Also provides window.raiseGroundToDog(dogSelector)
 * for convenient testing.
 *
 * This file preserves the existing dog-offset logic (calculating offsets,
 * feet position, and left/right offsets) while adding the new helper.
 */

class Dog {
  constructor(selectorOrElement) {
    if (!selectorOrElement) throw new Error('Dog requires a selector or element');
    if (typeof selectorOrElement === 'string') {
      this.el = document.querySelector(selectorOrElement);
    } else {
      this.el = selectorOrElement;
    }
    if (!this.el) throw new Error('Dog element not found');
  }

  // --- Previous dog-offset logic (preserved) ---
  // Returns an object with top/left/right/bottom/width/height in document coordinates
  getOffsets() {
    const rect = this.el.getBoundingClientRect();
    const docEl = document.documentElement;
    const scrollTop = window.pageYOffset || docEl.scrollTop || 0;
    const scrollLeft = window.pageXOffset || docEl.scrollLeft || 0;

    const top = rect.top + scrollTop;
    const left = rect.left + scrollLeft;
    const bottom = rect.bottom + scrollTop;
    const right = rect.right + scrollLeft;

    return {
      top,
      left,
      bottom,
      right,
      width: rect.width,
      height: rect.height,
      // feetY: the y coordinate where the dog's feet touch the ground (use bottom)
      feetY: bottom,
      // centerX for any horizontal alignment calculations
      centerX: left + rect.width / 2
    };
  }

  // Convenience: returns the vertical distance from the top of the document
  // to the dog's feet
  getFeetY() {
    return this.getOffsets().feetY;
  }

  // New: raises the .bushes (ground) element so its top aligns with the dog's feet.
  // Also updates CSS variables on :root for easy theming/testing.
  // Behavior:
  // - Finds the first element matching '.bushes' in the document.
  // - Computes the document Y coordinate of the dog's feet.
  // - Sets the ground element's inline style.top so that the ground's top
  //   aligns with the dog's feet (positioning is relative to ground.offsetParent).
  // - Updates CSS variables on document.documentElement:
  //     --ground-top: absolute document Y (px) of the ground top
  //     --dog-feet-y: absolute document Y (px) of the dog's feet
  //     --ground-top-local: top value (px) applied to the ground element (relative to offsetParent)
  // Returns an object with details about the applied values for testability.
  liftGroundToDog() {
    const ground = document.querySelector('.bushes');
    if (!ground) {
      console.warn('liftGroundToDog: .bushes element not found');
      return null;
    }

    // Ensure the ground element is positioned so `top` has an effect.
    // We do not override existing positioning if it is already absolute/fixed/relative.
    const computed = window.getComputedStyle(ground);
    if (!/absolute|fixed|relative/.test(computed.position)) {
      // Default to absolute so we can set top relative to offsetParent.
      ground.style.position = 'absolute';
    }

    const dogFeetY = this.getFeetY();

    // Compute the top of the ground relative to its offsetParent.
    // If offsetParent is null, treat as document root (top = 0).
    const offsetParent = ground.offsetParent;
    const parentRect = offsetParent ? offsetParent.getBoundingClientRect() : { top: 0 };
    const parentScrollTop = window.pageYOffset || document.documentElement.scrollTop || 0;
    const parentTopDoc = (parentRect.top || 0) + parentScrollTop;

    // We want ground.getBoundingClientRect().top (document coordinates) === dogFeetY
    // To set that we need top_local = dogFeetY - parentTopDoc
    const topLocalPx = Math.round(dogFeetY - parentTopDoc);

    // Apply the top to the ground element
    ground.style.top = topLocalPx + 'px';

    // Update CSS variables on :root to reflect the new positions. These are convenient
    // for CSS-driven visuals or debugging overlays.
    const root = document.documentElement;
    root.style.setProperty('--ground-top', dogFeetY + 'px');
    root.style.setProperty('--dog-feet-y', dogFeetY + 'px');
    root.style.setProperty('--ground-top-local', topLocalPx + 'px');

    // Return details for testing/assertions
    return {
      groundElement: ground,
      appliedTopLocal: topLocalPx,
      groundTopDocumentY: dogFeetY,
      dogFeetY
    };
  }
}

// Export for module systems and also attach to window for quick dev access
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = Dog;
}

if (typeof window !== 'undefined') {
  window.Dog = Dog;

  // Quick helper for manual testing in the console:
  // e.g. window.raiseGroundToDog('#myDog') or window.raiseGroundToDog(document.querySelector('.dog'))
  window.raiseGroundToDog = function(dogSelector) {
    try {
      const dog = typeof dogSelector === 'string' ? document.querySelector(dogSelector) : dogSelector;
      if (!dog) {
        console.warn('raiseGroundToDog: dog element not found for selector', dogSelector);
        return null;
      }
      const instance = new Dog(dog);
      return instance.liftGroundToDog();
    } catch (err) {
      console.error('raiseGroundToDog error:', err);
      throw err;
    }
  };
}

export default Dog;
