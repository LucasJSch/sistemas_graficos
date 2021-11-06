class SpaceStation {
    constructor(glProgram) {
        this.glProgram = glProgram;
        this.n_sections = 5.0;

        this.rectangles = new CircularRectangles(glProgram, this.n_sections);
        this.columns = new CraneColumns(glProgram, this.n_sections);
        this.cylinder = new CircularCylinder(glProgram);
        this.nucleus = new Nucleus(glProgram);
        this.panels = new Panels(glProgram);
    }

    draw(transformMatrix) {
        if (transformMatrix == null) {
            transformMatrix = mat4.create();
        }

        var aux = mat4.create();

        var t_panels = mat4.create();
        mat4.fromRotation(t_panels, Math.PI / 2.0, [1.0, 0.0, 0.0]);
        mat4.fromTranslation(aux, [0.0, 17.0, 0.0]);
        mat4.mul(t_panels, aux, t_panels);
        mat4.mul(t_panels, transformMatrix, t_panels);

        var t = mat4.create();
        mat4.fromRotation(t, Math.PI / 2.0, [0.0, 0.0, 1.0]);
        mat4.fromTranslation(aux, [0.0, -7.0, 0.0]);
        mat4.mul(t, aux, t);
        mat4.mul(t, transformMatrix, t);
        this.nucleus.draw(t);

        this.rectangles.draw(transformMatrix);
        this.columns.draw(transformMatrix);
        this.cylinder.draw(transformMatrix);
        this.panels.draw(t_panels);
    }
}