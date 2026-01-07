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

  launchWalkoutAnimation() {
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

    // Compute pixel baseline from CSS var --fg-h and animate using px values so dog lands on grass.
    var root = getComputedStyle(document.documentElement);
    var fgRaw = root.getPropertyValue('--fg-h').trim();    // e.g. "30vh" or "340px"
    var dogRaw = root.getPropertyValue('--dog-h').trim();  // e.g. "84px" after mobile scaling

    function toPx(raw) {
      if (!raw) return 0;
      raw = raw.trim();
      if (raw.endsWith('vh')) {
        var vh = window.innerHeight;
        var v = parseFloat(raw.slice(0, -2));
        return Math.round((v / 100) * vh);
      }
      return parseInt(raw, 10) || 0;
    }

    var fgPx = toPx(fgRaw);
    var dogPx = toPx(dogRaw);

    // groundBottomPx is the distance from wrapper bottom to the top of the grass
    var groundBottomPx = fgPx;
    var sniffLiftPx = Math.round(dogPx * 0.6); // lift amount for sniff/walk animation (tweakable)

    $(this.dogId)
      .css('bottom', groundBottomPx + 'px')
      .animate({ bottom: (groundBottomPx - sniffLiftPx) + 'px' }, 600)
      .animate({ bottom: (groundBottomPx - sniffLiftPx) + 'px' }, 800)
      .animate({ bottom: groundBottomPx + 'px' }, 600);
  }
}
