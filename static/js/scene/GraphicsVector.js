export default class GraphicsVector extends PIXI.Graphics {
    constructor(vec, scaling = 1, color=0xff0000) {
        super();
        this.scaling = scaling;
        this.color = color;
        this.lineStyle(0.2, this.color, 1);

        this.moveTo(0, 0)
        this.lineTo(vec.x * this.scaling, vec.y * this.scaling)
    }

    update(vec) {
        this.clear()
        this.lineStyle(0.2, this.color, 1)
        this.moveTo(0, 0);
        this.lineTo(vec.x * this.scaling, vec.y * this.scaling)
    }
}