
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

  // Returns a positive pixel value for the ground baseline.
  // Only accepts a non-zero measured .bushes height. Falls back to CSS --fg-h (vh/px) or 30vh.
  getGroundBaselinePx() {
    const bushes = document.querySelector('.bushes');
    if (bushes) {
      const h = Math.round(bushes.getBoundingClientRect().height);
      if (h > 0) return h; // IMPORTANT: only accept non-zero
    }

    const root = getComputedStyle(document.documentElement);
    const fg = (root.getPropertyValue('--fg-h') || '').trim();
    if (fg.endsWith('vh')) {
      return Math.round(window.innerHeight * parseFloat(fg) / 100);
    }
    if (fg.endsWith('px')) {
      return parseInt(fg, 10) || 0;
    }

    // final fallback: 30vh of viewport height
    return Math.round(window.innerHeight * 0.30);
  }

  // Position dog on grass using measured baseline; sets CSS var and inline bottom.
  positionDogOnGrass() {
    const ground = this.getGroundBaselinePx();
    if (!ground || ground <= 0) return; // guard: nothing to do if still 0

    // set CSS var with px unit so existing calc(var(--ground-baseline)) works
    document.documentElement.style.setProperty('--ground-baseline', `${ground}px`);

    // anchor the dog immediately and clear interfering inline styles
    $(this.dogId).css({ bottom: ground + 'px', top: '', transform: '' });
  }

  launchWalkoutAnimation() {
    // Try to position after layout: requestAnimationFrame + short timeouts to retry
    const apply = () => this.positionDogOnGrass();
    requestAnimationFrame(apply);
    setTimeout(apply, 50);
    setTimeout(apply, 200);

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

    // Ensure dog is positioned after layout; same retry pattern as walkout
    const apply = () => this.positionDogOnGrass();
    requestAnimationFrame(apply);
    setTimeout(apply, 50);
    setTimeout(apply, 200);

    // Now proceed with the sniff/jump animation relative to the measured baseline
    const groundBaselinePx = this.getGroundBaselinePx();

    const root = getComputedStyle(document.documentElement);
    const dogRaw = root.getPropertyValue('--dog-h').trim();
    const dogPx = parseInt(dogRaw, 10) || 56;

    const sniffLiftPx = Math.round(dogPx * 0.6); // lift amount for sniff/walk animation (tweakable)

    $(this.dogId)
      .css('bottom', groundBaselinePx + 'px')
      .animate({ bottom: (groundBaselinePx - sniffLiftPx) + 'px' }, 600)
      .animate({ bottom: (groundBaselinePx - sniffLiftPx) + 'px' }, 800)
      .animate({ bottom: groundBaselinePx + 'px' }, 600);
  }
}
