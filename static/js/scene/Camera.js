export default class Camera extends PIXI.Container {
    constructor(renderer, x = 0, y = 0, zoom = 1) {
        super();
        this.renderer = renderer;
        this.posx = x;
        this.posy = y;
        this.zoom = zoom;
        this.update();
    }

    setPos(x, y) {
        this.posx = x;
        this.posy = y;
        this.update();
    }

    setZoom(zoom) {
        this.zoom = zoom;
        cam.scale.x = cam.scale.y = zoom;
        this.update()
    }

    update() {
        this.x = this.zoom * this.posx + this.renderer.view.width / 2;
        this.y = this.zoom * this.posy + this.renderer.view.height / 2;
    }
}