// JS/BootIntro.js
// Minimal Game Boy-style boot intro overlay.
// Call showBootIntro({ logoSrc, onDone }) from Application.js.

(function () {
  function el(tag, attrs = {}, parent) {
    const node = document.createElement(tag);
    Object.entries(attrs).forEach(([k, v]) => {
      if (k === "style") Object.assign(node.style, v);
      else if (k === "className") node.className = v;
      else node.setAttribute(k, v);
    });
    if (parent) parent.appendChild(node);
    return node;
  }

  function playTwoNoteChime() {
    // Original simple chime (square wave), user-gesture safe.
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();

    const now = ctx.currentTime;
    const master = ctx.createGain();
    master.gain.value = 0.06;
    master.connect(ctx.destination);

    const o = ctx.createOscillator();
    o.type = "square";

    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, now);
    g.connect(master);

    o.connect(g);

    // Two short notes (not the Nintendo boot sound).
    const f1 = 659.25; // E5
    const f2 = 987.77; // B5

    o.frequency.setValueAtTime(f1, now);
    g.gain.exponentialRampToValueAtTime(0.06, now + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

    o.frequency.setValueAtTime(f2, now + 0.14);
    g.gain.exponentialRampToValueAtTime(0.06, now + 0.15);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);

    o.start(now);
    o.stop(now + 0.35);

    // Close context to avoid keeping audio hardware active.
    o.onended = () => ctx.close().catch(() => {});
  }

  function showBootIntro({ logoSrc, onDone }) {
    // If already shown, just continue.
    if (window.__BOOT_INTRO_DONE__) {
      onDone && onDone();
      return;
    }
    window.__BOOT_INTRO_DONE__ = true;

    // Overlay
    const overlay = el("div", { id: "gb-boot" }, document.body);
    overlay.style.position = "fixed";
    overlay.style.inset = "0";
    overlay.style.zIndex = "99999";
    overlay.style.display = "flex";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    overlay.style.background = "#ffffff"; // pure white background
    overlay.style.imageRendering = "pixelated";
    overlay.style.userSelect = "none";
    overlay.style.touchAction = "manipulation";

    // Flicker layer
    const flicker = el("div", {}, overlay);
    flicker.style.position = "absolute";
    flicker.style.inset = "0";
    flicker.style.pointerEvents = "none";
    flicker.style.opacity = "0.0";

    // Logo
    const logoWrap = el("div", {}, overlay);
    logoWrap.style.position = "relative";
    logoWrap.style.transform = "translateY(-10px)";
    logoWrap.style.filter = "contrast(1.05)";

    const img = el("img", { src: logoSrc, alt: "Slumpedboy" }, logoWrap);
    img.style.width = "260px";
    img.style.maxWidth = "70vw";
    img.style.height = "auto";
    img.style.imageRendering = "pixelated";
    img.style.opacity = "1";       // logo visible immediately
    img.style.filter = "grayscale(100%)"; // start monochrome like original


    // Color sweep overlay (stepped bands)
    const sweep = el("div", {}, logoWrap);
    sweep.style.position = "absolute";
    sweep.style.inset = "0";
    sweep.style.pointerEvents = "none";
    sweep.style.mixBlendMode = "multiply";
    sweep.style.opacity = "0";

    // Mask the sweep to the logo pixels so color only appears on the text
sweep.style.webkitMaskImage = `url(${logoSrc})`;
sweep.style.webkitMaskRepeat = "no-repeat";
sweep.style.webkitMaskPosition = "center";
sweep.style.webkitMaskSize = "contain";
sweep.style.maskImage = `url(${logoSrc})`;
sweep.style.maskRepeat = "no-repeat";
sweep.style.maskPosition = "center";
sweep.style.maskSize = "contain";


    // Start on first user gesture
    overlay.addEventListener(
      "pointerdown",
      () => {
        // Chime
        playTwoNoteChime();

        // Run animation
        let step = 0;
        const steps = 18;

        // enable sweep
        sweep.style.opacity = "1";

        const interval = setInterval(() => {
          step++;
          

          // flicker
          flicker.style.opacity = (Math.random() * 0.06).toFixed(3);

          // brighten logo slightly over time
          img.style.opacity = (0.15 + step * 0.04).toFixed(2);

          // stepped vertical band position
          const pct = Math.min(100, Math.round((step / steps) * 100));

          // A moving rainbow highlight that travels through the text
sweep.style.background = `linear-gradient(
  to right,
  rgba(255,0,0,0) 0%,
  rgba(255,0,0,0.85) 20%,
  rgba(255,165,0,0.85) 32%,
  rgba(255,255,0,0.85) 44%,
  rgba(0,200,0,0.85) 56%,
  rgba(0,120,255,0.85) 68%,
  rgba(180,0,255,0.85) 80%,
  rgba(180,0,255,0) 100%
)`;

sweep.style.backgroundSize = "300% 100%";
sweep.style.backgroundPosition = `${100 - pct}% 0%`;


          if (step >= steps) {
            clearInterval(interval);

            // lock-in: stop jitter/flicker, dim sweep
            logoWrap.style.transform = "translate(0px, 0px)";
            flicker.style.opacity = "0";
            sweep.style.opacity = "0";
            img.style.opacity = "1";
            img.style.filter = "none"; // return to solid logo


            // brief pause then remove
            setTimeout(() => {
              overlay.remove();
              onDone && onDone();
            }, 140);
          }
        }, 28);
      },
      { once: true }
    );

    // Hint text (optional, tiny)
    const hint = el("div", {}, overlay);
    hint.textContent = "Tap to start";
    hint.style.position = "absolute";
    hint.style.bottom = "18px";
    hint.style.fontFamily = "monospace";
    hint.style.fontSize = "12px";
    hint.style.opacity = "0.55";
    hint.style.color = "#0f380f";
  }

  // expose globally
  window.showBootIntro = showBootIntro;

  // Auto-run boot intro before showing the start screen
window.addEventListener("DOMContentLoaded", () => {
  const ss = document.getElementById("startScreen");
  if (ss) ss.classList.add("is-hidden");

  // Run boot immediately on page load
  window.showBootIntro({
    logoSrc: "resources/sprites/slumpedboy-logo.png",
    onDone: () => {
      if (ss) ss.classList.remove("is-hidden");
    }
  });
});

})();
