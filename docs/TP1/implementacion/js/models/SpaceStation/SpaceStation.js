class SpaceStation {
    constructor(glProgram) {
        this.glProgram = glProgram;
        this.n_sections = 5.0;

        this.rectangles = new CircularRectangles(glProgram, this.n_sections);
        this.columns = new CraneColumns(glProgram, this.n_sections);
        this.cylinder = new CircularCylinder(glProgram);
        this.nucleus = new Nucleus(glProgram);
    }

    draw(transformMatrix) {
        if (transformMatrix == null) {
            transformMatrix = mat4.create();
        }

        
        var t = mat4.create();
        var aux = mat4.create();
        mat4.fromRotation(t, Math.PI / 2.0, [0.0, 0.0, 1.0]);
        mat4.fromTranslation(aux, [0.0, -7.0, 0.0]);
        mat4.mul(t, aux, t);
        mat4.mul(t, transformMatrix, t);
        this.nucleus.draw(t);
        this.rectangles.draw(transformMatrix);
        this.columns.draw(transformMatrix);
        this.cylinder.draw(transformMatrix);
    }
}