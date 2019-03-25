import Scene from './scene/Scene.js'
import CustomPlane from './plane/CustomPlane.js';
/*
var Engine = Matter.Engine,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Svg = Matter.Svg,
    Vector = Matter.Vector
*/
/*
Vector.unit = function(angle, len = 1) {
    return {
        x: Math.cos(angle) * len,
        y: Math.sin(angle) * len
    }
}
*/
// stage objects
var stageObjects = []

var scene;

var instruments;

function SpriteObjects(x, y, radius) {
    var sprite = new PIXI.Graphics();
    sprite.beginFill(0x3355ff);
    sprite.drawCircle(0, 0, radius);
    sprite.endFill();
    return sprite
}

function PhysicsObject(x, y, radius) {
    var circ = Bodies.circle(x, y, radius, {restitution: 0.4})
    return circ;
}

class PhysicalBall {
    constructor(x, y, radius) {
        this.sprite = SpriteObjects(x, y, radius)
        this.body = PhysicsObject(x, y, radius)
    }

    update() {
        this.sprite.position = this.body.position;
        this.sprite.rotation = this.body.angle;
    }
}

class PhysicalRect {
    constructor(x, y, width, height) {
        this.sprite = new PIXI.Graphics()
        this.sprite.beginFill(0xffffff)
        this.sprite.drawRect(0 - width/2, 0 - height/2, width, height)
        this.sprite.endFill()

        this.body = Bodies.rectangle(x, y, width, height, {restitution: 0.4})

    }

    update() {
        this.sprite.position = this.body.position;
        this.sprite.rotation = this.body.angle;
    }
}

$(document).ready(() => {
    // Flight instruments setup
    var options = {
        size : 200,				// Sets the size in pixels of the indicator (square)
        roll : 0,				// Roll angle in degrees for an attitude indicator
        pitch : 400,				// Pitch angle in degrees for an attitude indicator
        heading: 0,				// Heading angle in degrees for an heading indicator
        vario: 0,				// Variometer in 1000 feets/min for the variometer indicator
        airspeed: 0,			// Air speed in knots for an air speed indicator
        altitude: 0,			// Altitude in feets for an altimeter indicator
        pressure: 1000,			// Pressure in hPa for an altimeter indicator
        showBox : false,			// Sets if the outer squared box is visible or not (true or false)
        img_directory : '../static/img/'	// The directory where the images are saved to
    }

    instruments = {
        attitude: $.flightIndicator('#attitude', 'attitude', options),
        heading: $.flightIndicator('#heading', 'heading', options),
        variometer: $.flightIndicator('#variometer', 'variometer', options),
        airspeed: $.flightIndicator('#airspeed', 'airspeed', options),
        altimeter: $.flightIndicator('#altimeter', 'altimeter', options),
    }

    scene = new Scene();
    setup()
})

function setup() {
    
    var floorSprite = new PIXI.Graphics();
    floorSprite.beginFill(0x1e824c);
    floorSprite.drawRect(0 - 50000, 0, 100000, 50);
    floorSprite.endFill();
    scene.addChild(floorSprite)

    // var test = new PhysicalBall(1000, 5, 50);

    // scene.addPhysicalChild(test);
    

    /*
    for (var i = 0; i< 4; i++) {
        var test = new PhysicalBall(Math.random()*500, Math.random()*500, 50);

        scene.addPhysicalChild(test);
    }*/

    for (var i = 0; i < 40; i++) {
        var text = new PIXI.Text(`Distance: ${i * 100}`, {fontFamily : 'Arial', fontSize: 10, fill : 0xff1010, align : 'center'})
        text.position.x = i * 100;
        text.position.y = -100;
        scene.addChild(text)
    }

    var pla = new CustomPlane(0, 0, scene.keys, instruments = instruments)
    console.log(pla)

    window.plane = pla;
    scene.addCustomPhysicalChild(pla);

    scene.run()
    render()
}


// render loop
function render() {
    scene.render()
    scene.update()
    scene.camera.setPos(-plane.sprite.position.x, -plane.sprite.position.y)


    requestAnimationFrame(render);
}