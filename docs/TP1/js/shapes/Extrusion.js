class Extrusion {
    // enableFillings fills the corner vertices between each level.
    // I.e. it makes the a big unique surface.
    // If you disable it, you'll see discrete shapes. 
    // Curvegen must be a BezierConcatenator or a BsplineConcatenator.
    constructor(glProgram, levels, shapeGen, curveGen, enableFillings=false) {
        this.glProgram = glProgram;
        this.levels = levels;
        this.shapeGen = shapeGen;
        this.curveGen = curveGen;
        this.enableFillings = enableFillings;
    }

    draw(transformMatrix) {
        if (transformMatrix == null) {
            transformMatrix = mat4.create();
        }

        var step = this.curveGen.getNumberOfCurves() / this.levels;
        for (var level = 0; level < this.levels; level++) {
            var point = this.curveGen.getPoint(level * step);
            var normal = this.curveGen.getFirstDerivative(level * step);
            var t = this.shapeGen.getTransformMatrix(normal, point);
            var pre_t = this.shapeGen.getPreTransformMatrix();
            if (this.enableFillings) {
                var startPos = vec3.create();
                var endPos = vec3.create();
                vec3.transformMat4(startPos, [0.0, 0.0, 0.0], t);
                vec3.transformMat4(endPos, [0.0, 0.0, this.shapeGen.getHeight()], t);
                mat4.mul(t, transformMatrix, t);
                mat4.mul(t, t, pre_t);
                extrusion.draw(t);
            } else {
                var shape = this.shapeGen.getShape();
                mat4.mul(t, transformMatrix, t);
                mat4.mul(t, t, pre_t);
                shape.draw(t);
            }
        }
    }
}