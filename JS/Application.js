// JS/Application.js

// Expose function for inline onclick="launchApplication()"
window.launchApplication = function () {
  try {
    // StartScreen may exist as a global binding (not window.StartScreen)
    const hasStartScreen = (typeof StartScreen !== "undefined");

    // Build / reuse startScreen instance
    const ss = hasStartScreen
      ? (window.__startScreenInstance || (window.__startScreenInstance = new StartScreen()))
      : null;

    // Pull params (or fall back to sane defaults)
    const params = (ss && typeof ss.getGameParametersFromUserSelect === "function")
      ? ss.getGameParametersFromUserSelect()
      : {
          modeName: "CLASSIC",
          movesNumber: 10,
          initialAmmo: 3,
          ducksNumber: 2
        };

    const mode = (params && params.modeName) ? String(params.modeName).toUpperCase() : "CLASSIC";

    // Pick constructor. These might exist as globals, not window.*
    let Ctor = (typeof Game !== "undefined") ? Game : null;

    if (mode === "EXTREME" && typeof ExtremeGame !== "undefined") Ctor = ExtremeGame;
    if (mode === "MODERN" && typeof ModernGame !== "undefined") Ctor = ModernGame;
    if (mode === "CLASSIC" && typeof ClassicGame !== "undefined") Ctor = ClassicGame;

    if (!Ctor) throw new Error("Game constructor not found (Game/ClassicGame/ModernGame/ExtremeGame).");

    const game = new Ctor(params);

    // Hide start screen immediately (no dependency on StartScreen.js)
    const startEl = document.getElementById("startScreen");
    if (startEl) startEl.classList.add("is-hidden");

    // Stop menu music if available
    if (ss && typeof ss.stopMenuMusic === "function") ss.stopMenuMusic();

    // Start gameplay
    if (typeof game.startGame !== "function") throw new Error("game.startGame() missing.");
    game.startGame();
  } catch (err) {
    console.error("launchApplication failed:", err);
    alert("Start failed. Copy the first RED error line from Console and send it.");
  }
};
