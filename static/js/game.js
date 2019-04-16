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
        width: "18%",
        height: 200,
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

    // generate buttons
    

    scene = new Scene();
    setup()
})


let last_time = 0;

function setup() {
    
    // var floorSprite = new PIXI.Graphics();
    // floorSprite.beginFill(0x1e824c);
    // floorSprite.drawRect(0 - 50000, 0, 100000, 50);
    // floorSprite.endFill();
    var floorSprite = new PIXI.TilingSprite(PIXI.Texture.fromImage('../static/assets/sprites/grass.png'), 100000, 100);
    floorSprite.tileScale.x = 0.1;
    floorSprite.tileScale.y = 0.1;
    floorSprite.position.x = -50000

    scene.addChild(floorSprite)

    // var test = new PhysicalBall(1000, 5, 50);

    // scene.addPhysicalChild(test);
    

    /*
    for (var i = 0; i< 4; i++) {
        var test = new PhysicalBall(Math.random()*500, Math.random()*500, 50);

        scene.addPhysicalChild(test);
    }*/


    // Create a new emitter
    var emitter = new PIXI.particles.Emitter(

        // The PIXI.Container to put the emitter in
        // if using blend modes, it's important to put this
        // on top of a bitmap, and not use the root stage Container
        scene.stage,
    
        // The collection of particle images to use
        [PIXI.Texture.fromImage('../static/assets/sprites/smoke.png')],
    
        // Emitter configuration, edit this to change the look
        // of the emitter
        {
            alpha: {
                list: [
                    {
                        value: 0.3,
                        time: 0
                    },
                    {
                        value: 0.1,
                        time: 1
                    }
                ],
                isStepped: false
            },
            scale: {
                list: [
                    {
                        value: 0.03,
                        time: 0
                    },
                    {
                        value: 0.01,
                        time: 1
                    }
                ],
                isStepped: false,
                "minimumScaleMultiplier": 0.0000001,
                "maximumScaleMultiplier": 0.0000003
            },
            color: {
                list: [
                    {
                        value: "ffffff",
                        time: 0,
                    },
                    {
                        value: "ffffff",
                        time: 1
                    }
                ],
                isStepped: false
            },
            speed: {
                list: [
                    {
                        value: 60,
                        time: 0
                    },
                    {
                        value: 20,
                        time: 1
                    }
                ],
                isStepped: false
            },
            startRotation: {
                min: 0,
                max: 360
            },
            rotationSpeed: {
                min: 0,
                max: 0
            },
            lifetime: {
                min: 0.05,
                max: 0.1
            },
            frequency: 0.5,
            spawnChance: 1,
            particlesPerWave: 1,
            emitterLifetime: 0,
            maxParticles: 500,
            pos: {
                x: 0,
                y: 0
            },
            addAtBack: false,
            spawnType: "point",
        }
    );

    window.emitter = emitter;


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

    var planesound = new Audio();
    window.planesound = planesound;
    planesound.src = "../static/assets/sound/planesound.mp3";
    planesound.loop = true;
    planesound.play();

    last_time = performance.now()
    scene.run()
    render()
}
let counterthing = 1


// render loop
function render() {
    let now = performance.now()
    let dt = (now - last_time) / 1000
    last_time = now

    counterthing += 1;
    scene.render()
    // update simulation
    scene.update(dt)
    scene.camera.setPos(-plane.sprite.position.x, -plane.sprite.position.y)

    emitter.update(0.001);
    emitter.updateOwnerPos(plane.sprite.position.x, plane.sprite.position.y)
    if (counterthing % 10 == 0) {
        emitter.frequency = (1  / (plane.getThrustFraction()*1000 + 10))
        planesound.volume = plane.getThrustFraction()
    }
    
    //console.log(emitter.frequency)
    requestAnimationFrame(render);
}