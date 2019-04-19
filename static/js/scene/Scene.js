import Camera from "./Camera.js";

export default class Scene {
    constructor() {
        // object list
        this.customPhysicalChildren = [];


        // PIXI setup
        this.renderer = new PIXI.autoDetectRenderer(1000, 500, {antialias: true});
        this.renderer.view.style.position = "absolute";
        this.renderer.view.style.display = "block";
        this.renderer.autoResize = true;
        this.renderer.resize(window.innerWidth, window.innerHeight);
        this.renderer.backgroundColor = 0x87CEEB;
        window.renderer = this.renderer
        document.body.appendChild(this.renderer.view);

        $(window).resize(() => {
            var w = window.innerWidth;
            var h = window.innerHeight;
            this.renderer.view.style.width = w + "px";
            this.renderer.view.style.height = h + "px";
            this.renderer.resize(w, h);
            this.camera.update();
        })

        // Keep tract of the pressed keys
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
        this.camera.setZoom(8)
        this.camera.addChild(this.stage)
    }

    addChild(child) {
        // add graphics only
        this.stage.addChild(child);
    }


    addCustomPhysicalChild(child) {
        // add physical object with graphics and physics
        this.stage.addChild(child.sprite);
        this.customPhysicalChildren.push(child)
    }

    update(dt) {
        // update physics
        for (var body in this.customPhysicalChildren) {
            this.customPhysicalChildren[body].update(dt);
        }

    }

    render() {
        this.renderer.render(this.camera);
    }
} 