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

        // compute scale to fit either width or height
        var scale = Math.min(vw / DESIGN_W, vh / DESIGN_H);

        // center horizontally: we set left 50% via CSS/JS and translateX(-50%) in transform
        wrap.style.position = 'absolute';
        wrap.style.left = '50%';
        wrap.style.top = '0';

        wrap.style.transform = 'translateX(-50%) scale(' + scale + ')';
        wrap.style.webkitTransform = 'translateX(-50%) scale(' + scale + ')';

        // ensure document heights remain fixed to avoid scrolling
        document.documentElement.style.height = '100%';
        document.body.style.height = '100%';
    }

    window.addEventListener('resize', applyScale);
    window.addEventListener('orientationchange', function(){ setTimeout(applyScale, 120); });
    window.addEventListener('load', applyScale);
    document.addEventListener('DOMContentLoaded', applyScale);
})();
