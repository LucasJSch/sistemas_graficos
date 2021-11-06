class CraneColumns {
    constructor(glProgram, n_cols) {
        this.glProgram = glProgram;
        this.utils = new Utils();

        // must be an int greater than 3.
        this.n_cyls = n_cols;
        this.diff_rotation = Math.PI * 2.0 / this.n_cyls;
        this.base_column = new CraneColumn(glProgram);
    }

    draw(transformMatrix) {
        if (transformMatrix == null) {
            transformMatrix = mat4.create();
        }

        for (var rotation = 0.0; rotation < Math.PI * 2.0; rotation += this.diff_rotation) {
            var t = mat4.create();
            mat4.fromRotation(t, rotation, [0.0, 1.0, 0.0]);
            mat4.mul(t, transformMatrix, t);
            this.base_column.draw(t);
        }
    }
}
