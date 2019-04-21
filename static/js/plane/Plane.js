import { Vec2, Vector } from "./Vec2.js";
import GraphicsVector from "../scene/GraphicsVector.js";
import { ISA } from "../physics/atmosphere.js";


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

    addForce(force) {
        this.force.addInPlace(force);
    }

    addTorque(torque) {
        this.torque += torque
    }

    update(dt) {
        // velocity verlet
        const newAcc = this.force.divide(this.mass);
        this.acc = newAcc;
        this.pos.addInPlace( Vector.add(this.vel.multiply(dt), newAcc.multiply(0.5 * Math.pow(dt,2))) )
        this.vel.addInPlace(newAcc.multiply(dt));

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
    constructor(x, y, keys, instruments) {
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

        this.explodesound = new Audio();
        this.explodesound.src = "../static/assets/sound/explode1.mp3";
    

        this.keys = keys

        if (instruments) {
            this.instruments = instruments;
            this.hasInstruments = true;
        } else {
            this.hasInstruments = false;
        }

        this.body = new physicalObject(x, y, 65000)

        // initialize graphical vectors
        this.speedVec = new GraphicsVector(this.body.vel, 0.15);
        this.sprite.addChild(this.speedVec)

        this.liftVec = new GraphicsVector(this.body.vel, 0.00003, 0x0000ff);
        this.sprite.addChild(this.liftVec)

        this.dragVec = new GraphicsVector(this.body.vel, 0.00003, 0x0000ff);
        this.sprite.addChild(this.dragVec)

        this.weightVec = new GraphicsVector(new Vec2(0, 9.81 * this.body.mass), 0.00003, 0x000033);
        this.sprite.addChild(this.weightVec)

        this.thrustVec = new GraphicsVector(new Vec2(0, 9.81 * this.body.mass), 0.00003, 0x0000ff);
        this.sprite.addChild(this.thrustVec)

        this.vectorList = [this.speedVec, this.liftVec, this.dragVec, this.weightVec, this.thrustVec]

        // thrust
        this.thrust = 0
        this.minThrust = 0;
        this.maxThrust = 400000;

        // flap
        this.flap = 0;
        this.minFlap = -0.5;
        this.maxFlap = 0.5;

        // misc settings
        this.settings = {
            showVector: true,
            updateHUD: true,
        }
    }

    getThrustFraction() {
        return this.thrust / this.maxThrust
    }

    update(dt) {
        if (this.keys[38]) {
            this.thrust += this.maxThrust / 100;
            this.thrust = Math.max(Math.min(this.thrust, this.maxThrust), this.minThrust)
        }
        if (this.keys[40]) {
            this.thrust -= this.maxThrust / 100;
            this.thrust = Math.max(Math.min(this.thrust, this.maxThrust), this.minThrust)
        }
        if (this.keys[37]) {
            // this.body.addTorque(-10)
            this.flap += this.maxFlap / 30;
            this.flap = Math.max(Math.min(this.flap, this.maxFlap), this.minFlap)
        }
        if (this.keys[39]) {
            this.flap -= this.maxFlap / 30;
            this.flap = Math.max(Math.min(this.flap, this.maxFlap), this.minFlap)
            // this.body.addTorque(10)
        }
        
        $("#thrustSlider").val(this.thrust / this.maxThrust)
        $("#elevatorSlider").val(-this.flap / 0.5)

        // thrust
        this.body.addForce(Vector.unit(this.body.angle, this.thrust))

        // update vector
        this.speedVec.update(this.body.vel)


        this.thrustVec.update(Vector.unit(this.body.angle, this.thrust))

        
        if (this.body.pos.x > 10000) {
            this.body.pos.x = 0
        }

        const floor = 0

        let hit = false

        // bounce on floor
        if (this.body.pos.y > floor) {
            this.body.vel.y = -this.body.vel.y * 0.2
            this.body.pos.y = floor
            hit = true;
        }

        const angleUnit = Vector.unit(this.body.angle)
        if (this.body.pos.add(angleUnit.multiply(20)).y > floor) {
            this.body.vel.y = -Math.abs(this.body.vel.y) * 0.2
            this.body.pos.y -= this.body.pos.add(angleUnit.multiply(20)).y - floor
            this.body.addTorque(-400 * Math.sin(this.body.angle))
            hit = true;
        }
        if (this.body.pos.add(angleUnit.multiply(-20)).y > floor) {
            this.body.vel.y = -Math.abs(this.body.vel.y) * 0.2
            this.body.pos.y -= this.body.pos.add(angleUnit.multiply(-20)).y - floor
            this.body.addTorque(-400 * Math.sin(this.body.angle))
            hit = true;
        }

        if (hit && this.body.vel.y < -3) {
            window.emitter.startColor.value = {r: 255, g: 120, b: 120}
            this.explodesound.play();
            $("#largemsg").html("You crashed")
            setTimeout(function() {
                $("#largemsg").html("");
                window.emitter.startColor.value = {r: 255, g: 255, b: 255}
            }, 5000)
        }
        

        const velUnit = this.body.vel.unit()
        const velAngle = velUnit.angle()
        // angle of attack
        const AoA = -Math.acos( Vector.dot(velUnit, Vector.unit(this.body.angle)) ) * Math.sign(Vector.perp(velUnit, Vector.unit(this.body.angle)))
        const altitude = -this.body.pos.y;
        
        // atmospheric density
        const atmos = ISA(altitude)
        const density = atmos.density;

        const Cl = 1 * Math.sin(AoA + this.flap + 0.1);
        const speedSquared = this.body.vel.lengthSquared()
        const speed = this.body.vel.length()

        const dynPressure = 0.5 * density * speedSquared
        const liftMag = Math.min(Math.max(Cl * dynPressure * 120, -100000000), 100000000) 

        // lift vector
        const lift = (new Vec2(velUnit.y, -velUnit.x)).multiply(liftMag)
        this.body.addForce(lift)

        this.liftVec.update(lift)

        const Cd = 0.3 * Math.sin(AoA + this.flap + 0.1);
        const dragMag = Math.abs(Math.min(Cd * dynPressure * 120, 100000000)) 
        const drag = velUnit.multiply(-1 * dragMag)
        this.body.addForce(drag)
        this.dragVec.update(drag)

        if(this.settings.updateHUD){
            $("#thrust").html(Math.round(this.thrust))
            $("#speed").html(Math.round(speed)) // *1.944
            $("#vSpeed").html(Math.round(-this.body.vel.y));
            $("#density").html(Math.round(density * 1000)/1000);
            $("#altitude").html(Math.round(this.body.pos.x) + ", " + -Math.round(this.body.pos.y))
            $("#elevator").html(Math.round(this.flap * 100)/100)
            $("#lift").html(liftMag)
            $("#acc").html(this.body.acc.length())
        }
            
        // turn towards moving direction
        this.body.addTorque(AoA * speed * 0.1)

        this.body.addTorque(-this.flap * 5)


        // gravity
        this.body.addForce(new Vec2(0, 9.81 * this.body.mass))


        this.body.update(dt)
        
        // update graphics position/rotation
        this.sprite.position = this.body.pos;
        this.spriteImg.rotation = this.body.angle;

        function radToDeg(rad) {
            return rad * 180 / Math.PI
        }

        if (this.hasInstruments) {
            this.instruments.attitude.setPitch(radToDeg(-this.body.angle));
            // convert to 1000 ft/min
            const vSpeed = this.body.pos.y < -0.4 ? -this.body.vel.y / 5.08 : 0 

            this.instruments.variometer.setVario(vSpeed);

            

            this.instruments.airspeed.setAirSpeed(speed * 1.944);
            this.instruments.altimeter.setAltitude(altitude);
            this.instruments.altimeter.setPressure(atmos.pressure / 1000);
            let newHead = 0.3 * (Math.random() - 0.5)
            if (this.body.vel.x < 0) {
                newHead += 180
            }
            this.instruments.heading.setHeading(newHead);
        }
        
    }

    showVector(setting) {
        for (var i = 0; i < this.vectorList.length; i++) {
            this.vectorList[i].setVisibility(setting)
            this.vectorList[i].update()
        }
    }
}