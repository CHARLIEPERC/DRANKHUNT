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

    // Play chime on first user interaction only (browser-safe).
    let chimePlayed = false;
    overlay.addEventListener(
      "pointerdown",
      () => {
        if (chimePlayed) return;
        chimePlayed = true;
        playTwoNoteChime();
      },
      { once: true }
    );

    // Flicker layer (very subtle, optional)
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
    img.style.opacity = "1"; // visible immediately
    img.style.filter = "grayscale(100%)"; // start monochrome

    // Color sweep overlay
    const sweep = el("div", {}, logoWrap);
    sweep.style.position = "absolute";
    sweep.style.inset = "0";
    sweep.style.pointerEvents = "none";

    // Mask sweep to logo pixels (color only appears on the letters)
    sweep.style.webkitMaskImage = `url(${logoSrc})`;
    sweep.style.webkitMaskRepeat = "no-repeat";
    sweep.style.webkitMaskPosition = "center";
    sweep.style.webkitMaskSize = "contain";
    sweep.style.maskImage = `url(${logoSrc})`;
    sweep.style.maskRepeat = "no-repeat";
    sweep.style.maskPosition = "center";
    sweep.style.maskSize = "contain";

    // Bright color pass
    sweep.style.opacity = "1";
    sweep.style.filter = "saturate(2.4) contrast(1.2)";
    sweep.style.mixBlendMode = "screen";

    // Run animation immediately (no click required)
    let step = 0;
    const steps = 42;     // more steps = slower
    const tickMs = 38;    // slower speed

    const interval = setInterval(() => {
      step++;

      // subtle flicker (you can reduce more or remove)
      flicker.style.opacity = (Math.random() * 0.02).toFixed(3);

      const pct = Math.min(100, Math.round((step / steps) * 100));

      // Bright rainbow highlight passing through text only
      sweep.style.background = `linear-gradient(
        to right,
        rgba(255,0,0,0) 0%,
        rgba(255,0,0,1) 18%,
        rgba(255,165,0,1) 32%,
        rgba(255,255,0,1) 46%,
        rgba(0,255,0,1) 60%,
        rgba(0,120,255,1) 74%,
        rgba(180,0,255,1) 88%,
        rgba(180,0,255,0) 100%
      )`;

      sweep.style.backgroundSize = "320% 100%";
      sweep.style.backgroundPosition = `${100 - pct}% 0%`;

      if (step >= steps) {
        clearInterval(interval);

        flicker.style.opacity = "0";
        sweep.style.opacity = "0";
        img.style.filter = "none"; // solid logo at end

        setTimeout(() => {
          overlay.remove();
          onDone && onDone();
        }, 140);
      }
    }, tickMs);
  }

  // expose globally
  window.showBootIntro = showBootIntro;

  // Auto-run boot intro before showing the start screen
  window.addEventListener("DOMContentLoaded", () => {
    const ss = document.getElementById("startScreen");
    if (ss) ss.classList.add("is-hidden");

    window.showBootIntro({
      logoSrc: "resources/sprites/slumpedboy-logo.png",
      onDone: () => {
        if (ss) ss.classList.remove("is-hidden");
      }
    });
  });
})();
