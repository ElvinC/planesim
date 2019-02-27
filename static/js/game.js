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

    ball = this.matter.add.sprite(300, 200, "ball")
    ball.setCircle()

    ball.setFriction(0.005)
    ball.setBounce(1)
    ball.setScale(0.5)
    window.ball = ball;
}

function update () {

}