import { Vec2, Vector } from "./Vec2.js";
import GraphicsVector from "../scene/GraphicsVector.js";


class physicalObject {
    constructor(x, y, mass) {
        this.pos = new Vec2(x, y);
        this.mass = mass;

        this.vel = new Vec2(0, 0);
        this.acc = new Vec2(0, 0);
        this.force = new Vec2(0, 0);

        this.angle = 0;
        this.angularVel = 0;
        this.angularAcc = 0;
        this.torque = 0;
        this.momentOfInertia = 100;
    }

    getPosition() {
        return {x: this.pos.x, y: this.pos.y}
    }

    addForce(force) {
        this.force.addInPlace(force);
    }

    addTorque(torque) {
        this.torque += torque
    }

    update(dt) {
        this.acc = this.force.divide(this.mass);
        this.vel.addInPlace(this.acc.multiply(dt));
        this.pos.addInPlace(this.vel.multiply(dt))

        // reset force
        this.force.x = 0;
        this.force.y = 0;

        // torque
        this.angularAcc = this.torque / this.momentOfInertia;
        this.angularVel += this.angularAcc * dt;
        this.angularVel *= Math.max(1 - (0.5 * dt), 0) // dampening
        this.angle += this.angularVel * dt;
        // wrap angle around
        this.angle = this.angle % (2 * Math.PI);
        this.torque = 0;
    }

}

export default class CustomPlane {
    constructor(x, y, keys) {
        console.log("WAT")
        // var texture = PIXI.Texture.fromImage('static/assets/sprites/A220.png');
        var texture = PIXI.Texture.fromImage('../static/assets/sprites/A220.png')
        this.sprite = new PIXI.Container();
        this.spriteImg = new PIXI.Sprite(texture);
        this.spriteImg.anchor.x = 0.5;
        this.spriteImg.anchor.y = 0.5;
        this.spriteImg.scale.set(0.5, 0.5)
        this.spriteImg.width = 42;
        this.spriteImg.height = 24;
        this.sprite.addChild(this.spriteImg)

        this.keys = keys

        this.body = new physicalObject(x, y, 65000)

        this.speedVec = new GraphicsVector(this.body.vel, 0.2);
        this.sprite.addChild(this.speedVec)

        // thrust
        this.thrust = 0
        this.minThrust = 0;
        this.maxThrust = 300000;
    }
    update() {
        if (this.keys[38]) {
            this.thrust += this.maxThrust / 100;
            this.thrust = Math.max(Math.min(this.thrust, this.maxThrust), this.minThrust)
        }
        if (this.keys[40]) {
            this.thrust -= this.maxThrust / 100;
            this.thrust = Math.max(Math.min(this.thrust, this.maxThrust), this.minThrust)
        }
        if (this.keys[37]) {
            this.body.addTorque(-10)
        }
        if (this.keys[39]) {
            this.body.addTorque(10)
        }
        $("#thrust").html(Math.round(this.thrust))

        // thrust
        this.body.addForce(Vector.unit(this.body.angle, this.thrust))

        // update vector
        this.speedVec.update(this.body.vel)

        
        if (this.body.pos.x > 1000) {
            this.body.pos.x = 0
        }

        // bounce on floor
        if (this.body.pos.y > 475) {
            this.body.vel.y = -this.body.vel.y * 0.2
            this.body.pos.y = 475
        }

        const angleUnit = Vector.unit(this.body.angle)
        if (this.body.pos.add(angleUnit.multiply(20)).y > 475) {
            this.body.vel.y = -Math.abs(this.body.vel.y) * 0.2
            this.body.pos.y -= this.body.pos.add(angleUnit.multiply(20)).y - 475
            this.body.addTorque(-400 * Math.sin(this.body.angle))
        }
        if (this.body.pos.add(angleUnit.multiply(-20)).y > 475) {
            this.body.vel.y = -Math.abs(this.body.vel.y) * 0.2
            this.body.pos.y -= this.body.pos.add(angleUnit.multiply(-20)).y - 475
            this.body.addTorque(-400 * Math.sin(this.body.angle))
        }
        

        const velUnit = this.body.vel.unit()
        const velAngle = velUnit.angle()
        const AoA = this.body.angle - velAngle

        const Cl = 1 * Math.sin(-AoA + 0.1);
        const speedSquared = this.body.vel.lengthSquared()
        const speed = this.body.vel.length()
        $("#speed").html(Math.round(speed))
        $("#vSpeed").html(Math.round(-this.body.vel.y));
        $("#altitude").html(-Math.round(this.body.pos.y) + ", " + -Math.round(this.body.pos.x))
        const liftMag = Math.min(Math.max(Cl * speedSquared * 1.3 * 0.5 * 120, -100000000), 100000000) 
        $("#lift").html((liftMag))
        const lift = (new Vec2(velUnit.y, -velUnit.x)).multiply(liftMag)
        this.body.addForce(lift)

        const Cd = 0.3 * Math.sin(-AoA + 0.1);
        const dragMag = Math.abs(Math.min(Cd * speedSquared * 1.3 * 0.5 * 120, 100000000)) 
        const drag = velUnit.multiply(-1 * dragMag)
        this.body.addForce(drag)

        $("#acc").html(this.body.acc.length())

        // turn towards moving direction
        this.body.addTorque(-AoA * speed * 0.1)
        // gravity
        this.body.addForce(new Vec2(0, 9.81 * this.body.mass))


        this.body.update(1/30)
        
        this.sprite.position = this.body.getPosition();
        this.spriteImg.rotation = this.body.angle;
        
    }
}