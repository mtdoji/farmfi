window.FILE_MANIFEST = window.FILE_MANIFEST || [];
window.FILE_MANIFEST.push({
  name: 'src/utils/math.js',
  exports: ['Vector2D', 'distance', 'clamp'],
  dependencies: []
});

window.Vector2D = class Vector2D {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  add(other) {
    return new window.Vector2D(this.x + other.x, this.y + other.y);
  }

  subtract(other) {
    return new window.Vector2D(this.x - other.x, this.y - other.y);
  }

  multiply(scalar) {
    return new window.Vector2D(this.x * scalar, this.y * scalar);
  }

  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  normalize() {
    const len = this.length();
    if (len === 0) return new window.Vector2D();
    return new window.Vector2D(this.x / len, this.y / len);
  }
};

window.distance = function(pos1, pos2) {
  return Math.sqrt(Math.pow(pos2.x - pos1.x, 2) + Math.pow(pos2.y - pos1.y, 2));
};

window.clamp = function(value, min, max) {
  return Math.min(Math.max(value, min), max);
};