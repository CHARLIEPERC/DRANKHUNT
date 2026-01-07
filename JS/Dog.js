class Dog{

    constructor(id){
        this.dogId = `#${id}`;
        this.spriteTimer = null;
        this.walkFrames = [
            "/DRANKHUNT/resources/sprites/dog/walk1.png",
            "/DRANKHUNT/resources/sprites/dog/walk2.png",
            "/DRANKHUNT/resources/sprites/dog/walk3.png",
            "/DRANKHUNT/resources/sprites/dog/walk4.png"
        ];
        this.sniffFrames = [
            "/DRANKHUNT/resources/sprites/dog/sniff1.png",
            "/DRANKHUNT/resources/sprites/dog/sniff2.png"
        ];
        this.jumpFrames = [
            "/DRANKHUNT/resources/sprites/dog/jump1.png",
            "/DRANKHUNT/resources/sprites/dog/jump2.png"
        ];
    }

    launchWalkoutAnimation(){
        let stopBackground = "url(/DRANKHUNT/resources/sprites/dog/found.png)";

        $(this.dogId)
        .animate({left: "20%",}, 2000 ,function(){
            this.startSpriteAnimation(this.sniffFrames, 200);
        }.bind(this))
        .animate({left: "20%",}, 1000 ,function(){
            this.startSpriteAnimation(this.walkFrames, 150);
        }.bind(this))
        .animate({left: "40%",}, 2000 ,function(){
            this.startSpriteAnimation(this.sniffFrames, 200);
        }.bind(this))
        .animate({left: "40%",}, 1000 ,function(){
            this.stopSpriteAnimation();
            $(this.dogId).css("background-image", stopBackground);
        }.bind(this))
        .animate({left: "40%",}, 500 ,function(){
            this.startSpriteAnimation(this.jumpFrames, 150);
            $(this.dogId)
                .css("animation-name", "dogJump");
        }.bind(this))
        .animate({opacity: "40%",}, 700 ,function(){
            this.stopSpriteAnimation();
            $(this.dogId).css("display", "none");
        }.bind(this))
    }

    startSpriteAnimation(frames, intervalMs){
        this.stopSpriteAnimation();
        let index = 0;
        $(this.dogId).css("background-image", `url(${frames[index]})`);
        this.spriteTimer = setInterval(() => {
            index = (index + 1) % frames.length;
            $(this.dogId).css("background-image", `url(${frames[index]})`);
        }, intervalMs);
    }

    stopSpriteAnimation(){
        if (this.spriteTimer) {
            clearInterval(this.spriteTimer);
            this.spriteTimer = null;
        }
    }

    showDogWithKilledDucks(killedDucks) {
        this.stopSpriteAnimation();
    
        if (killedDucks == 0) {
            $(this.dogId).css("backgroundImage" ,'url(/DRANKHUNT/resources/sprites/dog/bkztypa1.png)');
        } else if(killedDucks == 1) {
            $(this.dogId).css("backgroundImage" ,'url(/DRANKHUNT/resources/sprites/dog/gotOne.png)');
        } else{
            $(this.dogId).css("backgroundImage" ,'url(/DRANKHUNT/resources/sprites/dog/gotTwo.png)');
        }

        $(this.dogId)
        .animate({bottom: "35%",}, 600 ,function(){
        })
        // change to wait
        .animate({bottom: "35%",}, 800 ,function(){
        })
        .animate({bottom: "15%",}, 600 ,function(){
        })
    }
}
