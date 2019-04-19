export default class GraphicsVector extends PIXI.Graphics {
    constructor(vec, scaling = 1, color=0xff0000) {
        super();
        this.scaling = scaling;
        this.color = color;
        this.show = true;
        this.lineStyle(0.2, this.color, 1);
        this.vector = vec

        this.moveTo(0, 0)
        this.lineTo(vec.x * this.scaling, vec.y * this.scaling)
    }

    show() {
        this.show = true;
    }

    hide() {
        this.show = false;
    }

    setVisibility(setting) {
        this.show = setting
    }

    update(vec) {
        this.clear()

        if (vec) {
            this.vector = vec
        }

        if (this.show){
            this.lineStyle(0.2, this.color, 1)
            this.moveTo(0, 0);
            this.lineTo(this.vector.x * this.scaling, this.vector.y * this.scaling)
        }
    }
}