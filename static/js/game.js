import Plane from './plane/Plane.js'

// Graphics = Phaser.GameObjects.Graphics

var config = {
    type: Phaser.AUTO,
    width: 1000,
    height: 500,
    backgroundColor: '#6688ff',
    physics: {
        default: 'matter',
        matter: {
            enableSleeping: false,
            gravity: {
            },
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const a = new Plane(4);
console.log(a.getMass())

var game = new Phaser.Game(config)


function preload () {
    this.load.image("ball", 'static/assets/sprites/ball.png');
}

function create() {
/*
    graphics = new Graphics(this)
    graphics.lineStyle(5, 0xFF00FF, 1.0);
    graphics.beginPath();
    graphics.moveTo(100, 100);
    graphics.lineTo(200, 200);
    graphics.closePath();
    graphics.strokePath();

*/

    // matter js bounds
    console.log(this)
    window.game = this;
    /*
    this.matter.add.rectangle(400, 500, 800, 40, {isStatic: true, restitution: 0.2})
    */
    
    // background
    for (var i = 0; i < 4; i++) {
        const ball = this.matter.add.sprite(Math.random() * 800, Math.random() * 400, "ball")
        ball.setCircle(100)

        ball.setFriction(0.005)
        ball.setBounce(1)
        ball.setScale(0.5)
        ball.setFrictionAir(0.00);
    }

    const floor = this.matter.add.rectangle(0, 600, 10000, 50, {isStatic: true, restitution: 0.2});


    const player = this.matter.add.sprite(Math.random() * 800, Math.random() * 400, "ball")
    

    player.setCircle(100)

    player.setFixedRotation();
    player.setAngle(270);
    player.setFrictionAir(0.00);
    player.setMass(30);
    player.setFriction(0.005)
    player.setBounce(1)

    window.player = player;

    this.cursors = this.input.keyboard.createCursorKeys();
    window.cam = this.cameras.main;
    
    
}

function update (time, delta) {
    /*cam = this.cameras.main
*/

    if (this.cursors.left.isDown)
    {
        player.thrustLeft(0.1);
    }
    else if (this.cursors.right.isDown)
    {
        player.thrustRight(0.1);
    }

    if (this.cursors.up.isDown)
    {
        player.thrust(0.1);
    }
    else if (this.cursors.down.isDown)
    {
        player.thrustBack(0.1);
    }

}
