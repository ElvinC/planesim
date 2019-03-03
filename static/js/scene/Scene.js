import Camera from "./Camera.js";

var Engine = Matter.Engine,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Svg = Matter.Svg

export default class Scene {
    constructor() {
        // object list
        this.physicalChildren = [];

        // physics variables
        this.engine = Engine.create();
        this.bodies = [];

        // PIXI setup
        this.renderer = new PIXI.autoDetectRenderer(1000, 500, {antialias: true});
        this.renderer.view.style.position = "absolute";
        this.renderer.view.style.display = "block";
        this.renderer.autoResize = true;
        this.renderer.resize(window.innerWidth, window.innerHeight);
        this.renderer.backgroundColor = 0x87CEEB;
        document.body.appendChild(this.renderer.view);

        var ground = Bodies.rectangle(0, 500, 100000, 50, {isStatic: true, restitution: 1, friction: 0});
        this.bodies.push(ground);
        World.add(this.engine.world, [ground]);

        $(window).resize(() => {
            var w = window.innerWidth;
            var h = window.innerHeight;
            this.renderer.view.style.width = w + "px";
            this.renderer.view.style.height = h + "px";
            this.renderer.resize(w, h);
            this.camera.update();
        })

        // keys down
        this.keys = {}
        var _this = this;
        $(window).keydown((e) => {
            _this.keys[e.which] = true
        })

        $(window).keyup((e) => {
            _this.keys[e.which] = false
        })


        this.stage = new PIXI.Container();

        this.camera = new Camera(this.renderer);

        window.cam = (this.camera)
        this.camera.addChild(this.stage)
        window.world = this.engine
    }

    addChild(child) {
        this.stage.addChild(child);
    }

    addPhysicalChild(child) {
        // add sprite
        this.physicalChildren.push(child)

        // add visual sprite
        this.stage.addChild(child.sprite);

        // add physical bodies
        this.bodies.push(child.body)

        World.add(this.engine.world, [child.body]);
    }

    run() {
        Engine.run(this.engine)
    }

    update() {
        for (var body in this.physicalChildren) {
            this.physicalChildren[body].update();
        }

    }

    render() {
        this.renderer.render(this.camera);
    }
} 