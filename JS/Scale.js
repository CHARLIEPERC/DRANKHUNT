(function(){
    // Design/reference resolution (pick one: 390x844)
    var DESIGN_W = 390;
    var DESIGN_H = 844;

    function applyScale(){
        var wrap = document.getElementById('gameWrap');
        if(!wrap) return;

        // viewport sizes (use visual viewport if available for better mobile results)
        var vw = window.innerWidth;
        var vh = window.innerHeight;
        if(window.visualViewport){
            vw = window.visualViewport.width;
            vh = window.visualViewport.height;
        }

        var scale = Math.min(vw / DESIGN_W, vh / DESIGN_H);
        // ensure we never upscale past 1.5x to avoid blurry scaling on some devices (optional)
        // scale = Math.min(scale, 2);

        wrap.style.transform = 'scale(' + scale + ')';
        wrap.style.webkitTransform = 'scale(' + scale + ')';
        // keep wrapper at top-left and prevent page scrolling
        document.documentElement.style.height = '100%';
        document.body.style.height = '100%';
    }

    window.addEventListener('resize', applyScale);
    window.addEventListener('orientationchange', function(){ setTimeout(applyScale, 120); });
    window.addEventListener('load', applyScale);
    document.addEventListener('DOMContentLoaded', applyScale);
})();
