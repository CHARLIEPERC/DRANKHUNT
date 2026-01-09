var startScreen = new StartScreen();

function launchApplication() {
  // Play menu music on start screen (existing behavior)
  startScreen.playMenuMusic();

  let gameParameters = startScreen.getGameParametersFromUserSelect();
  let selectedModeName = gameParameters.modeName;
  let selectedMode;

  if (selectedModeName === "EXTREME") {
    selectedMode = new ExtremeGame(gameParameters);
  } else if (selectedModeName === "MODERN") {
    selectedMode = new ModernGame(gameParameters);
  } else {
    selectedMode = new ClassicGame(gameParameters);
  }

  startScreen.hideStartScreen();

  // Stop menu music once gameplay is about to begin
  startScreen.stopMenuMusic();

  // Show boot intro, then start game
  window.showBootIntro({
    logoSrc: "resources/sprites/slumpedboy-logo.png",
    onDone: () => selectedMode.startGame()
  });
}
