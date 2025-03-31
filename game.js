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
    pixelArt: true,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);
let player;
let background;
let cursors;
let currentAnimation = 'idle';

// Handle window resize
window.addEventListener('resize', () => {
    game.scale.resize(5036, window.innerHeight);
    if (background) {
        resizeBackground();
    }
    if (player) {
        player.y = config.height / 2;
    }
});

function resizeBackground() {
    const imageRatio = 1462 / 5036;
    const viewportRatio = window.innerHeight / 5036;
    
    if (viewportRatio < imageRatio) {
        const height = 5036 * imageRatio;
        background.setDisplaySize(5036, height);
        background.setY(-(height - window.innerHeight) / 2);
        background.setX(0);
    } else {
        const width = window.innerHeight / imageRatio;
        background.setDisplaySize(width, window.innerHeight);
        background.setX((5036 - width) / 2);
        background.setY(0);
    }
}

function preload() {
    this.load.image('background', 'background.png');
    this.load.spritesheet('newCharacter', 'assets/test_art.png', { 
        frameWidth: 416,  
        frameHeight: 454, 
        spacing: 0       
    });
}

function create() {
    // Add background
    background = this.add.image(0, 0, 'background');
    background.setOrigin(0, 0);
    background.setTint(0x666666);
    resizeBackground();

    // Add player with new character
    player = this.physics.add.sprite(config.width / 2, config.height / 2, 'newCharacter');
    player.setCollideWorldBounds(true);
    
    // Calculate scale to make character a reasonable size
    const desiredHeight = config.height * 0.3; 
    const scale = desiredHeight / player.height;
    player.setScale(scale);

    // Create animations for walking (20 frames total)
    this.anims.create({
        key: 'walk',
        frames: this.anims.generateFrameNumbers('newCharacter', { 
            start: 0,
            end: 19  // Full walk cycle uses frames 0-19
        }),
        frameRate: 12, // Increased frame rate for smoother animation
        repeat: -1
    });

    this.anims.create({
        key: 'idle',
        frames: this.anims.generateFrameNumbers('newCharacter', { 
            start: 0,
            end: 0
        }),
        frameRate: 1,
        repeat: 0
    });

    // Set up cursor keys for movement
    cursors = this.input.keyboard.createCursorKeys();

    // Set up camera
    this.cameras.main.setBounds(0, 0, config.width, config.height);
    this.cameras.main.startFollow(player, true, 0.1, 0.1);

    // Start with idle animation
    player.play('idle');
}

function update() {
    const speed = 300;

    // Handle movement
    player.setVelocityX(0);

    if (cursors.left.isDown) {
        player.setVelocityX(-speed);
        player.setFlipX(true);
        if (currentAnimation !== 'walk') {
            currentAnimation = 'walk';
            player.play('walk');
        }
    } else if (cursors.right.isDown) {
        player.setVelocityX(speed);
        player.setFlipX(false);
        if (currentAnimation !== 'walk') {
            currentAnimation = 'walk';
            player.play('walk');
        }
    } else if (currentAnimation === 'walk') {
        currentAnimation = 'idle';
        player.play('idle');
    }

    // Keep vertical position fixed
    player.y = config.height / 2;
}
