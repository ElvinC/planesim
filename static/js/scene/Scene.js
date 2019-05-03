import Camera from "./Camera.js";

/**
 * A scene containing physical objects and graphics
 */
export default class Scene {
    /**
     * Create scene
     */
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

        // Keep track of the pressed keys
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

    /**
     * Add a new graphical object to scene
     * @param {PIXI.Container} child PIXI sprite or object
     */
    addChild(child) {
        // add graphics only
        this.stage.addChild(child);
    }

    /**
     * Add object with physical and graphical parameters from the custom physics engine.
     * @param {Object} child Object with physics and graphics
     */
    addCustomPhysicalChild(child) {
        // add physical object with graphics and physics
        this.stage.addChild(child.sprite);
        this.customPhysicalChildren.push(child)
    }

    /**
     * Update all the custom physical children contained in the scene
     * @param {Number} dt Timestep
     */
    update(dt) {
        // update physics
        for (var body in this.customPhysicalChildren) {
            this.customPhysicalChildren[body].update(dt);
        }

    }

    /**
     * Render the scene using the current camera
     */
    render() {
        this.renderer.render(this.camera);
    }
} 