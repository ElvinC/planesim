var Engine = Matter.Engine,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Svg = Matter.Svg,
    Vector = Matter.Vector

export default class Plane {
    constructor(x, y, keys) {
        var texture = PIXI.Texture.fromImage('static/assets/sprites/A220.png');
        this.sprite = new PIXI.Sprite(texture);
        this.sprite.anchor.x = 0.5;
        this.sprite.anchor.y = 0.5;
        this.sprite.scale.set(0.5, 0.5)
        this.sprite.width = 42;
        this.sprite.height = 24;

        this.keys = keys

        this.body = Bodies.rectangle(x, y, 480, 70, {restitution: 0.3,friction:0.003,frictionAir: 0.001,mass:65000})
        

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
        
        const velUnit = Vector.normalise(this.body.velocity);
        const Cl = 0.00001 * Math.sin(-this.body.angle + 0.2);
        const speedSquared = Math.pow(this.body.speed, 2);
        $("#speed").html(Math.round(this.body.speed))
        $("#altitude").html(-Math.round(this.body.position.y) + ", " + -Math.round(this.body.position.x))
        const liftMag = Math.min(Math.max(Cl * speedSquared, -0.15), 0.15) 
        $("#lift").html((liftMag))
        const lift = Vector.mult(Vector.rotate(velUnit, -Math.PI/2), liftMag)
        
        const Cd = 0.00001;
        const drag = Vector.mult(Vector.neg(velUnit), Cd * speedSquared)
        console.log(drag)
        const aero = Vector.add(lift, drag);
        
        this.body.force = Vector.add(this.body.force, aero)

        if (this.body.position.x > 20000) {
            Matter.Body.setPosition(this.body, {x: -1000, y: this.body.position.y})
        }
        if (this.body.position.y > 500) {
            Matter.Body.setPosition(this.body, {x: this.body.position.x, y: 400})
        }

        this.sprite.position = this.body.position;
        this.sprite.rotation = this.body.angle;
        
    }
}