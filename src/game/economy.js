window.FILE_MANIFEST = window.FILE_MANIFEST || [];
window.FILE_MANIFEST.push({
  name: 'src/game/economy.js',
  exports: ['Economy'],
  dependencies: []
});

window.Economy = class Economy {
  constructor() {
    this.coins = 0;
    this.bank = 0;
    this.seedPrice = 3; // Cost per seed
    this.plantPrices = {
      1: 5,   // Stage 1 plant value
      2: 10,  // Stage 2 plant value
      3: 20   // Stage 3 (ready) plant value
    };
  }

  addCoins(amount) {
    this.coins += amount;
    return this.coins;
  }

  depositToBank(amount) {
    if (this.coins >= amount) {
      this.coins -= amount;
      this.bank += amount;
      return true;
    }
    return false;
  }

  sellPlants(plantCount, plantValue) {
    const totalValue = plantCount * plantValue;
    this.coins += totalValue;
    return totalValue;
  }

  getBankBalance() {
    return this.bank;
  }

  getTotalWealth() {
    return this.coins + this.bank;
  }

  shareOnX() {
    const message = `I've earned ${this.bank} coins in Farming Life! 🌾💰 #FarmingGame`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`;
    window.open(twitterUrl, '_blank');
    return message;
  }

  getPlantValue(stage) {
    return this.plantPrices[stage] || 5;
  }

  canAfford(cost) {
    return this.coins >= cost;
  }

  purchase(cost) {
    if (this.canAfford(cost)) {
      this.coins -= cost;
      return true;
    }
    return false;
  }

  buySeeds(quantity) {
    const totalCost = quantity * this.seedPrice;
    if (this.purchase(totalCost)) {
      return { success: true, quantity, totalCost };
    }
    return { success: false, quantity: 0, totalCost: 0 };
  }

  getSeedPrice() {
    return this.seedPrice;
  }
};