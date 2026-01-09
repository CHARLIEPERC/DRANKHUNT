// JS/Application.js

var startScreen = null;

function launchApplication() {
  // Create StartScreen only when we actually start (avoids "StartScreen is not defined")
if (!startScreen) {
  if (typeof StartScreen !== "function") {
    console.error("StartScreen is not loaded. Check index.html script order.");
    return;
  }
  startScreen = new StartScreen();
}

  // Menu music behavior (guarded)
  if (typeof startScreen.playMenuMusic === "function") {
    startScreen.playMenuMusic();
  }

  const gameParameters =
    typeof startScreen.getGameParametersFromUserSelect === "function"
      ? startScreen.getGameParametersFromUserSelect()
      : null;

  if (!gameParameters || !gameParameters.modeName) {
    console.error("Could not read game parameters from StartScreen.");
    return;
  }

  const selectedModeName = gameParameters.modeName;
  let selectedMode;

  if (selectedModeName === "EXTREME") {
    selectedMode = new ExtremeGame(gameParameters);
  } else if (selectedModeName === "MODERN") {
    selectedMode = new ModernGame(gameParameters);
  } else {
    selectedMode = new ClassicGame(gameParameters);
  }

  if (typeof startScreen.hideStartScreen === "function") {
    startScreen.hideStartScreen();
  }

  // Stop menu music when gameplay begins
  if (typeof startScreen.stopMenuMusic === "function") {
    startScreen.stopMenuMusic();
  }

  const startGameplay = () => selectedMode.startGame();

  // If BootIntro exists, show it, otherwise start immediately.
  if (window.showBootIntro && typeof window.showBootIntro === "function") {
    window.showBootIntro({
      logoSrc: "resources/sprites/slumpedboy-logo.png",
      onDone: startGameplay
    });
  } else {
    startGameplay();
  }
}
