import Scene from './scene/Scene.js'

var Engine = Matter.Engine,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Svg = Matter.Svg,
    Vector = Matter.Vector


Vector.unit = function(angle, len = 1) {
    return {
        x: Math.cos(angle) * len,
        y: Math.sin(angle) * len
    }
}

// stage objects
var stageObjects = []

var scene;


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

class Plane {
    constructor(x, y, keys) {
        var texture = PIXI.Texture.fromImage('static/assets/sprites/A220.png');
        this.sprite = new PIXI.Sprite(texture);
        this.sprite.anchor.x = 0.5;
        this.sprite.anchor.y = 0.5;
        this.sprite.scale.set(0.5, 0.5)

        this.keys = keys

        this.body = Bodies.rectangle(x, y, 480, 70, {restitution: 0.3,friction:0.003,frictionAir: 0.001})

        var _this = this;
        $(window).keydown(function(e) {
            if (e.which === 38) {
                
            }
            else if (e.which === 40) {
                // _this.body.force.x = -1;
            }
            else if (e.which === 37) {
            }
            else if (e.which === 39) {
            }
            
        })
    }
    update() {
        if (this.keys[38]) {
            this.body.force = Vector.add(this.body.force, Vector.unit(this.body.angle, 0.1))
        }
        if (this.keys[37]) {
            this.body.torque = -2;
        }
        if (this.keys[39]) {
            this.body.torque = 2;
        }
        
        // LIFT
        
        // const velUnit = Vector.normalise(this.body.velocity);
        const Cl = 0.00001 * Math.sin(-this.body.angle + 0.2);
        const speedSquared = Math.pow(this.body.speed, 2);
        $("#speed").html(Math.round(this.body.speed))
        const liftMag = Cl * speedSquared 
        const lift = Vector.mult(Vector.rotate(Vector.unit(this.body.angle), -Math.PI/2), liftMag)
        
        const Cd = 0.000001;
        const drag = Vector.mult(Vector.neg(Vector.unit(this.body.angle)), Cd * speedSquared)

        const aero = Vector.add(lift, drag);
        
        this.body.force = Vector.add(this.body.force, aero)

        if (this.body.position.x > 20000) {
            Matter.Body.setPosition(this.body, {x: -1000, y: this.body.position.y})
        }

        this.sprite.position = this.body.position;
        this.sprite.rotation = this.body.angle;
        
    }
}

$(document).ready(() => {
    // Matter.js setup

    scene = new Scene();
    setup()
})

function setup() {
    
    var floorSprite = new PIXI.Graphics();
    floorSprite.beginFill(0x1e824c);
    floorSprite.drawRect(0 - 50000, 500 - 25, 100000, 50);
    floorSprite.endFill();
    scene.addChild(floorSprite)

    for (var i = 0; i< 4; i++) {
        var test = new PhysicalBall(Math.random()*500, Math.random()*500, 50);

        scene.addPhysicalChild(test);
    }

    for (var i = 0; i < 40; i++) {
        var text = new PIXI.Text(`Distance: ${i * 1000}`, {fontFamily : 'Arial', fontSize: 24, fill : 0xff1010, align : 'center'})
        text.position.x = i * 1000;
        scene.addChild(text)
    }

    var pla = new Plane(0, 0, scene.keys);
    window.plane = pla
    scene.addPhysicalChild(pla);

    scene.run()
    render()
}


// render loop
function render() {
    scene.render()
    scene.update()
    scene.camera.setPos(-plane.body.position.x, 0)

    requestAnimationFrame(render);
}