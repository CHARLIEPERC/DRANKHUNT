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

  computeGroundBaseline() {
    const groundBaselinePx = this.getGroundBaselinePx();
    document.documentElement.style.setProperty('--ground-baseline', `${groundBaselinePx}px`);
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
    const effectiveBottom = Math.max(0, groundBaselinePx - dogOffsetPx);
    $(this.dogId).css('bottom', `${effectiveBottom}px`);
    return groundBaselinePx;
  }

  getGroundBaselinePx() {
    const bushes = document.querySelector('.bushes');
    const gameWrap = document.getElementById('gameWrap');
    if (bushes && gameWrap) {
      const bushesRect = bushes.getBoundingClientRect();
      const gameWrapRect = gameWrap.getBoundingClientRect();
      const baselinePx = Math.round(gameWrapRect.bottom - bushesRect.top);
      if (baselinePx > 0 && baselinePx < Math.round(gameWrapRect.height)) {
        return baselinePx;
      }
    }
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
    const fallbackValue = Math.round(window.innerHeight * 0.30);
    return fallbackValue > 0 ? fallbackValue : 100;
  }

  launchWalkoutAnimation() {
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
    const groundBaselinePx = this.computeGroundBaseline();
    const root = getComputedStyle(document.documentElement);
    const dogRaw = root.getPropertyValue('--dog-h').trim();
    const dogPx = parseInt(dogRaw, 10) || 56;
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
    const sniffLiftPx = Math.round(dogPx * 0.6);
    $(this.dogId)
      .css('bottom', `${effectiveBottom}px`)
      .animate({ bottom: `${effectiveBottom - sniffLiftPx}px` }, 600)
      .animate({ bottom: `${effectiveBottom - sniffLiftPx}px` }, 800)
      .animate({ bottom: `${effectiveBottom}px` }, 600);
  }

  // New helper: liftGroundToDog(dogSelector, options)
  liftGroundToDog(dogSelector = '#dog1', options = { animate: true, animationMs: 300 }) {
    const dogEl = document.querySelector(dogSelector);
    const gameWrap = document.getElementById('gameWrap');
    const bushes = document.querySelector('.bushes');
    if (!dogEl || !gameWrap || !bushes) return null;
    const dogRect = dogEl.getBoundingClientRect();
    const gameRect = gameWrap.getBoundingClientRect();
    const dogFeetY = dogRect.bottom;
    let newFgH = Math.round(gameRect.height - (dogFeetY - gameRect.top));
    const minFgH = 40;
    const maxFgH = Math.round(gameRect.height - 20);
    newFgH = Math.max(minFgH, Math.min(maxFgH, newFgH));
    const root = document.documentElement;
    root.style.setProperty('--fg-h', `${newFgH}px`);
    if (options.animate) {
      const startH = parseInt(getComputedStyle(bushes).height, 10);
      const endH = newFgH;
      const duration = Math.max(0, options.animationMs || 300);
      const start = performance.now();
      const step = (ts) => {
        const t = Math.min(1, (ts - start) / duration);
        const ease = (t < 0.5) ? 2 * t * t : -1 + (4 - 2 * t) * t;
        const curH = Math.round(startH + (endH - startH) * ease);
        bushes.style.height = `${curH}px`;
        bushes.style.backgroundSize = `100% ${curH}px`;
        if (t < 1) requestAnimationFrame(step);
        else {
          bushes.style.height = `${endH}px`;
          bushes.style.backgroundSize = `100% ${endH}px`;
          const baselinePx = this.getGroundBaselinePx();
          root.style.setProperty('--ground-baseline', `${baselinePx}px`);
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
    return { newFgH };
  }
}

// attach helper to window if available
if (typeof window !== 'undefined') {
  window.raiseGroundToDog = function (dogSelector = '#dog1', animate = true) {
    try {
      const dogInstance = window.game && window.game.dog1 ? window.game.dog1 : null;
      if (dogInstance && typeof dogInstance.liftGroundToDog === 'function') {
        return dogInstance.liftGroundToDog(dogSelector, { animate: !!animate, animationMs: 300 });
      }
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
      bushes.style.transition = animate ? 'height 300ms ease, background-size 300ms ease' : '';
      bushes.style.height = `${newFgH}px`;
      bushes.style.backgroundSize = `100% ${newFgH}px`;
      setTimeout(() => { bushes.style.transition = ''; }, 350);
      if (window.game && window.game.dog1 && typeof window.game.dog1.computeGroundBaseline === 'function') {
        window.game.dog1.computeGroundBaseline();
      } else {
        const baseline = (gameRect.bottom - (gameRect.top + (gameRect.height - newFgH)));
        document.documentElement.style.setProperty('--ground-baseline', `${Math.round(baseline)}px`);
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
}
