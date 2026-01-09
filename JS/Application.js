var startScreen = new StartScreen();

function launchApplication() {
    startScreen.stopMenuMusic();
    let gameParameters = startScreen.getGameParametersFromUserSelect();
    let selectedModeName = gameParameters.modeName;
    let selectedMode;

    if (selectedModeName == "EXTREME") {
        selectedMode = new ExtremeGame(gameParameters);
    }
    else if(selectedModeName == "MODERN"){
        selectedMode = new ModernGame(gameParameters);
    }
    else{
        selectedMode = new ClassicGame(gameParameters);
    }

startScreen.hideStartScreen();
// don't stop the menu music immediately — user click is the gesture used to start playback
// keep it playing so audio starts reliably. If you want to stop it later, do so with a deliberate call.
// startScreen.stopMenuMusic();
selectedMode.startGame();
}
