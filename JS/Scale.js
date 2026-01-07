/* JS/Scale.js
   New approach:
   - DO NOT transform-scale #gameWrap
   - Compute responsive CSS variables at runtime:
     --fg-h (foreground height in px or vh equivalent)
     --duck-w/--duck-h and --dog-w/--dog-h (computed sizes)
   - Prevent scroll and keep pixel perfect rendering.
*/

(function () {
  // Design/reference resolution (for reference, not used to transform the wrapper)
  var DESIGN_W = 390;
  var DESIGN_H = 844;

  function applyResponsiveVars() {
    var vw = window.innerWidth;
    var vh = window.innerHeight;
    if (window.visualViewport) {
      vw = window.visualViewport.width;
      vh = window.visualViewport.height;
    }

    // For mobile devices we want larger foreground (about 30vh)
    var isMobile = vw <= 767 || /Mobi|Android/i.test(navigator.userAgent);

    var root = document.documentElement;

    // Determine foreground height:
    if (isMobile) {
      // use 30vh for foreground on phones — keep this in a CSS var that other rules read
      root.style.setProperty('--fg-h', Math.round(vh * 0.30) + 'px');
    } else {
      // desktop fallback: keep existing pixel design value
      root.style.setProperty('--fg-h', '340px');
    }

    // Compute sprite sizes: base desktop values scaled up for mobile
    var baseDuckW = 90; // px fallback (desktop)
    var baseDuckH = 80;
    var baseDogW = 60;
    var baseDogH = 56;

    if (isMobile) {
      root.style.setProperty('--duck-w', Math.round(baseDuckW * 1.5) + 'px');
      root.style.setProperty('--duck-h', Math.round(baseDuckH * 1.5) + 'px');
      root.style.setProperty('--dog-w', Math.round(baseDogW * 1.5) + 'px');
      root.style.setProperty('--dog-h', Math.round(baseDogH * 1.5) + 'px');
      // duck elevation above grass on mobile is slightly larger to keep it above the foreground
      root.style.setProperty('--duck-elev', Math.round(80 * 1.2) + 'px');
    } else {
      root.style.setProperty('--duck-w', baseDuckW + 'px');
      root.style.setProperty('--duck-h', baseDuckH + 'px');
      root.style.setProperty('--dog-w', baseDogW + 'px');
      root.style.setProperty('--dog-h', baseDogH + 'px');
      root.style.setProperty('--duck-elev', '80px');
    }

    // Prevent scrolling explicitly (extra insurance)
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    document.documentElement.style.height = '100%';
    document.body.style.height = '100%';
  }

  // Run on load and when viewport size changes
  window.addEventListener('load', applyResponsiveVars);
  window.addEventListener('resize', applyResponsiveVars);
  window.addEventListener('orientationchange', function () {
    setTimeout(applyResponsiveVars, 120);
  });
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', applyResponsiveVars);
  }
})();
