export default class GraphicsVector extends PIXI.Graphics {
    constructor(vec, scaling = 1) {
        super();
        this.scaling = scaling;
        this.lineStyle(0.2, 0xff0000, 1);

        this.moveTo(0, 0)
        this.lineTo(vec.x * this.scaling, vec.y * this.scaling)
    }

    update(vec) {
        this.clear()
        this.lineStyle(0.2, 0xff0000, 1)
        this.moveTo(0, 0);
        this.lineTo(vec.x * this.scaling, vec.y * this.scaling)
    }
}