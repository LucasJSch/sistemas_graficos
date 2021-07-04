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
        this.holder1.draw(this.holder1_transf);
    }

    createTransformationMatrices() {
        // Scaling matrices:
        var mainHolder_s = mat4.create();
        var holder1_s = mat4.create();

        // Rotation matrices:
        var mainHolder_r = mat4.create();

        // Translation matrices:
        var holder1_t = mat4.create();

        mat4.fromScaling(mainHolder_s,  [0.1, 0.1, 1.0]);
        mat4.fromScaling(holder1_s,  [0.1, 0.1, 1.0]);
        mat4.mul(holder1_s, holder1_s, mainHolder_s);
        mat4.fromTranslation(holder1_t, [0.0, 0.0, 0.0]);

        // Compute final results:
        this.mainHolder_transf = mainHolder_s;
        this.holder1_transf = holder1_s;
    }
}