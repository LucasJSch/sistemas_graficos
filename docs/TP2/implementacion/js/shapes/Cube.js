class Cube {
    // Draws a cube of unitary sides in the origin.
    constructor(glProgram, vColor) {
        this.cube = new ConvergedCube(glProgram, vColor, 1.0);
    }

    setTexture(texture) {
        this.cube.setTexture(texture);
    }

    draw(transformMatrix) {
        if (transformMatrix == null) {
            transformMatrix = mat4.create();
        }

        this.cube.draw(transformMatrix);
    }
}