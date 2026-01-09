// JS/Application.js

var startScreen = new StartScreen();

function launchApplication() {
  // Get mode selection from the start screen UI
  const gameParameters = startScreen.getGameParametersFromUserSelect();
  const selectedModeName = gameParameters.modeName;

  let selectedMode;
  if (selectedModeName === "EXTREME") {
    selectedMode = new ExtremeGame(gameParameters);
  } else if (selectedModeName === "MODERN") {
    selectedMode = new ModernGame(gameParameters);
  } else {
    selectedMode = new ClassicGame(gameParameters);
  }

  // Hide start UI and stop menu music
  startScreen.hideStartScreen();
  startScreen.stopMenuMusic();

  // Start gameplay
  selectedMode.startGame();
}
