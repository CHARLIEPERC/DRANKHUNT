/* Responsive sizing helper — does NOT transform-scale #gameWrap.
   Sets CSS variables used by CSS/styles.css to size foreground and sprites.
*/

(function () {
  var BASE = {
    duckW: 90,
    duckH: 80,
    dogW: 60,
    dogH: 56,
    fgPx: 340 /* desktop fallback */
  };

  function applyResponsiveVars() {
    var vw = window.innerWidth;
    var vh = window.innerHeight;
    if (window.visualViewport) {
      vw = window.visualViewport.width;
      vh = window.visualViewport.height;
    }

    var isMobile = vw <= 767 || /Mobi|Android/i.test(navigator.userAgent);

    var root = document.documentElement;

    if (isMobile) {
      // set foreground to roughly 30% of visual viewport height (in px)
      var fgPx = Math.round(vh * 0.30);
      root.style.setProperty('--fg-h', fgPx + 'px');

      // scale sprites ~1.5x
      root.style.setProperty('--duck-w', Math.round(BASE.duckW * 1.5) + 'px');
      root.style.setProperty('--duck-h', Math.round(BASE.duckH * 1.5) + 'px');
      root.style.setProperty('--dog-w', Math.round(BASE.dogW * 1.5) + 'px');
      root.style.setProperty('--dog-h', Math.round(BASE.dogH * 1.5) + 'px');

      // duck elevation should lift the duck above the foreground
      root.style.setProperty('--duck-elev', Math.round(80 * 1.2) + 'px');
    } else {
      // Desktop defaults we keep as design pixel values
      root.style.setProperty('--fg-h', BASE.fgPx + 'px');
      root.style.setProperty('--duck-w', BASE.duckW + 'px');
      root.style.setProperty('--duck-h', BASE.duckH + 'px');
      root.style.setProperty('--dog-w', BASE.dogW + 'px');
      root.style.setProperty('--dog-h', BASE.dogH + 'px');
      root.style.setProperty('--duck-elev', '80px');
    }

    // ensure page doesn't scroll
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    document.documentElement.style.height = '100%';
    document.body.style.height = '100%';
  }

  window.addEventListener('load', applyResponsiveVars);
  window.addEventListener('resize', applyResponsiveVars);
  window.addEventListener('orientationchange', function () {
    setTimeout(applyResponsiveVars, 120);
  });
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', applyResponsiveVars);
  }
})();
