class StartScreen {

  constructor() {
    this.availableModes = [];
    this.currentModeIndex = 0;

    this.menuMusic = new Audio("/DRANKHUNT/resources/sounds/menu.mp3");
    this.menuMusic.loop = true;
    this.menuMusic.volume = 0.3;

    this.initializeModes();
    this.initializeButtons();
    this.displaySettingsForCurrentMode();

    // Try to play menu music (safe if blocked)
    try {
      this.playMenuMusic();
    } catch (e) {}
  }

  initializeModes() {
    this.availableModes.push(
      { name: "CLASSIC", moves: 7, ammunition: 3, ducks: 2 },
      { name: "MODERN", moves: 6, ammunition: 5, ducks: 3 },
      { name: "EXTREME", moves: 7, ammunition: 50, ducks: 1 }
    );
  }

  initializeButtons() {
    $("#prevMode").off("click").on("click", () => this.changeMode("prev"));
    $("#nextMode").off("click").on("click", () => this.changeMode("next"));
  }

  changeMode(toggle) {
    if (toggle === "next") {
      this.currentModeIndex = (this.currentModeIndex + 1) % this.availableModes.length;
    } else {
      this.currentModeIndex =
        (this.currentModeIndex - 1 + this.availableModes.length) % this.availableModes.length;
    }
    this.displaySettingsForCurrentMode();
  }

  displaySettingsForCurrentMode() {
    const selectedMode = this.availableModes[this.currentModeIndex];
    $("#modeSelect .selection").html(selectedMode.name);
  }

  getGameParametersFromUserSelect() {
    const selectedMode = this.availableModes[this.currentModeIndex];
    return {
      modeName: selectedMode.name,
      ducksNumber: selectedMode.ducks,
      movesNumber: selectedMode.moves,
      initialAmmo: selectedMode.ammunition
    };
  }

  // 🔑 SAFE FIX: never crash if element is missing
  hideStartScreen() {
    const el = document.querySelector(".startScreen");

    if (!el) {
      console.warn("Start screen element not found, skipping hide.");
      return;
    }

    el.style.display = "none";
  }

  playMenuMusic() {
    this.menuMusic.play().catch(() => {});
  }

  stopMenuMusic() {
    this.menuMusic.pause();
    this.menuMusic.currentTime = 0;
  }
}
