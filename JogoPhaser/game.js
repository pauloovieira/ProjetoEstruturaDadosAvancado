const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: '#87CEEB',
    parent: 'game-container',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload,
        create,
        update
    }
};

const game = new Phaser.Game(config);

window.addEventListener('resize', () => {
    game.scale.resize(window.innerWidth, window.innerHeight);
});

let player;
let items;
let platforms;
let holes;
let score = 0;
let scoreText;
let gameOverText;
let restartButton;
let nextPhaseButton;
let backToStartButton;
let menuVisible = false;
let allItemsCollected = false;

function preload() {
    this.load.image('background', 'assets/Fundo.png');
    this.load.image('player', 'assets/Monkey.png');
    this.load.image('item', 'assets/BananaMonkey.png');
    this.load.image('platform', 'assets/PlatformsCopy.png');
    this.load.image('hole', 'assets/SpikesMonkey.png');
}

function create() {
    // Adiciona o fundo na cena e ajusta para cobrir a tela
    this.add.image(window.innerWidth / 2, window.innerHeight / 2, 'background')
        .setDisplaySize(window.innerWidth, window.innerHeight);

    createMap.call(this);

    player = this.physics.add.sprite(200, window.innerHeight - 200, 'player');
    player.setCollideWorldBounds(true);

    this.physics.add.collider(player, platforms);

    items = this.physics.add.staticGroup();
    addItems.call(this);

    scoreText = this.add.text(16, 16, 'Pontuação: 0', { fontSize: '32px', fill: '#000' });

    this.cursors = this.input.keyboard.createCursorKeys();
    this.physics.add.overlap(player, holes, hitHole, null, this);
    this.physics.add.overlap(player, items, collectItem, null, this);

    gameOverText = this.add.text(window.innerWidth / 2, window.innerHeight / 2, '', {
        fontSize: '64px',
        fill: '#ff0000'
    });
    gameOverText.setOrigin(0.5);
    gameOverText.setVisible(false);

    restartButton = this.add.text(window.innerWidth / 2, window.innerHeight / 2 + 80, 'Reiniciar', {
        fontSize: '32px',
        fill: '#0000ff'
    });
    restartButton.setOrigin(0.5);
    restartButton.setInteractive();
    restartButton.setVisible(false);
    restartButton.on('pointerdown', restartGame, this);

    nextPhaseButton = this.add.text(window.innerWidth / 2, window.innerHeight / 2 + 160, 'Próxima fase', {
        fontSize: '32px',
        fill: '#0000ff'
    });
    nextPhaseButton.setOrigin(0.5);
    nextPhaseButton.setInteractive();
    nextPhaseButton.setVisible(false);
    nextPhaseButton.on('pointerdown', () => {
        console.log('Próxima fase ainda não implementada.');
    });

    backToStartButton = this.add.text(window.innerWidth / 2, window.innerHeight / 2 + 220, 'Voltar ao início', {
        fontSize: '32px',
        fill: '#0000ff'
    });
    backToStartButton.setOrigin(0.5);
    backToStartButton.setInteractive();
    backToStartButton.setVisible(false);
    backToStartButton.on('pointerdown', () => {
        console.log('Voltando ao início...');
    });

    this.input.keyboard.on('keydown-ESC', () => {
        if (menuVisible) {
            hidePauseMenu.call(this);
        } else {
            showPauseMenu.call(this);
        }
    });
}

function update() {
    if (menuVisible) {
        player.setVelocityX(0);
        return;
    }

    if (player.y > window.innerHeight) {
        showPauseMenu();
    }

    if (this.cursors.left.isDown) {
        player.setVelocityX(-160);
    } else if (this.cursors.right.isDown) {
        player.setVelocityX(160);
    } else {
        player.setVelocityX(0);
    }

    if (this.cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-330);
    }
}

function collectItem(player, item) {
    item.disableBody(true, true);
    score += 10;
    scoreText.setText('Pontuação: ' + score);

    if (items.countActive() === 0) {
        allItemsCollected = true;
        showEndGameMenu();
    }
}

function showEndGameMenu() {
    player.setVisible(false);
    gameOverText.setText('Nível Concluído');
    gameOverText.setStyle({ fill: '#00ff00' });
    gameOverText.setVisible(true);

    restartButton.setVisible(true);
    nextPhaseButton.setVisible(true);
    backToStartButton.setVisible(true);
}

function hitHole() {
    showGameOver.call(this);
}

function restartGame() {
    score = 0;
    scoreText.setText('Pontuação: ' + score);
    allItemsCollected = false;

    createMap.call(this);
    addItems.call(this);

    player.clearTint();
    player.setPosition(150, window.innerHeight - 400);
    player.setVisible(true);

    this.physics.add.collider(player, platforms);
    this.physics.add.overlap(player, holes, hitHole, null, this);

    gameOverText.setVisible(false);
    restartButton.setVisible(false);
    nextPhaseButton.setVisible(false);
    backToStartButton.setVisible(false);

    menuVisible = false;
    hidePauseMenu.call(this);
}

function createMap() {
    if (platforms) {
        platforms.clear(true, true);
    }
    if (holes) {
        holes.clear(true, true);
    }

    platforms = this.physics.add.staticGroup();
    const platformPositions = [
        { x: 200, y: window.innerHeight - 150 },
        { x: 400, y: window.innerHeight - 250 },
        { x: 700, y: window.innerHeight - 200 },
        { x: 1000, y: window.innerHeight - 300 },
        { x: 1300, y: window.innerHeight - 250 },
        { x: 150, y: window.innerHeight - 350 },
        { x: 500, y: window.innerHeight - 400 },
        { x: 850, y: window.innerHeight - 450 },
        { x: 1200, y: window.innerHeight - 500 },
        { x: 600, y: window.innerHeight - 650 },
        { x: 900, y: window.innerHeight - 550 },
        { x: 1100, y: window.innerHeight - 650 },
        { x: 1400, y: window.innerHeight - 600 },
        { x: 1600, y: window.innerHeight - 300 },
        { x: 1800, y: window.innerHeight - 400 },
    ];

    platformPositions.forEach(pos => {
        platforms.create(pos.x, pos.y, 'platform').setScale(3, 0.5).refreshBody();
    });

    holes = this.physics.add.staticGroup();
    const holePositions = [
        { x: 100, y: window.innerHeight - 25 },
        { x: 300, y: window.innerHeight - 25 },
        { x: 500, y: window.innerHeight - 25 },
        { x: 700, y: window.innerHeight - 25 },
        { x: 900, y: window.innerHeight - 25 },
        { x: 1100, y: window.innerHeight - 25 },
        { x: 1300, y: window.innerHeight - 25 },
        { x: 1500, y: window.innerHeight - 25 },
        { x: 1700, y: window.innerHeight - 25 },
        { x: 1900, y: window.innerHeight - 25 }
    ];

    holePositions.forEach(pos => {
        holes.create(pos.x, pos.y, 'hole').setScale(0.5).refreshBody();
    });
}

function addItems() {
    if (items) {
        items.clear(true, true);
    }

    const itemPositions = [
        { x: 200, y: window.innerHeight - 200 },
        { x: 400, y: window.innerHeight - 300 },
        { x: 700, y: window.innerHeight - 250 },
        { x: 1000, y: window.innerHeight - 350 },
        { x: 1300, y: window.innerHeight - 300 },
        { x: 150, y: window.innerHeight - 400 },
        { x: 500, y: window.innerHeight - 450 },
        { x: 850, y: window.innerHeight - 500 },
        { x: 1200, y: window.innerHeight - 550 },
    ];

    itemPositions.forEach(pos => {
        items.create(pos.x, pos.y, 'item').setScale(0.5).refreshBody();
    });
}

function showPauseMenu() {
    menuVisible = true;
    gameOverText.setText('Jogo Pausado');
    gameOverText.setVisible(true);
    restartButton.setVisible(true);
    backToStartButton.setVisible(true);
}

function hidePauseMenu() {
    menuVisible = false;
    gameOverText.setVisible(false);
    restartButton.setVisible(false);
    backToStartButton.setVisible(false);
}

function showGameOver() {
    player.setTint(0xff0000);
    player.setVisible(false);

    gameOverText.setText('Game Over');
    gameOverText.setVisible(true);
    restartButton.setVisible(true);
    backToStartButton.setVisible(true);
}
