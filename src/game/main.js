window.FILE_MANIFEST = window.FILE_MANIFEST || [];
window.FILE_MANIFEST.push({
  name: 'src/game/main.js',
  exports: ['Game', 'update', 'render'],
  dependencies: ['Player', 'PlantManager', 'FishingPond', 'Economy', 'UI', 'keys', 'startGame']
});

window.Game = class Game {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.renderer = new window.Renderer(this.canvas);
    window.gameRenderer = this.renderer;
    
    this.player = new window.Player(960, 540);
    this.plantManager = new window.PlantManager();
    this.fishingPond = new window.FishingPond();
    this.economy = new window.Economy();
    this.ui = new window.UI();
    
    // Game state
    this.day = 1;
    this.dayTimer = 0;
    this.dayLength = 60000; // 60 seconds per day
    this.isPaused = false;
    
    // Store global reference
    window.game = this;
  }

  update(deltaTime) {
    if (this.isPaused) return;
    
    // Update player
    this.player.update(deltaTime);
    
    // Update game systems
    this.plantManager.update(deltaTime, this.player.farmingSkill);
    this.fishingPond.update(deltaTime);
    
    // Update day/night cycle
    this.dayTimer += deltaTime;
    if (this.dayTimer >= this.dayLength) {
      this.dayTimer = 0;
      this.day++;
      this.player.mealsToday = 0; // Reset daily meals
      window.showNotification(`Day ${this.day} has begun!`);
    }
    
    // Handle input
    this.handleInput();
    
    // Update UI
    this.ui.updateStats(this.day, this.economy.coins, this.economy.bank);
    
    // Check hunger
    if (this.player.hunger <= 0) {
      window.showNotification('You are too hungry to work! Go fish!');
    }
  }

  handleInput() {
    const interactionArea = this.player.getInteractionArea();
    
    // Space key for actions
    if (window.keys.isKeyPressed(' ')) {
      // Plant seeds
      if (this.player.inventory.seeds > 0) {
        if (this.plantManager.addPlant(this.player.position.x, this.player.position.y)) {
          this.player.inventory.seeds--;
          window.showNotification('Planted seed!');
        }
      }
      
      // Harvest plants
      const harvestValue = this.plantManager.harvestPlant(this.player.position.x, this.player.position.y);
      if (harvestValue > 0) {
        this.player.inventory.plants++;
        this.player.farmingSkill += 0.1; // Increase skill
        this.economy.addCoins(harvestValue);
        window.showNotification(`Harvested plant! Value: ${harvestValue} coins`);
      }
      
      // Fishing
      if (this.fishingPond.isPlayerNear(this.player.position.x, this.player.position.y)) {
        const fishCaught = this.fishingPond.catchFish(this.player.position.x, this.player.position.y);
        if (fishCaught > 0) {
          this.player.inventory.fish += fishCaught;
          window.showNotification(`Caught ${fishCaught} fish!`);
        }
      }
    }
    
    // E key for eating
    if (window.keys.isKeyPressed('e')) {
      if (this.player.eat()) {
        window.showNotification(`Ate fish! Hunger restored. Meals today: ${this.player.mealsToday}/3`);
      } else {
        window.showNotification('No fish to eat!');
      }
    }
    
    // B key for bank
    if (window.keys.isKeyPressed('b')) {
      this.ui.createBankPanel(this.economy, this.player);
    }
    
    // X key for sharing
    if (window.keys.isKeyPressed('x')) {
      if (this.economy.bank > 0) {
        this.economy.shareOnX();
        window.showNotification('Shared your bank balance on X!');
      } else {
        window.showNotification('No coins in bank to share!');
      }
    }
  }

  render() {
    // Clear screen
    this.renderer.clear();
    
    // Draw game elements
    this.plantManager.draw(this.renderer);
    this.fishingPond.draw(this.renderer);
    this.player.draw(this.renderer);
    
    // Draw player stats at bottom left
    this.renderer.drawText(`Farming Skill: ${this.player.farmingSkill.toFixed(1)}`, 10, 780, '#0f0', 14);
    this.renderer.drawText(`Hunger: ${Math.floor(this.player.hunger)}%`, 10, 805, this.player.hunger > 30 ? '#0f0' : '#f00', 14);
    this.renderer.drawText(`Meals Today: ${this.player.mealsToday}/3`, 10, 830, '#ff0', 14);
    this.renderer.drawText(`Seeds: ${this.player.inventory.seeds}`, 10, 855, '#fff', 14);
    this.renderer.drawText(`Plants: ${this.player.inventory.plants}`, 10, 880, '#fff', 14);
    this.renderer.drawText(`Fish: ${this.player.inventory.fish}`, 10, 905, '#fff', 14);
    
    // Draw instructions at bottom left
    this.renderer.drawText('Arrow Keys/WASD: Move', 10, 940, '#fff', 14);
    this.renderer.drawText('Space: Plant/Harvest/Fish', 10, 965, '#fff', 14);
    this.renderer.drawText('E: Eat Fish', 10, 990, '#fff', 14);
    this.renderer.drawText('B: Bank Menu', 10, 1015, '#fff', 14);
    this.renderer.drawText('X: Share on X', 10, 1040, '#fff', 14);
    
    // Draw day/night indicator
    const dayProgress = this.dayTimer / this.dayLength;
    const skyColor = this.interpolateColor('#87ceeb', '#191970', dayProgress);
    this.renderer.drawRect(0, 0, 1920, 50, skyColor);
    this.renderer.drawText(`Day ${this.day} - ${Math.floor(dayProgress * 100)}%`, 960, 30, '#fff', 20);
  }

  interpolateColor(color1, color2, factor) {
    const c1 = this.hexToRgb(color1);
    const c2 = this.hexToRgb(color2);
    
    const r = Math.round(c1.r + (c2.r - c1.r) * factor);
    const g = Math.round(c1.g + (c2.g - c1.g) * factor);
    const b = Math.round(c1.b + (c2.b - c1.b) * factor);
    
    return `rgb(${r}, ${g}, ${b})`;
  }

  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }
};

// Global game functions
window.update = function(deltaTime) {
  if (window.game) {
    window.game.update(deltaTime);
  }
};

window.render = function() {
  if (window.game) {
    window.game.render();
  }
};

// Initialize game when page loads
window.addEventListener('load', () => {
  window.game = new window.Game();
  window.startGame();
  window.showNotification('Welcome to Farming Life! Plant seeds, catch fish, and build your fortune!');
});