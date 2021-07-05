class Cube {
    // Draws a cube of unitary sides in the origin.
    // TODO: Do this more elegantly with a LinearExtrusion.
    constructor(glProgram, vColor) {
        this.cube = new ConvergedCube(glProgram, vColor, 1.0);
    }

    draw(transformMatrix) {
        if (transformMatrix == null) {
            transformMatrix = mat4.create();
        }

        this.cube.draw(transformMatrix);
    }
}