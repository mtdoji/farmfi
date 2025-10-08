window.FILE_MANIFEST = window.FILE_MANIFEST || [];
window.FILE_MANIFEST.push({
  name: 'src/game/plants.js',
  exports: ['Plant', 'PlantManager'],
  dependencies: ['Vector2D']
});

window.Plant = class Plant {
  constructor(x, y) {
    this.position = new window.Vector2D(x, y);
    this.stage = 0; // 0: seed, 1: growing, 2: ready
    this.growthTime = 10000; // Base 10 seconds
    this.currentGrowth = 0;
    this.size = 20;
    this.value = 10;
  }

  update(deltaTime, farmingSkill) {
    if (this.stage < 2) {
      const adjustedGrowthTime = this.growthTime / farmingSkill;
      this.currentGrowth += deltaTime;
      
      if (this.currentGrowth >= adjustedGrowthTime) {
        this.stage++;
        this.currentGrowth = 0;
        this.size += 10;
        this.value += 5;
      }
    }
  }

  draw(renderer) {
    const colors = ['#8b4513', '#90ee90', '#ff6347'];
    renderer.drawCircle(this.position.x, this.position.y, this.size, colors[this.stage]);
    
    // Draw growth indicator
    if (this.stage < 2) {
      const progress = this.currentGrowth / (this.growthTime / window.game?.player?.farmingSkill || 1);
      renderer.drawRect(
        this.position.x - 15, 
        this.position.y - this.size - 10, 
        30 * progress, 
        3, 
        '#ff0'
      );
    }
  }

  isReady() {
    return this.stage === 2;
  }

  harvest() {
    if (this.isReady()) {
      return this.value;
    }
    return 0;
  }
};

window.PlantManager = class PlantManager {
  constructor() {
    this.plants = [];
    this.gridSize = 60;
    this.farmArea = {
      x: 100,
      y: 100,
      width: 600,
      height: 400
    };
  }

  addPlant(x, y) {
    // Snap to grid
    const gridX = Math.floor((x - this.farmArea.x) / this.gridSize) * this.gridSize + this.farmArea.x + this.gridSize / 2;
    const gridY = Math.floor((y - this.farmArea.y) / this.gridSize) * this.gridSize + this.farmArea.y + this.gridSize / 2;
    
    // Check if position is valid and empty
    if (this.isValidPosition(gridX, gridY) && !this.getPlantAt(gridX, gridY)) {
      this.plants.push(new window.Plant(gridX, gridY));
      return true;
    }
    return false;
  }

  getPlantAt(x, y) {
    return this.plants.find(plant => 
      window.distance(plant.position, {x, y}) < this.gridSize / 2
    );
  }

  isValidPosition(x, y) {
    return x >= this.farmArea.x && 
           x <= this.farmArea.x + this.farmArea.width &&
           y >= this.farmArea.y && 
           y <= this.farmArea.y + this.farmArea.height;
  }

  harvestPlant(x, y) {
    const plant = this.getPlantAt(x, y);
    if (plant && plant.isReady()) {
      const value = plant.harvest();
      this.plants = this.plants.filter(p => p !== plant);
      return value;
    }
    return 0;
  }

  update(deltaTime, farmingSkill) {
    this.plants.forEach(plant => plant.update(deltaTime, farmingSkill));
  }

  draw(renderer) {
    // Draw farm area
    renderer.drawRect(this.farmArea.x, this.farmArea.y, this.farmArea.width, this.farmArea.height, '#654321');
    
    // Draw grid
    renderer.ctx.strokeStyle = '#4a3018';
    renderer.ctx.lineWidth = 1;
    for (let x = this.farmArea.x; x <= this.farmArea.x + this.farmArea.width; x += this.gridSize) {
      renderer.ctx.beginPath();
      renderer.ctx.moveTo(x, this.farmArea.y);
      renderer.ctx.lineTo(x, this.farmArea.y + this.farmArea.height);
      renderer.ctx.stroke();
    }
    for (let y = this.farmArea.y; y <= this.farmArea.y + this.farmArea.height; y += this.gridSize) {
      renderer.ctx.beginPath();
      renderer.ctx.moveTo(this.farmArea.x, y);
      renderer.ctx.lineTo(this.farmArea.x + this.farmArea.width, y);
      renderer.ctx.stroke();
    }
    
    // Draw plants
    this.plants.forEach(plant => plant.draw(renderer));
  }
};