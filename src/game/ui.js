window.FILE_MANIFEST = window.FILE_MANIFEST || [];
window.FILE_MANIFEST.push({
  name: 'src/game/ui.js',
  exports: ['UI', 'showNotification'],
  dependencies: []
});

window.UI = class UI {
  constructor() {
    this.panels = [];
    this.notifications = [];
  }

  createBankPanel(economy, player) {
    const panel = document.createElement('div');
    panel.className = 'ui-panel';
    panel.style.left = '50%';
    panel.style.top = '50%';
    panel.style.transform = 'translate(-50%, -50%)';
    
    panel.innerHTML = `
      <button class="close-btn" onclick="this.parentElement.remove()">×</button>
      <h3>🏦 BANK</h3>
      <div class="stat">
        <span>Coins:</span>
        <span>${economy.coins}</span>
      </div>
      <div class="stat">
        <span>Bank:</span>
        <span>${economy.bank}</span>
      </div>
      <div class="stat">
        <span>Seeds:</span>
        <span>${player.inventory.seeds}</span>
      </div>
      <div class="stat">
        <span>Plants:</span>
        <span>${player.inventory.plants}</span>
      </div>
      <div class="stat">
        <span>Seed Price:</span>
        <span>${economy.getSeedPrice()} coins</span>
      </div>
      <div style="margin-top: 20px;">
        <button class="button" onclick="game.ui.buySeeds(1)">Buy 1 Seed</button>
        <button class="button" onclick="game.ui.buySeeds(5)">Buy 5 Seeds</button>
        <button class="button" onclick="game.ui.buySeeds(10)">Buy 10 Seeds</button>
      </div>
      <div style="margin-top: 10px;">
        <button class="button" onclick="game.ui.sellPlants()">Sell Plants</button>
        <button class="button" onclick="game.ui.depositAll()">Deposit All</button>
        <button class="button" onclick="game.ui.shareOnX()">Share on X</button>
      </div>
    `;
    
    document.body.appendChild(panel);
    this.panels.push(panel);
    return panel;
  }

  showNotification(message, duration = 3000) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, duration);
  }

  updateStats(day, coins, bank) {
    const dayElement = document.getElementById('dayCount');
    const coinElement = document.getElementById('coinCount');
    const bankElement = document.getElementById('bankCount');
    
    if (dayElement) dayElement.textContent = day;
    if (coinElement) coinElement.textContent = coins;
    if (bankElement) bankElement.textContent = bank;
  }

  clearAllPanels() {
    this.panels.forEach(panel => panel.remove());
    this.panels = [];
  }

  sellPlants() {
    if (window.game && window.game.player.inventory.plants > 0) {
      const value = window.game.economy.sellPlants(window.game.player.inventory.plants, 15);
      window.game.player.inventory.plants = 0;
      this.showNotification(`Sold plants for ${value} coins!`);
      this.clearAllPanels();
      this.createBankPanel(window.game.economy, window.game.player);
    } else {
      this.showNotification('No plants to sell!');
    }
  }

  depositAll() {
    if (window.game && window.game.economy.coins > 0) {
      window.game.economy.depositToBank(window.game.economy.coins);
      this.showNotification(`Deposited ${window.game.economy.bank} coins to bank!`);
      this.clearAllPanels();
      this.createBankPanel(window.game.economy, window.game.player);
    } else {
      this.showNotification('No coins to deposit!');
    }
  }

  shareOnX() {
    if (window.game && window.game.economy.bank > 0) {
      const message = window.game.economy.shareOnX();
      this.showNotification('Shared on X!');
    } else {
      this.showNotification('No coins to share!');
    }
  }

  buySeeds(quantity) {
    if (window.game) {
      const result = window.game.economy.buySeeds(quantity);
      if (result.success) {
        window.game.player.inventory.seeds += result.quantity;
        this.showNotification(`Bought ${result.quantity} seeds for ${result.totalCost} coins!`);
        this.clearAllPanels();
        this.createBankPanel(window.game.economy, window.game.player);
      } else {
        this.showNotification(`Not enough coins! Need ${quantity * window.game.economy.getSeedPrice()} coins.`);
      }
    }
  }
};

// Global notification function
window.showNotification = function(message, duration) {
  if (window.game && window.game.ui) {
    window.game.ui.showNotification(message, duration);
  }
};