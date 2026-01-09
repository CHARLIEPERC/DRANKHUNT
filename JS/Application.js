// JS/Application.js

var startScreen = new StartScreen();

// Make it GLOBAL so inline onclick="launchApplication()" works.
window.launchApplication = function () {
  try {
    // Read selected mode + params
    const gameParameters = startScreen.getGameParametersFromUserSelect();
    const mode = gameParameters.modeName;

    let game;
    if (mode === "EXTREME") {
      game = new ExtremeGame(gameParameters);
    } else if (mode === "MODERN") {
      game = new ModernGame(gameParameters);
    } else {
      game = new ClassicGame(gameParameters);
    }

    // Hide menu + stop menu music
    startScreen.hideStartScreen();
    if (typeof startScreen.stopMenuMusic === "function") {
      startScreen.stopMenuMusic();
    }

    // Start gameplay
    game.startGame();
  } catch (err) {
    console.error("launchApplication failed:", err);
    alert("Start failed. Open DevTools Console and send the red error text.");
  }
};
