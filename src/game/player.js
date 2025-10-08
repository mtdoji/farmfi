window.FILE_MANIFEST = window.FILE_MANIFEST || [];
window.FILE_MANIFEST.push({
  name: 'src/game/player.js',
  exports: ['Player'],
  dependencies: ['Vector2D', 'keys']
});

window.Player = class Player {
  constructor(x, y) {
    this.position = new window.Vector2D(x, y);
    this.velocity = new window.Vector2D(0, 0);
    this.size = 30;
    this.speed = 6;
    this.color = '#ff6b6b';
    
    // Player stats
    this.farmingSkill = 1; // Reduces growth time
    this.hunger = 100; // 0-100, needs to eat 3 times daily
    this.mealsToday = 0;
    this.inventory = {
      seeds: 10,
      plants: 0,
      fish: 0
    };
  }

  update(deltaTime) {
    // Movement - support both Arrow keys and WASD
    this.velocity = new window.Vector2D(0, 0);
    
    // Vertical movement
    if (window.keys.isKeyDown('ArrowUp') || window.keys.isKeyDown('w') || window.keys.isKeyDown('W')) {
      this.velocity.y = -this.speed;
    }
    if (window.keys.isKeyDown('ArrowDown') || window.keys.isKeyDown('s') || window.keys.isKeyDown('S')) {
      this.velocity.y = this.speed;
    }
    
    // Horizontal movement
    if (window.keys.isKeyDown('ArrowLeft') || window.keys.isKeyDown('a') || window.keys.isKeyDown('A')) {
      this.velocity.x = -this.speed;
    }
    if (window.keys.isKeyDown('ArrowRight') || window.keys.isKeyDown('d') || window.keys.isKeyDown('D')) {
      this.velocity.x = this.speed;
    }
    
    // Normalize diagonal movement
    if (this.velocity.x !== 0 && this.velocity.y !== 0) {
      this.velocity = this.velocity.normalize().multiply(this.speed);
    }
    
    this.position = this.position.add(this.velocity);
    
    // Keep player in bounds
    this.position.x = window.clamp(this.position.x, this.size, 1920 - this.size);
    this.position.y = window.clamp(this.position.y, this.size, 1080 - this.size);
    
    // Hunger decreases over time
    this.hunger -= deltaTime * 0.001;
    this.hunger = window.clamp(this.hunger, 0, 100);
  }

  draw(renderer) {
    // Draw player as a simple farmer
    renderer.drawCircle(this.position.x, this.position.y, this.size, this.color);
    
    // Draw farmer hat
    renderer.drawRect(this.position.x - 20, this.position.y - 35, 40, 10, '#8b4513');
    
    // Draw simple face
    renderer.drawCircle(this.position.x - 8, this.position.y - 5, 3, '#000');
    renderer.drawCircle(this.position.x + 8, this.position.y - 5, 3, '#000');
    
    // Draw hunger indicator
    const hungerColor = this.hunger > 30 ? '#0f0' : '#f00';
    renderer.drawRect(this.position.x - 20, this.position.y - 50, 40 * (this.hunger / 100), 5, hungerColor);
  }

  eat() {
    if (this.inventory.fish > 0) {
      this.inventory.fish--;
      this.hunger = 100;
      this.mealsToday++;
      return true;
    }
    return false;
  }

  canEat() {
    return this.inventory.fish > 0 && this.hunger < 80;
  }

  getInteractionArea() {
    return {
      x: this.position.x - 40,
      y: this.position.y - 40,
      width: 80,
      height: 80
    };
  }
};