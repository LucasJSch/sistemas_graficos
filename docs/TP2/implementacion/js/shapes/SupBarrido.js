class SupBarrido {
    constructor(glProgram, levels, shapeGen, curveGen) {
        this.glProgram = glProgram;
        this.levels = levels;
        this.n_cols = null;
        this.shapeGen = shapeGen;
        this.curveGen = curveGen;
        this.position_buffer = [];
        this.normal_buffer = [];
        this.color_buffer = [];

        this.utils = new Utils();
    }

    draw(transformMatrix) {
        if (transformMatrix == null) {
            transformMatrix = mat4.create();
        }

        var step = this.curveGen.getNumberOfCurves() / this.levels;
        for (var level = 0; level < this.levels; level++) {
            var point = this.curveGen.getPoint(level * step);
            var normal = this.curveGen.getFirstDerivative(level * step);
            var buffers = this.generateBuffersForPositionAndNormal(point, normal, transformMatrix);
            this.n_cols = (buffers[0].length/3);
            this.position_buffer = this.position_buffer.concat(buffers[0]);
            this.normal_buffer = this.normal_buffer.concat(buffers[1]);
            this.color_buffer = this.color_buffer.concat(buffers[2]);
        }

        var grid = new Grid(this.glProgram, this.position_buffer, this.normal_buffer, this.color_buffer, this.levels, this.n_cols);
        grid.draw();
    }

    generateBuffersForPositionAndNormal(position, normal, transformMatrix) {
        var pos_buffer = this.shapeGen.getPositionBuffer([0.0, 0.0, 0.0]);
        var normal_buffer = this.shapeGen.getNormalBuffer([0.0, 0.0, 0.0]);
        var color_buffer = this.shapeGen.getColorBuffer([0.0, 0.0, 0.0]);

        var t = mat4.create();
        mat4.targetTo(t, [0.0, 0.0, 0.0], normal, [0.0, 0.0, 1.0]);
        var aux = mat4.create();
        mat4.fromTranslation(aux, position);
        mat4.mul(t, aux, t);
        mat4.mul(t, transformMatrix, t);

        pos_buffer = this.utils.TransformPosBuffer(t, pos_buffer)

        return [pos_buffer, normal_buffer, color_buffer];
    }
}