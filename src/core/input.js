window.FILE_MANIFEST = window.FILE_MANIFEST || [];
window.FILE_MANIFEST.push({
  name: 'src/core/input.js',
  exports: ['Input', 'keys'],
  dependencies: []
});

window.Input = class Input {
  constructor() {
    this.keys = {};
    this.setupEventListeners();
  }

  setupEventListeners() {
    window.addEventListener('keydown', (e) => {
      this.keys[e.key] = true;
      
      // Fullscreen toggle
      if (e.shiftKey && e.key === 'F') {
        e.preventDefault();
        const canvas = document.getElementById('gameCanvas');
        if (!document.fullscreenElement) {
          canvas.requestFullscreen();
        } else {
          document.exitFullscreen();
        }
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.key] = false;
    });
  }

  isKeyDown(key) {
    return this.keys[key] || false;
  }

  isKeyPressed(key) {
    if (this.keys[key]) {
      this.keys[key] = false;
      return true;
    }
    return false;
  }
};

// Global input instance
window.keys = new window.Input();