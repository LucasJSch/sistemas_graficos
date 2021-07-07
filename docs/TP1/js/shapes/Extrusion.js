class Extrusion {
    constructor(glProgram, levels, shapeGen, curveGen, curveLength) {
        this.glProgram = glProgram;
        this.levels = levels;
        this.shapeGen = shapeGen;
        this.curveGen = curveGen;
        this.curveLength = curveLength;
    }

    draw(transformMatrix) {
        if (transformMatrix == null) {
            transformMatrix = mat4.create();
        }

        var step = this.curveLength / this.levels;
        for (var level = 0; level < this.levels; level++) {
            var point = curveGen.getPoint(level * step);
            var normal = curveGen.getFirstDerivative(level * step);
            var shape = this.shape.copy();
            shape.draw(transformMatrix);
        }
    }
}