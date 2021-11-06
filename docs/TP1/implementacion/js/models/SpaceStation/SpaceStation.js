class SpaceStation {
    constructor(glProgram) {
        this.glProgram = glProgram;
        this.n_rectangles = 4.0;

        this.rectangles = new CircularRectangles(glProgram, this.n_rectangles);
        this.columns = new CraneColumns(glProgram, this.n_rectangles);
    }

    draw(transformMatrix) {
        if (transformMatrix == null) {
            transformMatrix = mat4.create();
        }

        // this.rectangles.draw(transformMatrix);
        this.columns.draw(transformMatrix);
    }
}