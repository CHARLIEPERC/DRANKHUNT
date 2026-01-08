class Dog {

  constructor(id) {
    this.dogId = `#${id}`;
    this.spriteTimer = null;
    this.walkFrames = [
      "/DRANKHUNT/resources/sprites/dog/walk1.png",
      "/DRANKHUNT/resources/sprites/dog/walk2.png",
      "/DRANKHUNT/resources/sprites/dog/walk3.png",
      "/DRANKHUNT/resources/sprites/dog/walk4.png"
    ];
    this.sniffFrames = [
      "/DRANKHUNT/resources/sprites/dog/sniff1.png",
      "/DRANKHUNT/resources/sprites/dog/sniff2.png"
    ];
    this.jumpFrames = [
      "/DRANKHUNT/resources/sprites/dog/jump1.png",
      "/DRANKHUNT/resources/sprites/dog/jump2.png"
    ];
  }
// (Add the following methods to your existing Dog class file; keep the rest of Dog.js intact)
// Method: liftGroundToDog(dogSelector, options)
// - Computes the dog's visible bottom and raises the .bushes (foreground) height so the bushes top matches the dog's feet.
// - Updates CSS --fg-h and --ground-baseline and forces .bushes height/background-size to match.
// - options: { animate: true/false, animationMs: 300 }
liftGroundToDog(dogSelector = '#dog1', options = { animate: true, animationMs: 300 }) {
  const dogEl = document.querySelector(dogSelector);
  const gameWrap = document.getElementById('gameWrap');
  const bushes = document.querySelector('.bushes');
  if (!dogEl || !gameWrap || !bushes) return null;

  // dog bounding rect and wrapper rect
  const dogRect = dogEl.getBoundingClientRect();
  const gameRect = gameWrap.getBoundingClientRect();

  // Pixel Y of dog's feet (bottom) relative to viewport
  const dogFeetY = dogRect.bottom;

  // We want bushesRect.top == dogFeetY.
  // bushesRect.top = gameRect.top + (gameRect.height - fg_h)
  // => fg_h = gameRect.height - (bushesRect.top - gameRect.top)
  // so set fg_h = gameRect.height - (dogFeetY - gameRect.top)
  let newFgH = Math.round(gameRect.height - (dogFeetY - gameRect.top));

  // Clamp newFgH to reasonable range
  const minFgH = 40; // avoid zero/negative
  const maxFgH = Math.round(gameRect.height - 20); // keep some sky
  newFgH = Math.max(minFgH, Math.min(maxFgH, newFgH));

  // Update CSS variable and direct .bushes styles for immediate visual effect
  const root = document.documentElement;
  root.style.setProperty('--fg-h', `${newFgH}px`);

  if (options.animate) {
    // animate height and background-size using requestAnimationFrame -> simple easing
    const startH = parseInt(getComputedStyle(bushes).height, 10);
    const endH = newFgH;
    const duration = Math.max(0, options.animationMs || 300);
    const start = performance.now();
    const step = (ts) => {
      const t = Math.min(1, (ts - start) / duration);
      const ease = (t < 0.5) ? 2 * t * t : -1 + (4 - 2 * t) * t; // easeInOutQuad-ish
      const curH = Math.round(startH + (endH - startH) * ease);
      bushes.style.height = `${curH}px`;
      bushes.style.backgroundSize = `100% ${curH}px`;
      if (t < 1) requestAnimationFrame(step);
      else {
        // ensure final applied; then recompute baseline
        bushes.style.height = `${endH}px`;
        bushes.style.backgroundSize = `100% ${endH}px`;
        // update ground baseline variable and inline dog bottom
        const baselinePx = this.getGroundBaselinePx();
        root.style.setProperty('--ground-baseline', `${baselinePx}px`);
        // recall any dog-offset logic you have: compute effective bottom as before
        // reuse computeGroundBaseline to apply dog offset and inline bottom
        if (typeof this.computeGroundBaseline === 'function') this.computeGroundBaseline();
      }
    };
    requestAnimationFrame(step);
  } else {
    bushes.style.height = `${newFgH}px`;
    bushes.style.backgroundSize = `100% ${newFgH}px`;
    const baselinePx = this.getGroundBaselinePx();
    root.style.setProperty('--ground-baseline', `${baselinePx}px`);
    if (typeof this.computeGroundBaseline === 'function') this.computeGroundBaseline();
  }

  // Return the value for debugging
  return { newFgH };
}

// Quick window helper for testing from console:
// window.raiseGroundToDog(selector, animate)
window.raiseGroundToDog = function (dogSelector = '#dog1', animate = true) {
  try {
    // If Dog class exists and there is an instance, prefer using its method
    const dogInstance = window.game && window.game.dog1 ? window.game.dog1 : null;
    if (dogInstance && typeof dogInstance.liftGroundToDog === 'function') {
      return dogInstance.liftGroundToDog(dogSelector, { animate: !!animate, animationMs: 300 });
    }
    // Otherwise construct a simple one-off calculation (no JS class)
    const dogEl = document.querySelector(dogSelector);
    const gameWrap = document.getElementById('gameWrap');
    const bushes = document.querySelector('.bushes');
    if (!dogEl || !gameWrap || !bushes) return null;

    const dogRect = dogEl.getBoundingClientRect();
    const gameRect = gameWrap.getBoundingClientRect();
    const dogFeetY = dogRect.bottom;
    let newFgH = Math.round(gameRect.height - (dogFeetY - gameRect.top));
    newFgH = Math.max(40, Math.min(Math.round(gameRect.height - 20), newFgH));

    document.documentElement.style.setProperty('--fg-h', `${newFgH}px`);
    if (animate) {
      // simple CSS transition for quick test
      bushes.style.transition = 'height 300ms ease, background-size 300ms ease';
      bushes.style.height = `${newFgH}px`;
      bushes.style.backgroundSize = `100% ${newFgH}px`;
      setTimeout(() => { bushes.style.transition = ''; }, 350);
    } else {
      bushes.style.height = `${newFgH}px`;
      bushes.style.backgroundSize = `100% ${newFgH}px`;
    }

    // recompute baseline (call existing computeGroundBaseline if available)
    if (window.game && window.game.dog1 && typeof window.game.dog1.computeGroundBaseline === 'function') {
      window.game.dog1.computeGroundBaseline();
    } else {
      const baseline = (gameRect.bottom - (gameRect.top + (gameRect.height - newFgH)));
      document.documentElement.style.setProperty('--ground-baseline', `${Math.round(baseline)}px`);
      // optionally adjust dog bottom inline
      const currentDogOffsetRaw = getComputedStyle(document.documentElement).getPropertyValue('--dog-offset') || '6px';
      const parsed = parseInt(currentDogOffsetRaw, 10) || 6;
      const effectiveBottom = Math.max(0, Math.round(baseline) - parsed);
      dogEl.style.bottom = `${effectiveBottom}px`;
    }

    return { newFgH };
  } catch (e) {
    console.error(e);
    return null;
  }
};
  // Measure bushes and apply CSS variable + inline bottom for immediate anchoring.
  // Apply a small CSS-configurable offset so the dog's feet (visible pixels) align with the grass.
  computeGroundBaseline() {
    const groundBaselinePx = this.getGroundBaselinePx();
    // Ensure CSS var includes unit
    document.documentElement.style.setProperty('--ground-baseline', `${groundBaselinePx}px`);

    // read dog offset from css var --dog-offset (defaults to 6px)
    const root = getComputedStyle(document.documentElement);
    const dogOffsetRaw = (root.getPropertyValue('--dog-offset') || '').trim();
    let dogOffsetPx = 6;
    if (dogOffsetRaw.endsWith('px')) {
      const parsed = parseInt(dogOffsetRaw, 10);
      if (!isNaN(parsed)) dogOffsetPx = parsed;
    } else if (dogOffsetRaw.endsWith('vh')) {
      const parsed = parseFloat(dogOffsetRaw);
      if (!isNaN(parsed)) dogOffsetPx = Math.round(window.innerHeight * parsed / 100);
    }

    // Also set inline bottom on the dog element so it's positioned immediately (apply offset to align feet)
    const effectiveBottom = Math.max(0, groundBaselinePx - dogOffsetPx);
    $(this.dogId).css('bottom', `${effectiveBottom}px`);
    return groundBaselinePx;
  }

  // Returns a positive pixel value for the ground baseline.
  // Measure the distance from the top of .bushes to the bottom of #gameWrap so the dog paws sit on the grass edge.
  getGroundBaselinePx() {
    const bushes = document.querySelector('.bushes');
    const gameWrap = document.getElementById('gameWrap');

    if (bushes && gameWrap) {
      const bushesRect = bushes.getBoundingClientRect();
      const gameWrapRect = gameWrap.getBoundingClientRect();

      // baseline = distance from top of bushes to bottom of gameWrap (so dogs sit on bushes top)
      const baselinePx = Math.round(gameWrapRect.bottom - bushesRect.top);

      // sanity: baseline must be positive and less than the total gameWrap height
      if (baselinePx > 0 && baselinePx < Math.round(gameWrapRect.height)) {
        return baselinePx;
      }
    }

    // fallback: previous behavior — use CSS var --fg-h (vh/px) or 30vh
    const root = getComputedStyle(document.documentElement);
    const fg = (root.getPropertyValue('--fg-h') || '').trim();
    if (fg.endsWith('vh')) {
      const parsed = parseFloat(fg);
      if (!isNaN(parsed) && parsed > 0) {
        const vhValue = Math.round(window.innerHeight * parsed / 100);
        if (vhValue > 0) return vhValue;
      }
    }
    if (fg.endsWith('px')) {
      const pxValue = parseInt(fg, 10);
      if (!isNaN(pxValue) && pxValue > 0) return pxValue;
    }

    // final fallback: 30vh of viewport height, with minimum of 100px
    const fallbackValue = Math.round(window.innerHeight * 0.30);
    return fallbackValue > 0 ? fallbackValue : 100;
  }

  launchWalkoutAnimation() {
    // Ensure baseline is measured and dog is anchored before animations start
    const groundBaselinePx = this.computeGroundBaseline();

    let stopBackground = "url(/DRANKHUNT/resources/sprites/dog/found.png)";

    $(this.dogId)
      .animate({ left: "20%" }, 2000, function () {
        this.startSpriteAnimation(this.sniffFrames, 200);
      }.bind(this))
      .animate({ left: "20%" }, 1000, function () {
        this.startSpriteAnimation(this.walkFrames, 150);
      }.bind(this))
      .animate({ left: "40%" }, 2000, function () {
        this.startSpriteAnimation(this.sniffFrames, 200);
      }.bind(this))
      .animate({ left: "40%" }, 1000, function () {
        this.stopSpriteAnimation();
        $(this.dogId).css("background-image", stopBackground);
      }.bind(this))
      .animate({ left: "40%" }, 500, function () {
        this.startSpriteAnimation(this.jumpFrames, 150);
        $(this.dogId).css("animation-name", "dogJump");
      }.bind(this))
      .animate({ opacity: "40%" }, 700, function () {
        this.stopSpriteAnimation();
        $(this.dogId).css("display", "none");
      }.bind(this));
  }

  startSpriteAnimation(frames, intervalMs) {
    this.stopSpriteAnimation();
    let index = 0;
    $(this.dogId).css("background-image", `url(${frames[index]})`);
    this.spriteTimer = setInterval(() => {
      index = (index + 1) % frames.length;
      $(this.dogId).css("background-image", `url(${frames[index]})`);
    }, intervalMs);
  }

  stopSpriteAnimation() {
    if (this.spriteTimer) {
      clearInterval(this.spriteTimer);
      this.spriteTimer = null;
    }
  }

  showDogWithKilledDucks(killedDucks) {
    this.stopSpriteAnimation();

    if (killedDucks == 0) {
      $(this.dogId).css("backgroundImage", 'url(/DRANKHUNT/resources/sprites/dog/bkztypa1.png)');
    } else if (killedDucks == 1) {
      $(this.dogId).css("backgroundImage", 'url(/DRANKHUNT/resources/sprites/dog/gotOne.png)');
    } else {
      $(this.dogId).css("backgroundImage", 'url(/DRANKHUNT/resources/sprites/dog/gotTwo.png)');
    }

    // Reuse same measurement helper so baseline is accurate when the dog comes out
    const groundBaselinePx = this.computeGroundBaseline();

    // Get dog height from CSS var
    const root = getComputedStyle(document.documentElement);
    const dogRaw = root.getPropertyValue('--dog-h').trim();
    const dogPx = parseInt(dogRaw, 10) || 56;

    // read dog offset from css var --dog-offset (defaults to 6px)
    const dogOffsetRaw = (root.getPropertyValue('--dog-offset') || '').trim();
    let dogOffsetPx = 6;
    if (dogOffsetRaw.endsWith('px')) {
      const parsed = parseInt(dogOffsetRaw, 10);
      if (!isNaN(parsed)) dogOffsetPx = parsed;
    } else if (dogOffsetRaw.endsWith('vh')) {
      const parsed = parseFloat(dogOffsetRaw);
      if (!isNaN(parsed)) dogOffsetPx = Math.round(window.innerHeight * parsed / 100);
    }

    const effectiveBottom = Math.max(0, groundBaselinePx - dogOffsetPx);
    const sniffLiftPx = Math.round(dogPx * 0.6); // lift amount for sniff/walk animation (tweakable)

    $(this.dogId)
      .css('bottom', `${effectiveBottom}px`)
      .animate({ bottom: `${effectiveBottom - sniffLiftPx}px` }, 600)
      .animate({ bottom: `${effectiveBottom - sniffLiftPx}px` }, 800)
      .animate({ bottom: `${effectiveBottom}px` }, 600);
  }
}
