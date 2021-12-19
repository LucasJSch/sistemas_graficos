class Planet {
    // Draws the planet.
    constructor(shader) {
        this.shader = shader;
        this.planet_color = [0.0, 0.0, 0.0];
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
