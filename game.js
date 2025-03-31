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
let critterWidth = 0;
let critterHeight = 0;
let cursors;
let playerScale;
let isAttacking = false;
let currentAnimation = 'walk';
let spaceKey;

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
    this.load.image('critter', 'critter.png');
    this.load.spritesheet('brawler', 
        'https://cdn.phaserfiles.com/v385/assets/animations/brawler48x48.png',
        { frameWidth: 48, frameHeight: 48 }
    );
}

function create() {
    background = this.add.image(0, 0, 'background');
    background.setOrigin(0, 0);
    background.setTint(0x666666);
    resizeBackground();

    const critterTexture = this.textures.get('critter');
    critterWidth = critterTexture.source[0].width;
    critterHeight = critterTexture.source[0].height;

    playerScale = (config.height * 0.30) / 48; 

    player = this.physics.add.sprite(config.width / 2, config.height / 2, 'brawler');
    player.setCollideWorldBounds(true);
    player.setScale(playerScale * 2);

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
        frameRate: 12,
        repeat: 0
    });

    this.anims.create({
        key: 'punch',
        frames: this.anims.generateFrameNumbers('brawler', { frames: [ 15, 16, 17, 18, 17, 15 ] }),
        frameRate: 12,
        repeat: 0
    });

    this.anims.create({
        key: 'jump',
        frames: this.anims.generateFrameNumbers('brawler', { frames: [ 20, 21, 22, 23 ] }),
        frameRate: 8,
        repeat: -1
    });

    this.anims.create({
        key: 'jumpkick',
        frames: this.anims.generateFrameNumbers('brawler', { frames: [ 20, 21, 22, 23, 25, 23, 22, 21 ] }),
        frameRate: 12,
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

    cursors = this.input.keyboard.createCursorKeys();
    spaceKey = this.input.keyboard.addKey('SPACE');

    this.cameras.main.setBounds(0, 0, config.width, config.height);
    this.cameras.main.startFollow(player, true, 0.1, 0.1);

    // Start with walking animation
    player.play('walk');
}

function update() {
    const speed = 300;

    // Handle attack animations with space key
    if (spaceKey.isDown && !isAttacking) {
        isAttacking = true;
        const attackMoves = ['kick', 'punch', 'jumpkick'];
        const randomAttack = attackMoves[Math.floor(Math.random() * attackMoves.length)];
        
        player.play(randomAttack);
        player.once('animationcomplete', () => {
            isAttacking = false;
            player.play(currentAnimation);
        });
    }

    if (!isAttacking) {
        player.setVelocityX(0);

        if (cursors.left.isDown) {
            player.setVelocityX(-speed);
            player.setFlipX(true);
            currentAnimation = 'walk';
            player.play('walk', true);
        } else if (cursors.right.isDown) {
            player.setVelocityX(speed);
            player.setFlipX(false);
            currentAnimation = 'walk';
            player.play('walk', true);
        } else {
            currentAnimation = 'idle';
            player.play('idle', true);
        }
    }

    player.y = config.height / 2;
}
