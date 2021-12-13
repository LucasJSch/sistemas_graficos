class Planet {
    // Draws the planet.
    constructor(shader) {
        this.shader = shader;
        this.planet_color = [0.282352941, 0.45490196078, 0.61176470588];
        this.n_rows = 20;
        this.n_cols = 20;
        this.sphere = new Sphere(shader, this.planet_color, this.n_rows, this.n_cols);
    }

    setTexture(texture) {
        this.sphere.setTexture(texture);
    }

    draw(transformMatrix) {
        if (transformMatrix == null) {
            transformMatrix = mat4.create();
        }
        this.sphere.draw(transformMatrix);
    }
}
