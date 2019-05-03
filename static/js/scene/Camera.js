/**
 * Class representing a camera with pan and zoom
 */
export default class Camera extends PIXI.Container {
    constructor(renderer, x = 0, y = 0, zoom = 1) {
        super();
        this.renderer = renderer;
        this.posx = x;
        this.posy = y;
        this.zoom = zoom;
        this.update();
    }

    /**
     * Set camera position
     * @param {Number} x The x position
     * @param {*} y The y position
     */
    setPos(x, y) {
        this.posx = x;
        this.posy = y;
        this.update();
    }

    /**
     * Set camera zoom
     * @param {Number} zoom Zoom amount
     */
    setZoom(zoom) {
        this.zoom = zoom;
        cam.scale.x = cam.scale.y = zoom;
        this.update()
    }

    /**
     * Update camera position
     */
    update() {
        this.x = this.zoom * this.posx + this.renderer.view.width / 2;
        this.y = this.zoom * this.posy + this.renderer.view.height / 2;
    }
}