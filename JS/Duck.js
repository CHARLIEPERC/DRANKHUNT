class Duck {

  constructor(id, duckMovesNumber) {
    this.duckMovesNumber = duckMovesNumber;
    this.duckId = `#${id}`;
    this.isAlive = true;
    this.moveCount = 0;
    this.duckFlight = null;
    this.currentWidth = 48;
    this.currentHeight = 20;
    this.lastDirection = "right";
    this.frameIndex = 0;
    this.frameTimer = null;
    this.frameIntervalMs = 100;
    this.currentFrames = null;
    this.frames = {
      right: [
        "/DRANKHUNT/resources/sprites/duck/png/right1.png",
        "/DRANKHUNT/resources/sprites/duck/png/right2.png",
        "/DRANKHUNT/resources/sprites/duck/png/right3.png"
      ],
      left: [
        "/DRANKHUNT/resources/sprites/duck/png/left1.png",
        "/DRANKHUNT/resources/sprites/duck/png/left2.png",
        "/DRANKHUNT/resources/sprites/duck/png/left3.png"
      ],
      rightup: [
        "/DRANKHUNT/resources/sprites/duck/png/rightup1.png",
        "/DRANKHUNT/resources/sprites/duck/png/rightup2.png",
        "/DRANKHUNT/resources/sprites/duck/png/rightup3.png"
      ],
      rightdown: [
        "/DRANKHUNT/resources/sprites/duck/png/rightdown1.png",
        "/DRANKHUNT/resources/sprites/duck/png/rightdown2.png",
        "/DRANKHUNT/resources/sprites/duck/png/rightdown3.png"
      ],
      leftup: [
        "/DRANKHUNT/resources/sprites/duck/png/leftup1.png",
        "/DRANKHUNT/resources/sprites/duck/png/leftup2.png",
        "/DRANKHUNT/resources/sprites/duck/png/leftup3.png"
      ],
      leftdown: [
        "/DRANKHUNT/resources/sprites/duck/png/leftdown1.png",
        "/DRANKHUNT/resources/sprites/duck/png/leftdown2.png",
        "/DRANKHUNT/resources/sprites/duck/png/leftdown3.png"
      ],
      fallingright: ["/DRANKHUNT/resources/sprites/duck/png/fallingright.png"],
      fallingleft: ["/DRANKHUNT/resources/sprites/duck/png/fallingleft.png"]
    };
  }

  startFlight() {
    this.resurrect();
    this.startFrameAnimation();
    this.duckFlight = setInterval(() => this.fly(), 1000);
  }

  resurrect() {
    this.isAlive = true;
    this.moveCount = 0;
    this.currentWidth = 48;
    this.currentHeight = 20;
    this.moveToInitialPosition();
    // Make duck visible after positioning
    $(this.duckId).css('visibility', 'visible');
  }

  stopFlightAnimation() {
    clearInterval(this.duckFlight);
    this.stopFrameAnimation();
    $(this.duckId).stop(true);
  }

  moveToInitialPosition() {
    // Measure the actual .bushes element height to compute the ground baseline in pixels
    const bushes = document.querySelector('.bushes');
    const groundBaselinePx = bushes ? bushes.getBoundingClientRect().height : 340;
    
    // Set the CSS custom property so CSS and other JS can use the measured pixel value
    document.documentElement.style.setProperty('--ground-baseline', `${groundBaselinePx}px`);
    
    // Get duck elevation from CSS var
    const root = getComputedStyle(document.documentElement);
    const duckElevRaw = root.getPropertyValue('--duck-elev').trim();
    const duckElevPx = parseInt(duckElevRaw, 10) || 80;
    
    // Set duck bottom so it's duckElevPx above the top of the grass
    const bottomPx = groundBaselinePx + duckElevPx;
    $(this.duckId).css('bottom', bottomPx + 'px');
  }

  flyOut() {
    this.stopFlightAnimation();
    let destWidth = this.getRandomWidth(10, 85);
    this.changeDuckBackground(destWidth, 100);
    $(this.duckId).animate({ bottom: `100%`, left: `${destWidth}%` }, 500);
  }

  fallDown() {
    this.isAlive = false;
    let this_ = this;
    this.stopFlightAnimation();
    $(this.duckId).css("background-image", "url(/DRANKHUNT/resources/sprites/duck/png/hit.png)");

    setTimeout(function () {
      let fallingFrames = this_.lastDirection === "left" ? this_.frames.fallingleft : this_.frames.fallingright;
      $(this_.duckId)
        .css("background-image", `url(${fallingFrames[0]})`)
        .animate({ bottom: `10%` }, 650);
    }, 150);
  }

  fly() {
    this.moveCount++;
    let destWidth = this.getRandomWidth(10, 85);
    let destHeight = this.getRandomHeight(35, 85);
    this.changeDuckBackground(destWidth, destHeight);
    $(this.duckId).animate({ bottom: `${destHeight}%`, left: `${destWidth}%` }, 1000);
    this.currentWidth = destWidth;
    this.currentHeight = destHeight;
  }

  changeDuckBackground(destWidth, destHeight) {
    let direction = "right";
    if (destWidth > this.currentWidth) {
      direction = "right";
      if (destHeight - this.currentHeight > 20) { direction = "rightup"; }
      if (destHeight - this.currentHeight < -20) { direction = "rightdown"; }
    } else {
      direction = "left";
      if (destHeight - this.currentHeight > 20) { direction = "leftup"; }
      if (destHeight - this.currentHeight < -20) { direction = "leftdown"; }
    }
    this.lastDirection = direction.startsWith("left") ? "left" : "right";
    this.currentFrames = this.frames[direction];
  }

  setDuckFrame(frames) {
    this.frameIndex = (this.frameIndex + 1) % frames.length;
    $(this.duckId).css("background-image", `url(${frames[this.frameIndex]})`);
  }

  startFrameAnimation() {
    if (this.frameTimer) return;
    this.currentFrames = this.frames.right;
    this.setDuckFrame(this.currentFrames);
    this.frameTimer = setInterval(() => {
      if (!this.isAlive || !this.currentFrames) return;
      this.setDuckFrame(this.currentFrames);
    }, this.frameIntervalMs);
  }

  stopFrameAnimation() {
    if (this.frameTimer) {
      clearInterval(this.frameTimer);
      this.frameTimer = null;
    }
  }

  getRandomWidth(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  getRandomHeight(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
