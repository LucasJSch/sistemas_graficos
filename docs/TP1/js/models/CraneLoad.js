class CraneLoad {
    // Draws a crane.
    constructor(glProgram, vThreadsColor, vBaseColor) {
        this.base = new Cube(glProgram, vBaseColor);
        this.base_transf = mat4.create();
        this.mainHolder = new Cylinder(glProgram, vThreadsColor);
        this.mainHolder_transf = mat4.create();
        this.holder1 = new Cylinder(glProgram, vThreadsColor);
        this.holder1_transf = mat4.create();
        this.holder2 = new Cylinder(glProgram, vThreadsColor);
        this.holder2_transf = mat4.create();
        this.holder3 = new Cylinder(glProgram, vThreadsColor);
        this.holder3_transf = mat4.create();
        this.holder4 = new Cylinder(glProgram, vThreadsColor);
        this.holder4_transf = mat4.create();
    }

    draw(transformMatrix) {
        if (transformMatrix == null) {
            transformMatrix = mat4.create();
        }

        this.createTransformationMatrices();
        this.mainHolder.draw(this.mainHolder_transf);
    }

    createTransformationMatrices() {
        // Scaling matrices:
        var mainHolder_s = mat4.create();

        // Rotation matrices:
        var mainHolder_r = mat4.create();

        // Translation matrices:
        var mainHolder_t = mat4.create();

        // Scaling.
        mat4.fromScaling(mainHolder_s,  [1.0, 1.0, 5.0]);

        // Rotations.

        // Translations.

        // Compute final results:
        this.mainHolder_transf = mainHolder_s;
    }
}