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
let animationIndex = 0;
const animations = ['idle', 'walk', 'kick', 'punch', 'jump', 'jumpkick', 'win', 'die'];

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
    this.load.spritesheet('brawler', 'assets/brawler48x48.png', { frameWidth: 48, frameHeight: 48 });
}

function create() {
    // Add background
    background = this.add.image(0, 0, 'background');
    background.setOrigin(0, 0);
    background.setTint(0x666666);
    resizeBackground();

    // Add player
    player = this.physics.add.sprite(config.width / 2, config.height / 2, 'brawler');
    player.setCollideWorldBounds(true);
    player.setScale(4);

    // Create all animations
    this.anims.create({
        key: 'walk',
        frames: this.anims.generateFrameNumbers('brawler', { frames: [ 0, 1, 2, 3 ] }),
        frameRate: 8,
        repeat: -1
    });

    this.anims.create({
        key: 'idle',
        frames: this.anims.generateFrameNumbers('brawler', { frames: [ 5, 6, 7, 8 ] }),
        frameRate: 8,
        repeat: -1
    });

    this.anims.create({
        key: 'kick',
        frames: this.anims.generateFrameNumbers('brawler', { frames: [ 10, 11, 12, 13, 10 ] }),
        frameRate: 8,
        repeat: 0
    });

    this.anims.create({
        key: 'punch',
        frames: this.anims.generateFrameNumbers('brawler', { frames: [ 15, 16, 17, 18, 17, 15 ] }),
        frameRate: 8,
        repeat: 0
    });

    this.anims.create({
        key: 'jump',
        frames: this.anims.generateFrameNumbers('brawler', { frames: [ 20, 21, 22, 23 ] }),
        frameRate: 8,
        repeat: 0
    });

    this.anims.create({
        key: 'jumpkick',
        frames: this.anims.generateFrameNumbers('brawler', { frames: [ 20, 21, 22, 23, 25, 23, 22, 21 ] }),
        frameRate: 8,
        repeat: 0
    });

    this.anims.create({
        key: 'win',
        frames: this.anims.generateFrameNumbers('brawler', { frames: [ 30, 31 ] }),
        frameRate: 8,
        repeat: -1
    });

    this.anims.create({
        key: 'die',
        frames: this.anims.generateFrameNumbers('brawler', { frames: [ 35, 36, 37 ] }),
        frameRate: 8,
        repeat: 0
    });

    // Set up cursor keys for movement
    cursors = this.input.keyboard.createCursorKeys();

    // Set up camera
    this.cameras.main.setBounds(0, 0, config.width, config.height);
    this.cameras.main.startFollow(player, true, 0.1, 0.1);

    // Start with idle animation
    player.play('idle');

    // Add click handler for animation cycling
    this.input.on('pointerdown', () => {
        animationIndex = (animationIndex + 1) % animations.length;
        currentAnimation = animations[animationIndex];
        
        // Play the new animation
        player.play(currentAnimation);

        // If it's a one-time animation, go back to idle when done
        if (!['idle', 'walk', 'win'].includes(currentAnimation)) {
            player.once('animationcomplete', () => {
                currentAnimation = 'idle';
                player.play('idle');
            });
        }

        // Add text to show current animation
        const existingText = this.children.list.find(child => child.type === 'Text');
        if (existingText) {
            existingText.destroy();
        }
        this.add.text(10, 10, `Animation: ${currentAnimation}`, { 
            color: '#00ff00',
            fontSize: '24px',
            backgroundColor: '#000000'
        }).setScrollFactor(0);
    });
}

function update() {
    const speed = 300;
    const isInAction = ['kick', 'punch', 'jump', 'jumpkick', 'win', 'die'].includes(currentAnimation);

    // Handle movement only if not in special move
    if (!isInAction) {
        player.setVelocityX(0);

        if (cursors.left.isDown) {
            player.setVelocityX(-speed);
            player.setFlipX(false);
            if (currentAnimation !== 'walk') {
                currentAnimation = 'walk';
                player.play('walk');
            }
        } else if (cursors.right.isDown) {
            player.setVelocityX(speed);
            player.setFlipX(true);
            if (currentAnimation !== 'walk') {
                currentAnimation = 'walk';
                player.play('walk');
            }
        } else if (currentAnimation === 'walk') {
            currentAnimation = 'idle';
            player.play('idle');
        }
    } else {
        player.setVelocityX(0);
    }

    // Keep vertical position fixed
    player.y = config.height / 2;
}
