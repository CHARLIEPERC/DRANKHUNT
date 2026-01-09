// JS/Application.js

// Create StartScreen once (and make it accessible in console if needed)
window.startScreen = new StartScreen();

// Inline onclick calls this, so it must be global.
window.launchApplication = function () {
  try {
    const ss = window.startScreen;

    // Get parameters from the start screen (your StartScreen.js should provide this)
    const gameParameters =
      (ss && typeof ss.getGameParametersFromUserSelect === "function")
        ? ss.getGameParametersFromUserSelect()
        : {};

    const mode = (gameParameters && gameParameters.modeName) ? String(gameParameters.modeName).toUpperCase() : "CLASSIC";

    // Choose a game constructor that actually exists in your build
    // Priority: Extreme/Modern/Classic variants if they exist, otherwise fall back to Game.
    const GameCtor =
      (mode === "EXTREME" && window.ExtremeGame) ||
      (mode === "MODERN" && window.ModernGame) ||
      (mode === "CLASSIC" && window.ClassicGame) ||
      window.ClassicGame ||
      window.Game;

    if (typeof GameCtor !== "function") {
      throw new Error(
        "No game constructor found. Expected Game or ClassicGame/ModernGame/ExtremeGame on window."
      );
    }

    const game = new GameCtor(gameParameters);

    // Hide start UI (try StartScreen method first, then hard hide the DOM)
    if (ss && typeof ss.hideStartScreen === "function") {
      ss.hideStartScreen();
    } else {
      const startEl = document.getElementById("startScreen");
      if (startEl) startEl.classList.add("is-hidden");
    }

    // Stop menu music if available
    if (ss && typeof ss.stopMenuMusic === "function") {
      ss.stopMenuMusic();
    }

    // Make sure the game can receive clicks
    const blocker = document.getElementById("shootBlocker");
    if (blocker) blocker.style.display = "none";

    // Start gameplay (support different method names)
    if (typeof game.startGame === "function") {
      game.startGame();
    } else if (typeof game.start === "function") {
      game.start();
    } else {
      throw new Error("Game instance has no startGame() or start() method.");
    }
  } catch (err) {
    console.error("launchApplication failed:", err);
    alert(
      "Start failed. Open DevTools Console and copy the red error text (and the line it points to)."
    );
  }
};
