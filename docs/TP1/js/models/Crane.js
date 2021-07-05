class Crane {
        // Draws a crane.
    constructor(glProgram) {
        this.yellowColor = [0.88, 0.8, 0.0275];
        this.grayColor = [0.48627451, 0.48627451, 0.48627451];
        this.metalColor = [0.450980392, 0.56640625, 0.690196078];
        this.firstBase = new Cube(glProgram, this.yellowColor);
        this.firstBase_transf = mat4.create();
        this.secondBase = new Cube(glProgram, this.yellowColor);
        this.secondBase_transf = mat4.create();
        this.cylinderBase = new Cylinder(glProgram, this.metalColor);
        this.cylinderBase_transf = mat4.create();
        this.craneBox = new CraneBox(glProgram, this.yellowColor, this.metalColor);
        this.craneBox_transf = mat4.create();
        this.long = new Cube(glProgram, this.yellowColor);
        this.long_transf = mat4.create();
        this.F_weight = new Cube(glProgram, this.grayColor);
        this.F_weight_transf = mat4.create();
        this.screw = new Cylinder(glProgram, this.metalColor);
        this.screw_transf = mat4.create();
        // TODO: Create special class for H
    }

    draw(transformMatrix) {
        if (transformMatrix == null) {
            transformMatrix = mat4.create();
        }

        this.createTransformationMatrices();
        this.firstBase.draw(this.firstBase_transf);
        this.secondBase.draw(this.secondBase_transf);
        this.cylinderBase.draw(this.cylinderBase_transf);
        this.craneBox.draw(this.craneBox_transf);
        this.long.draw(this.long_transf);
        // this.F_weight.draw(this.F_weight_transf);
    }

    createTransformationMatrices() {
        // Scaling matrices:
        var firstBase_s = mat4.create();
        var secondBase_s = mat4.create();
        var cylinderBase_s = mat4.create();
        var craneBox_s = mat4.create();
        var long_s = mat4.create();
        var F_weight_s = mat4.create();
        var screw_s = mat4.create();

        // Rotation matrices:
        var firstBase_r = mat4.create();
        var secondBase_r = mat4.create();
        var cylinderBase_r = mat4.create();
        var craneBox_r = mat4.create();
        var long_r = mat4.create();
        var F_weight_r = mat4.create();
        var screw_r = mat4.create();

        // Translation matrices:
        var firstBase_t = mat4.create();
        var secondBase_t = mat4.create();
        var cylinderBase_t = mat4.create();
        var craneBox_t = mat4.create();
        var long_t = mat4.create();
        var F_weight_t = mat4.create();
        var screw_t = mat4.create();

        // Description of actions for each body:
        // firstBase: Scale
        // secondBase: Scale, translate respect to firstBase.
        // cylinderBase: Scale, translate respect to secondBase.
        // craneBox: Scale, translate respect to cylinderBase.
        // long: Scale, rotate, translate respect to craneBox.
        // F_weight: Scale, rotate, translate respect to long.
        // screw: Scale, rotate, translate respect to long.
        // H: Scale, translate respect to screw.

        // Scaling.
        mat4.fromScaling(firstBase_s,  [1.0, 1.0, 5.0]);
        mat4.scale(secondBase_s, firstBase_s, [0.8, 0.8, 0.8]);
        mat4.scale(cylinderBase_s, secondBase_s, [0.4, 0.4, 0.8]);
        mat4.fromScaling(craneBox_s, [1.0, 1.2, 1.0]);
        mat4.fromScaling(long_s, [0.35, 15.0, 0.35]);
        // mat4.fromScaling(F_weight_s, [1.0, 1.0, 1.0]);
        // G_s = E_s;

        // Rotations.
        // mat4.fromRotation(E_r, Math.PI/2.0, [0.0, 1.0, 0.0]);
        // G_r = E_r;

        // Translations.
        mat4.fromTranslation(secondBase_t, [0.1, 0.1, 4.9]);
        mat4.fromTranslation(cylinderBase_t, [0.0, 0.0, 4.0]);
        mat4.mul(cylinderBase_t, secondBase_t, cylinderBase_t);
        mat4.fromTranslation(craneBox_t, [0.0, 0.0, 3.0]);
        mat4.mul(craneBox_t, cylinderBase_t, craneBox_t);
        mat4.fromTranslation(long_t, [0.0, 5.0, 1.2]);
        mat4.mul(long_t, craneBox_t, long_t);
        // mat4.fromTranslation(F_weight_t, [-0.2, -1.0, -0.2]);
        // mat4.mul(F_weight_t, long_t, F_weight_t);
        // mat4.fromTranslation(G_t, [0.0, 11.25, 0.0]);
        // mat4.mul(G_t, E_t, G_t);

        // Compute final results:
        this.firstBase_transf = firstBase_s;
        mat4.mul(this.secondBase_transf, secondBase_t, secondBase_r);
        mat4.mul(this.secondBase_transf, this.secondBase_transf, secondBase_s);
        mat4.mul(this.cylinderBase_transf, cylinderBase_t, cylinderBase_r);
        mat4.mul(this.cylinderBase_transf, this.cylinderBase_transf, cylinderBase_s);
        mat4.mul(this.craneBox_transf, craneBox_t, craneBox_r);
        mat4.mul(this.craneBox_transf, this.craneBox_transf, craneBox_s);
        mat4.mul(this.long_transf, long_t, long_r);
        mat4.mul(this.long_transf, this.long_transf, long_s);
        // mat4.mul(this.F_weight_transf, F_weight_t, F_weight_r);
        // mat4.mul(this.F_weight_transf, this.F_weight_transf, F_weight_s);
        // mat4.mul(this.G_transf, G_t, G_r);
        // mat4.mul(this.G_transf, this.G_transf, G_s);
    }
}