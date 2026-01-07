(function(){
    // This helper NO LONGER applies scale() to #gameWrap.
    // It only centers #gameWrap horizontally (translateX(-50%)) and ensures
    // document/body don't allow scrolling on mobile.
    function applyScale(){
        var wrap = document.getElementById('gameWrap');
        if(!wrap) return;

        // center wrapper horizontally (no scale)
        wrap.style.position = 'absolute';
        wrap.style.left = '50%';
        wrap.style.top = 'env(safe-area-inset-top, 0)';

        wrap.style.transform = 'translateX(-50%)';
        wrap.style.webkitTransform = 'translateX(-50%)';

        // prevent document scrolling
        document.documentElement.style.height = '100%';
        document.body.style.height = '100%';
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';
    }

    window.addEventListener('resize', applyScale);
    window.addEventListener('orientationchange', function(){ setTimeout(applyScale, 120); });
    window.addEventListener('load', applyScale);
    document.addEventListener('DOMContentLoaded', applyScale);
})();
