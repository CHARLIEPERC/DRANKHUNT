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

  // Measure bushes and apply CSS variable + inline bottom for immediate anchoring.
  computeGroundBaseline() {
    const bushes = document.querySelector('.bushes');
    const groundBaselinePx = bushes ? Math.round(bushes.getBoundingClientRect().height) : 340;
    // Ensure CSS var includes unit
    document.documentElement.style.setProperty('--ground-baseline', `${groundBaselinePx}px`);
    // Also set inline bottom on the dog element so it's positioned immediately
    $(this.dogId).css('bottom', `${groundBaselinePx}px`);
    return groundBaselinePx;
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

    const sniffLiftPx = Math.round(dogPx * 0.6); // lift amount for sniff/walk animation (tweakable)

    $(this.dogId)
      .css('bottom', `${groundBaselinePx}px`)
      .animate({ bottom: `${groundBaselinePx - sniffLiftPx}px` }, 600)
      .animate({ bottom: `${groundBaselinePx - sniffLiftPx}px` }, 800)
      .animate({ bottom: `${groundBaselinePx}px` }, 600);
  }
}
