/*
 * JS/Duck.js
 * Duck behaviour
 */

function Duck(duckId) {
  this.duckId = duckId;
}

Duck.prototype.moveToInitialPosition = function() {
  // Anchor the duck to the foreground by setting its bottom using CSS variables.
  // This ensures the duck's start position stays aligned with the foreground height.
  $(this.duckId).css("bottom", "calc(var(--fg-h) - var(--duck-h) - 12px)");
};

Duck.prototype.show = function() {
  $(this.duckId).show();
};

Duck.prototype.hide = function() {
  $(this.duckId).hide();
};

// Export for CommonJS environments (tests/build tools)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Duck;
}
