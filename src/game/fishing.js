window.FILE_MANIFEST = window.FILE_MANIFEST || [];
window.FILE_MANIFEST.push({
  name: 'src/game/fishing.js',
  exports: ['FishingPond'],
  dependencies: ['Vector2D']
});

window.FishingPond = class FishingPond {
  constructor() {
    this.position = new window.Vector2D(1200, 300);
    this.radius = 100;
    this.fish = [];
    this.maxFish = 5;
    this.spawnTimer = 0;
    this.spawnInterval = 3000;
    
    // Spawn initial fish
    for (let i = 0; i < this.maxFish; i++) {
      this.spawnFish();
    }
  }

  spawnFish() {
    if (this.fish.length < this.maxFish) {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * (this.radius - 20);
      this.fish.push({
        x: this.position.x + Math.cos(angle) * distance,
        y: this.position.y + Math.sin(angle) * distance,
        speed: 0.5 + Math.random() * 1,
        angle: Math.random() * Math.PI * 2,
        size: 10 + Math.random() * 10
      });
    }
  }

  update(deltaTime) {
    // Update fish positions
    this.fish.forEach(fish => {
      fish.angle += (Math.random() - 0.5) * 0.1;
      fish.x += Math.cos(fish.angle) * fish.speed;
      fish.y += Math.sin(fish.angle) * fish.speed;
      
      // Keep fish in pond
      const distFromCenter = window.distance(fish, this.position);
      if (distFromCenter > this.radius - fish.size) {
        fish.angle = Math.atan2(this.position.y - fish.y, this.position.x - fish.x);
      }
    });
    
    // Spawn new fish periodically
    this.spawnTimer += deltaTime;
    if (this.spawnTimer >= this.spawnInterval) {
      this.spawnTimer = 0;
      this.spawnFish();
    }
  }

  draw(renderer) {
    // Draw pond
    renderer.drawCircle(this.position.x, this.position.y, this.radius, '#4682b4');
    renderer.drawCircle(this.position.x, this.position.y, this.radius - 5, '#5f9ea0');
    
    // Draw fish
    this.fish.forEach(fish => {
      renderer.drawCircle(fish.x, fish.y, fish.size, '#ffa500');
    });
    
    // Draw "FISHING" text
    renderer.drawText('FISHING', this.position.x - 40, this.position.y + this.radius + 30, '#fff', 16);
  }

  catchFish(playerX, playerY) {
    const dist = window.distance({x: playerX, y: playerY}, this.position);
    if (dist < this.radius + 30 && this.fish.length > 0) {
      // Remove a fish
      this.fish.pop();
      return 1; // Return 1 fish caught
    }
    return 0;
  }

  isPlayerNear(playerX, playerY) {
    return window.distance({x: playerX, y: playerY}, this.position) < this.radius + 50;
  }
};