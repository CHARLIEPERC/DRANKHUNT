// JS/Application.js

var startScreen = new StartScreen();

window.launchApplication = function () {
  // Read selected mode
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
  startScreen.stopMenuMusic();

  // Start gameplay
  game.startGame();
};
