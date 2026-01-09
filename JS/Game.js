// Minimal safe helper for possibly-missing global
const getDuckElevPx = () => (window.duckElevPx ?? 0);

class Game{

    constructor(gameParameters){
        this.dog1 = new Dog("dog1");
        this.dog2 = new Dog("dog2");
        this.duckMovesNumber = gameParameters.movesNumber;
        this.shotHandler = new ShotHandler(gameParameters.initialAmmo);
        this.pointsHandler = new PointsHandler(gameParameters.ducksNumber);
        this.ducksHandler = new DucksHandler(gameParameters.ducksNumber, gameParameters.movesNumber);
        this.roundEndCountdown;
        this.percentProgress = 0;
        this.lives = 3;
        this.newRoundTimeout;
        this.totalSuccessfulHits = 0;
        this.totalShotsNumber = 0;
        this.maxLevel = 10;
    }

    startGame(){
        this.dog1.launchWalkoutAnimation();
        setTimeout(() => this.startNewRound(), 400);
    }

    shoot(){
        this.totalShotsNumber ++;
        let successfulHits = this.shotHandler.checkIfHitSuccessful(this.ducksHandler.ducks);
        this.ducksHandler.ducksKilledInRound += successfulHits;

        if (successfulHits > 0) {
            this.totalSuccessfulHits += successfulHits;
            this.pointsHandler.addPoints(successfulHits);
            this.percentProgress = this.ducksHandler.countPrecentOfDucksKilled();
            displayProgressOnProgressBar(this.percentProgress);
        }
        this.checkIfRoundIsFinished();
    }

    checkIfRoundIsFinished(){
        if (this.ducksHandler.checkAllDucksAreShot() || this.shotHandler.checkIsNoAmmoLeft()) {
            this.finishRound();
        }
    }

    finishRound(){
        this.stopCountdownToRoundEnd();
        this.shotHandler.disablehooting();
        this.ducksHandler.removeRemainingDucks();
        this.dog2.showDogWithKilledDucks(this.ducksHandler.ducksKilledInRound);
        this.checkIfRoundIsPassed();

        if (this.lives < 1) {
            return;
        }

        // If we've reached or passed the configured max level, finish with a win.
        if (this.pointsHandler.level >= this.maxLevel) {
            this.finishWin();
            return;
        }

        this.newRoundTimeout = setTimeout(() => this.startNewRound(), 2000);
    }

    checkIfRoundIsPassed(){
        if (this.percentProgress < 90) {
            this.subtractLives();
        }
    }

    subtractLives(){
        disableLifeIcon(this.lives);
        this.lives--;
        if (this.lives < 1) {this.finishGame();}
    }
    
    finishGame(){
        window.clearTimeout(this.newRoundTimeout);
        let accuracy = Math.round(this.totalSuccessfulHits/this.totalShotsNumber*100);
        displayEndScreen(this.pointsHandler, this.totalSuccessfulHits, accuracy);
    }

    finishWin(){
        // stop any pending new-round timer
        window.clearTimeout(this.newRoundTimeout);
        // stop round end countdown (if running)
        this.stopCountdownToRoundEnd();
        // disable shooting input
        this.shotHandler.disablehooting();

        // stop all ducks: clear their flight/frame timers and remove their DOM so movement/animation halts
        if (this.ducksHandler && Array.isArray(this.ducksHandler.ducks)) {
            this.ducksHandler.ducks.forEach(duck => {
                try { if (duck.stopFlightAnimation) duck.stopFlightAnimation(); } catch(e){}
                try { if (duck.stopFrameAnimation) duck.stopFrameAnimation(); } catch(e){}
                try { if (duck.duckId) $(duck.duckId).remove(); } catch(e){}
            });
        }

        // show win overlay (View.js will add class to make it fullscreen/flex)
        displayWinScreen();
    }
    
    startNewRound(){
        displayProgressOnProgressBar(0);
        this.percentProgress = 0;
        this.pointsHandler.addLevel();
        this.setCountdownToRoundEnd();
        this.ducksHandler.startDucksFlight();
        this.shotHandler.enableShooting();
        this.shotHandler.resetAmmo();
    }

    stopCountdownToRoundEnd(){
        window.clearTimeout(this.roundEndCountdown);
    }

    setCountdownToRoundEnd(){
        let timeToRoundEnd = this.duckMovesNumber*1000;
        this.roundEndCountdown = setTimeout(() => this.finishRound(), timeToRoundEnd);
    }
}


class ExtremeGame extends Game{

    constructor(gameParameters){
        super(gameParameters);
        this.initializeCurrentModeSettings();
        this.shooting;
        this.mouseX;
        this.mouseY;
    }

    initializeCurrentModeSettings(){
        $(".sky").css("backgroundImage", "url(/DRANKHUNT/resources/sprites/background/sky3.png)");
        $(".sky").mousedown(()=>this.startAutoShooting(event));
        $(".sky").mouseup(()=>this.stopAutoShooting(event));
        $("#gunIcon").attr("src", "/DRANKHUNT/resources/sprites/weapons/auto.png");
    }

    saveCurrentCoordinates(){
        this.mouseX = event.clientX;
        this.mouseY = event.clientY;
    }

    startAutoShooting(event){
        $(".sky").on("mousemove", ()=>this.saveCurrentCoordinates());
        this.shooting = setInterval(()=>this.shoot(),100);
    }

    stopAutoShooting(){
        $(".sky").off("mousemove");
        clearInterval(this.shooting);
    }

    shoot(){
        this.totalShotsNumber ++;
        let successfulHits = this.shotHandler.checkIfHitSuccessful(this.ducksHandler.ducks, this.mouseX, this.mouseY);
        this.ducksHandler.ducksKilledInRound += successfulHits;
        if (successfulHits > 0) {
            this.totalSuccessfulHits += successfulHits;
            this.pointsHandler.addPoints(successfulHits);
            this.percentProgress = this.ducksHandler.countPrecentOfDucksKilled();
            displayProgressOnProgressBar(this.percentProgress);
        }
        this.checkIfRoundIsFinished();
    }

       finishRound(){
        // Ensure auto shooting stops first (Extreme mode specific)
        try { this.stopAutoShooting(); } catch(e) {}

        // Reuse base class finishRound() which performs the win-level check,
        // stops countdowns, disables shooting, removes ducks and schedules next round.
        super.finishRound();

        // If we've reached max level, super.finishRound() invoked finishWin() and returned early.
        // Guard here to avoid any further Extreme-mode behavior after the win.
        if (this.pointsHandler.level >= this.maxLevel) return;

        // Extreme-specific behavior: allow adding a new duck for the next round.
        this.addNewDuck();
    }

    addNewDuck(){
        if (this.ducksHandler.numberOfDucks < 20) {
            this.ducksHandler.createNewDuck();
        }
    }
}


class ModernGame extends Game{
    
    constructor(gameParameters){
        super(gameParameters);
        this.changeBackgroudsForCurrentMode();
    }

    changeBackgroudsForCurrentMode(){
        $(".sky").css("backgroundImage", "url(/DRANKHUNT/resources/sprites/background/modern.png)");
        $(".bushes").css("backgroundImage", "url(/DRANKHUNT/resources/sprites/background/bushes.png)");
        $("#sky").click(this.shoot.bind(this));
        $("#gunIcon").attr("src", "/DRANKHUNT/resources/sprites/weapons/shotgun.png");
    }
}


class ClassicGame extends Game{
    constructor(gameParameters){
        super(gameParameters);
        this.changeBackgroudsForCurrentMode();
    }

    changeBackgroudsForCurrentMode(){
        $(".sky").css("backgroundImage", "url(/DRANKHUNT/resources/sprites/background/sky1.png)");
        $("#sky").click(this.shoot.bind(this));
    }
}

// Set duck bottom so it's duckElevPx above the top of the grass
const bottomPx = groundBaselinePx + getDuckElevPx();
$(this.duckId).css('bottom', bottomPx + 'px');

// Place duck off-screen horizontally so it flies into view.
// Randomly choose left or right spawn side.
const spawnFromLeft = Math.random() < 0.5;
const initialLeftPercent = spawnFromLeft ? -10 : 110;
$(this.duckId).css('left', initialLeftPercent + '%');
