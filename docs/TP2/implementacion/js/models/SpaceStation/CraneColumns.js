class CraneColumns {
    constructor(glProgram, n_cyls) {
        this.glProgram = glProgram;
        this.utils = new Utils();

        // must be an int greater than 3.
        this.n_cyls = n_cyls;
        this.diff_rotation = Math.PI * 2.0 / this.n_cyls;
    }

    draw(transformMatrix) {
        if (transformMatrix == null) {
            transformMatrix = mat4.create();
        }

        for (var rotation = 0.0; rotation < Math.PI * 2.0 - 0.001; rotation += this.diff_rotation) {
            var col = new CraneColumn(glProgram);
            var t = mat4.create();
            mat4.fromRotation(t, rotation, [0.0, 1.0, 0.0]);
            mat4.mul(t, transformMatrix, t);
            col.draw(t);
        }
    }
}
