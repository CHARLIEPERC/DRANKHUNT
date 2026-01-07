(function(){
    // Scale helper: remove scaling. Center #gameWrap horizontally but DO NOT scale it.
    function applyScale(){
        var wrap = document.getElementById('gameWrap');
        if(!wrap) return;

        // Keep gameWrap centered horizontally using translateX(-50%) only; do not apply scale()
        wrap.style.position = 'absolute';
        wrap.style.left = '50%';
        wrap.style.top = 'env(safe-area-inset-top, 0)';

        // Only translateX; no scale()
        wrap.style.transform = 'translateX(-50%)';
        wrap.style.webkitTransform = 'translateX(-50%)';

        // Prevent document scrolling
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
