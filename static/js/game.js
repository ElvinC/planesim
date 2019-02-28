var config = {
    type: Phaser.AUTO,
    width: 1000,
    height: 500,
    backgroundColor: '#6688ff',
    physics: {
        default: 'matter',
        matter: {
            enableSleeping: true
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config)

function preload () {
    // this.load.setBaseURL('http://labs.phaser.io');

    this.load.image("ball", 'static/assets/sprites/ball.png');
}

function create() {

    // matter js bounds
    this.matter.world.setBounds(0, 0, 1000, 500)

    // background
    for (var i = 0; i < 4; i++) {
        ball = this.matter.add.sprite(Math.random() * 800, Math.random() * 400, "ball")
        ball.setCircle(100)

        ball.setFriction(0.005)
        ball.setBounce(1)
        ball.setScale(0.5)
    }

    player = this.matter.add.sprite(Math.random() * 800, Math.random() * 400, "ball")
    player.setCircle(100)

    player.setFixedRotation();
    player.setAngle(270);
    player.setFrictionAir(0.05);
    player.setMass(30);
    player.setFriction(0.005)
    player.setBounce(1)
    player.setScale(0.5)

    window.player = player;

    cursors = this.input.keyboard.createCursorKeys();
    
}

function update () {
    Body = this.matter.Body

    if (cursors.left.isDown)
    {
        player.thrustLeft(0.1);
    }
    else if (cursors.right.isDown)
    {
        player.thrustRight(0.1);
    }

    if (cursors.up.isDown)
    {
        player.thrust(0.1);
    }
    else if (cursors.down.isDown)
    {
        player.thrustBack(0.1);
    }
}
