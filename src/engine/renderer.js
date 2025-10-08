window.FILE_MANIFEST = window.FILE_MANIFEST || [];
window.FILE_MANIFEST.push({
  name: 'src/engine/renderer.js',
  exports: ['Renderer', 'drawRect', 'drawCircle', 'drawText'],
  dependencies: []
});

window.Renderer = class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.width = canvas.width;
    this.height = canvas.height;
  }

  clear() {
    this.ctx.fillStyle = '#2a4d3a';
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  drawRect(x, y, width, height, color) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x, y, width, height);
  }

  drawCircle(x, y, radius, color) {
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, Math.PI * 2);
    this.ctx.fill();
  }

  drawText(text, x, y, color = '#fff', size = 16) {
    this.ctx.fillStyle = color;
    this.ctx.font = `${size}px monospace`;
    this.ctx.fillText(text, x, y);
  }

  drawImage(img, x, y, width, height) {
    this.ctx.drawImage(img, x, y, width, height);
  }

  drawGrid(gridSize, color) {
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = 1;
    
    for (let x = 0; x <= this.width; x += gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.height);
      this.ctx.stroke();
    }
    
    for (let y = 0; y <= this.height; y += gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.width, y);
      this.ctx.stroke();
    }
  }
};

// Helper functions for global access
window.drawRect = function(x, y, width, height, color) {
  if (window.gameRenderer) {
    window.gameRenderer.drawRect(x, y, width, height, color);
  }
};

window.drawCircle = function(x, y, radius, color) {
  if (window.gameRenderer) {
    window.gameRenderer.drawCircle(x, y, radius, color);
  }
};

window.drawText = function(text, x, y, color, size) {
  if (window.gameRenderer) {
    window.gameRenderer.drawText(text, x, y, color, size);
  }
};