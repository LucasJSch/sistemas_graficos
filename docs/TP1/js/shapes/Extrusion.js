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
                // var startPos = vec3.create();
                // var endPos = vec3.create();
                // vec3.transformMat4(startPos, [0.0, 0.0, 0.0], t);
                // vec3.transformMat4(endPos, [0.0, 0.0, this.shapeGen.getHeight()], t);
                // mat4.mul(t, transformMatrix, t);
                // mat4.mul(t, t, pre_t);
                // extrusion.draw(t);
            } else {
                if (level == 1){
                // mat4.mul(t, transformMatrix, t);
                // mat4.mul(t, t, pre_t);
                this.drawShape(t);
                }
            }
        }
    }

    drawShape(transform) {
        var pos_buf = this.shapeGen.getPosBuffer([0.0, 0.0, 0.0]);
        var nrm_buf = this.shapeGen.getNormalBuffer([0.0, 0.0, 0.0]);
        var clr_buf = this.shapeGen.getColorBuffer([0.0, 0.0, 0.0]);

        var utils = new Utils();
        // var delete1 = mat4.create();
        // mat4.fromTranslation(delete1, [0.0, 0.0, 1.0]);
        pos_buf = utils.TransformPosBuffer(transform, pos_buf);

        var grid = new TriangleStrip(this.glProgram, pos_buf, nrm_buf, clr_buf);
        grid.draw();
    }
}