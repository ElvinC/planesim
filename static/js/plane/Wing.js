export default class Wing {
    constructor(chord, span) {
        this.chord = chord;
        this.span = span;
    }

    wingArea() {
        return this.span * this.chord;
    }
}