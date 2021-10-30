class Planet {
    // Draws the planet.
    constructor(glProgram) {
        this.glProgram = glProgram;
        this.planet_color = [0.282352941, 0.45490196078, 0.61176470588];
        this.n_rows = 100;
        this.n_cols = 100;
        this.sphere = new Sphere(glProgram, this.planet_color, this.n_rows, this.n_cols);
    }

    draw(transformMatrix) {
        if (transformMatrix == null) {
            transformMatrix = mat4.create();
        }
        this.sphere.draw(transformMatrix);
    }
}
