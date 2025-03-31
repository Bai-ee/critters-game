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
let playerScale;

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
    
    // Get the original critter dimensions for scaling reference
    this.load.image('critter', 'critter.png');
    
    // Load character spritesheet
    this.load.spritesheet('character', 
        'https://labs.phaser.io/assets/sprites/dude.png',
        { frameWidth: 32, frameHeight: 48 }
    );
}

function create() {
    // Add background with darker tint
    background = this.add.image(0, 0, 'background');
    background.setOrigin(0, 0);
    background.setTint(0x666666); // Darken the background
    resizeBackground();

    // Get critter texture dimensions for scaling reference
    const critterTexture = this.textures.get('critter');
    critterWidth = critterTexture.source[0].width;
    critterHeight = critterTexture.source[0].height;

    // Calculate scale factor based on original critter size
    playerScale = (config.height * 0.30) / critterHeight;

    // Add player using sprite sheet
    player = this.physics.add.sprite(config.width / 2, config.height / 2, 'character');
    player.setCollideWorldBounds(true);
    player.setScale(playerScale * 4.5); // Increased from 1.5 to 4.5 (3x larger)

    // Create walking animations
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('character', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [ { key: 'character', frame: 4 } ],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('character', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

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
        player.anims.play('left', true);
    } else if (cursors.right.isDown) {
        player.setVelocityX(speed);
        player.anims.play('right', true);
    } else {
        player.anims.play('turn');
    }

    // Keep vertical position fixed
    player.y = config.height / 2;
}
