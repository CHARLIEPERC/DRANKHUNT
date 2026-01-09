// JS/Application.js

// Make StartScreen instance once.
var startScreen = new StartScreen();

// Make it GLOBAL so inline onclick="launchApplication()" works.
window.launchApplication = function () {
  try {
    // Read selected mode + params (still used for ammo/moves/etc)
    const gameParameters = startScreen.getGameParametersFromUserSelect();

    // Pick a constructor that actually exists
    const Ctor =
      window.ClassicGame ||
      window.ModernGame ||
      window.ExtremeGame ||
      window.Game;

    if (!Ctor) {
      throw new Error(
        "No game constructor found. Expected window.Game or window.ClassicGame/ModernGame/ExtremeGame to exist."
      );
    }

    const game = new Ctor(gameParameters);

    // Hide menu + stop menu music
    startScreen.hideStartScreen();
    if (typeof startScreen.stopMenuMusic === "function") {
      startScreen.stopMenuMusic();
    }

    // Start gameplay
    game.startGame();
  } catch (err) {
    console.error("launchApplication failed:", err);

    // Helpful debug dump
    console.log("Constructors:", {
      Game: typeof window.Game,
      ClassicGame: typeof window.ClassicGame,
      ModernGame: typeof window.ModernGame,
      ExtremeGame: typeof window.ExtremeGame,
      StartScreen: typeof window.StartScreen,
    });

    alert("Start failed. Open DevTools Console and copy the red error text (and the line it points to).");
  }
};
