class Nucleus {
    // Draws a the nucleus of the space station
    constructor(glProgram) {
        this.glProgram = glProgram;

        this.utils = new Utils();
    }

    draw(transformMatrix) {
        if (transformMatrix == null) {
            transformMatrix = mat4.create();
        }
    }
}
