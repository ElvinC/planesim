import * as jQuery from '../lib/jquery.min.js'
import Plane from './plane/Plane.js'

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
                scale: 0
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



    // matter js bounds

    // background
    for (var i = 0; i < 4; i++) {
        const ball = this.matter.add.sprite(Math.random() * 800, Math.random() * 400, "ball")
        ball.setCircle(100)

        ball.setFriction(0.005)
        ball.setBounce(1)
        ball.setScale(0.5)
        ball.setFrictionAir(0.00);
    }

    const floor = this.matter.add.rectangle(0, 0, 500, 200);

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

    var controlConfig = {
        camera: this.cameras.main,
        left: this.cursors.left,
        right: this.cursors.right,
        up: this.cursors.up,
        down: this.cursors.down,
        acceleration: 0.06,
        drag: 0.0005,
        maxSpeed: 1.0
    };

    this.controls = new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig);
    
    window.cam = this.cameras.main;
    
}

function update (time, delta) {

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

    this.controls.update(delta);
}
