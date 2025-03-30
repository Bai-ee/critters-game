const config = {
    type: Phaser.AUTO,
    width: 5036,
    height: window.innerHeight,
    scale: {
        mode: Phaser.Scale.NONE,
        parent: 'game',
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);
let player;
let background;
let critterWidth = 0;
let critterHeight = 0;
let cursors;
let spotlight;

// Handle window resize
window.addEventListener('resize', () => {
    game.scale.resize(5036, window.innerHeight);
    if (background) {
        resizeBackground();
    }
    if (player) {
        player.y = config.height / 2; // Keep vertical position centered
    }
});

function resizeBackground() {
    const imageRatio = 1462 / 5036; // original height / original width
    const viewportRatio = window.innerHeight / 5036;
    
    if (viewportRatio < imageRatio) {
        // If viewport is shorter than image ratio, fit to width
        const height = 5036 * imageRatio;
        background.setDisplaySize(5036, height);
        background.setY(-(height - window.innerHeight) / 2); // Center vertically
        background.setX(0);
    } else {
        // If viewport is taller than image ratio, fit to height
        const width = window.innerHeight / imageRatio;
        background.setDisplaySize(width, window.innerHeight);
        background.setX((5036 - width) / 2); // Center horizontally
        background.setY(0);
    }
}

function preload() {
    // Load the background image
    this.load.image('background', 'background.png');
    
    // Load the critter sprite
    this.load.image('critter', 'critter.png');
}

function create() {
    // Add background with darker tint
    background = this.add.image(0, 0, 'background');
    background.setOrigin(0, 0);
    background.setTint(0x666666); // Darken the background
    resizeBackground();

    // Get critter texture dimensions
    const critterTexture = this.textures.get('critter');
    critterWidth = critterTexture.source[0].width;
    critterHeight = critterTexture.source[0].height;

    // Add player using critter sprite
    player = this.physics.add.sprite(config.width / 2, config.height / 2, 'critter');
    player.setCollideWorldBounds(true);

    // Scale the player based on screen height
    const scaleFactor = (config.height * 0.30) / critterHeight; // Make critter 30% of screen height
    player.setScale(scaleFactor);

    // Create spotlight effect around player
    spotlight = this.add.circle(0, 0, 200, 0x000000, 0.4);
    spotlight.setBlendMode(Phaser.BlendModes.MULTIPLY);

    // Set up cursor keys
    cursors = this.input.keyboard.createCursorKeys();

    // Set up camera to follow player
    this.cameras.main.setBounds(0, 0, config.width, config.height);
    this.cameras.main.startFollow(player, true, 0.1, 0.1);
}

function update() {
    const speed = 300;

    // Reset velocity
    player.setVelocityX(0);

    // Handle horizontal movement only
    if (cursors.left.isDown) {
        player.setVelocityX(-speed);
        player.setFlipX(true);
    } else if (cursors.right.isDown) {
        player.setVelocityX(speed);
        player.setFlipX(false);
    }

    // Keep vertical position fixed
    player.y = config.height / 2;

    // Update spotlight position to follow player
    spotlight.x = player.x;
    spotlight.y = player.y;
}
