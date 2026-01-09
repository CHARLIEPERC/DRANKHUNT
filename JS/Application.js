var startScreen = new StartScreen();

function launchApplication() {
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

    // ✅ STOP menu music exactly when gameplay begins
    startScreen.stopMenuMusic();

    selectedMode.startGame();
}
