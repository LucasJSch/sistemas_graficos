class Nucleus {
    // Draws a the nucleus of the space station
    constructor(glProgram) {
        this.glProgram = glProgram;

        this.utils = new Utils();
        this.bezier_points_1 = 
    }

    draw(transformMatrix) {
        if (transformMatrix == null) {
            transformMatrix = mat4.create();
        }

        var cyl_1 = new NucleusCylinder(this.glProgram)
    }
}
