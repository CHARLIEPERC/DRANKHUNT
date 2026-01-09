// JS/BootIntro.js
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

  function playBootAudio(src) {
    try {
      const a = new Audio(src);
      a.volume = 0.9;
      a.currentTime = 0;
      a.play().catch(() => {});
      return a;
    } catch (_) {
      return null;
    }
  }

  function showBootIntro({ logoSrc, audioSrc, onDone }) {
    // Always safe to call. If one exists, remove it.
    const existing = document.getElementById("gb-boot");
    if (existing) existing.remove();

    const overlay = el("div", { id: "gb-boot" }, document.body);
    overlay.style.position = "fixed";
    overlay.style.inset = "0";
    overlay.style.zIndex = "99999";
    overlay.style.display = "flex";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    overlay.style.background = "#ffffff";
    overlay.style.imageRendering = "pixelated";
    overlay.style.userSelect = "none";
    overlay.style.touchAction = "manipulation";

    // Logo container
    const logoWrap = el("div", {}, overlay);
    logoWrap.style.position = "relative";
    logoWrap.style.transform = "translateY(-10px)";
    logoWrap.style.filter = "contrast(1.05)";

    const img = el("img", { src: logoSrc, alt: "Slumpedboy" }, logoWrap);
    img.style.width = "260px";
    img.style.maxWidth = "70vw";
    img.style.height = "auto";
    img.style.imageRendering = "pixelated";
    img.style.opacity = "1";
    img.style.filter = "grayscale(100%)";

    // Sweep
    const sweep = el("div", {}, logoWrap);
    sweep.style.position = "absolute";
    sweep.style.inset = "0";
    sweep.style.pointerEvents = "none";
    sweep.style.opacity = "1";
    sweep.style.filter = "saturate(2.4) contrast(1.2)";
    sweep.style.mixBlendMode = "screen";

    // Mask sweep to letters only
    sweep.style.webkitMaskImage = `url(${logoSrc})`;
    sweep.style.webkitMaskRepeat = "no-repeat";
    sweep.style.webkitMaskPosition = "center";
    sweep.style.webkitMaskSize = "contain";
    sweep.style.maskImage = `url(${logoSrc})`;
    sweep.style.maskRepeat = "no-repeat";
    sweep.style.maskPosition = "center";
    sweep.style.maskSize = "contain";

    // Audio will start only if this is called from a user gesture (Start click)
    if (audioSrc) playBootAudio(audioSrc);

    // Duration tuning
    let step = 0;
    const steps = 120; // longer sweep
    const tickMs = 40;

    const interval = setInterval(() => {
      step++;
      const pct = Math.min(100, Math.round((step / steps) * 100));

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
        sweep.style.opacity = "0";
        img.style.filter = "none";
        setTimeout(() => {
          overlay.remove();
          if (typeof onDone === "function") onDone();
        }, 140);
      }
    }, tickMs);
  }

  window.showBootIntro = showBootIntro;
})();
