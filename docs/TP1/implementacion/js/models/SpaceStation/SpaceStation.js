class SpaceStation {
    constructor(glProgram) {
        this.glProgram = glProgram;
        this.n_sections = 9.0;

        this.rectangles = new CircularRectangles(glProgram, this.n_sections);
        this.columns = new CraneColumns(glProgram, this.n_sections);
    }

    draw(transformMatrix) {
        if (transformMatrix == null) {
            transformMatrix = mat4.create();
        }

        this.rectangles.draw(transformMatrix);
        this.columns.draw(transformMatrix);
    }
}