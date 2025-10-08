window.FILE_MANIFEST = window.FILE_MANIFEST || [];
window.FILE_MANIFEST.push({
  name: 'src/core/loop.js',
  exports: ['gameLoop', 'startGame'],
  dependencies: ['update', 'render']
});

window.lastTime = 0;

window.gameLoop = function(timestamp) {
    const deltaTime = timestamp - window.lastTime;
    window.update(deltaTime);  // Game logic (from game/main.js)
    window.render();           // Drawing (from engine/renderer.js)
    window.lastTime = timestamp;
    requestAnimationFrame(window.gameLoop);
};

window.startGame = function() {
    requestAnimationFrame(window.gameLoop);
};