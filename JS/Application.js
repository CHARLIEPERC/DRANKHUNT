// JS/Application.js

var startScreen = new StartScreen();

window.launchApplication = function () {
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

  startScreen.hideStartScreen();
  startScreen.stopMenuMusic();

  game.startGame();
};
