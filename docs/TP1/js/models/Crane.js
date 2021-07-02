class Crane {
        // Draws a crane.
    constructor(glProgram) {
        this.glProgram = glProgram;
        this.yellowColor = [0.88, 0.8, 0.0275];
        this.grayColor = [0.48627451, 0.48627451, 0.48627451];
        this.metalColor = [0.450980392, 0.56640625, 0.690196078];
        this.A = new Cube(this.glProgram, this.yellowColor);
        this.A_transf = mat4.create();
        this.B = new Cube(this.glProgram, this.yellowColor);
        this.B_transf = mat4.create();
        this.C = new Cylinder(this.glProgram, this.metalColor);
        this.C_transf = mat4.create();
        // TODO: Create special class for D
        this.D = new Cube(this.glProgram, this.yellowColor);
        this.D_transf = mat4.create();
        this.E = new Cylinder(this.glProgram, this.grayColor);
        this.E_transf = mat4.create();
        this.F_long = new Cube(this.glProgram, this.yellowColor);
        this.F_long_transf = mat4.create();
        this.F_weight = new Cube(this.glProgram, this.grayColor);
        this.F_weight_transf = mat4.create();
        this.G = new Cylinder(this.glProgram, this.grayColor);
        this.G_transf = mat4.create();
        // TODO: Create special class for H
    }

    draw(transformMatrix) {
        this.createTransformationMatrices();
        this.A.draw(this.A_transf);
        this.B.draw(this.B_transf);
        this.C.draw(this.C_transf);
        this.D.draw(this.D_transf);
        // this.E.draw(this.E_transf);
    }

    createTransformationMatrices() {
        // Scaling matrices:
        var A_s = mat4.create();
        var B_s = mat4.create();
        var C_s = mat4.create();
        var D_s = mat4.create();
        var E_s = mat4.create();
        var F_long_s = mat4.create();
        var F_weight_s = mat4.create();
        var G_s = mat4.create();

        // Rotation matrices:
        var A_r = mat4.create();
        var B_r = mat4.create();
        var C_r = mat4.create();
        var D_r = mat4.create();
        var E_r = mat4.create();
        var F_long_r = mat4.create();
        var F_weight_r = mat4.create();
        var G_r = mat4.create();

        // Translation matrices:
        var A_t = mat4.create();
        var B_t = mat4.create();
        var C_t = mat4.create();
        var D_t = mat4.create();
        var E_t = mat4.create();
        var F_long_t = mat4.create();
        var F_weight_t = mat4.create();
        var G_t = mat4.create();

        // Description of actions for each body:
        // A: Scale
        // B: Scale, translate respect to A.
        // C: Scale, translate respect to B.
        // D: Scale, translate respect to C.
        // E: Scale, rotate, translate respect to D.
        // F_long: Scale, rotate, translate respect to E.
        // F_weight: Scale, rotate, translate respect to F_long.
        // G: Scale, rotate, translate respect to F_long.
        // H: Scale, translate respect to G.

        // Scaling.
        mat4.fromScaling(A_s,  [1.0, 1.0, 5.0]);
        mat4.scale(B_s, A_s, [0.8, 0.8, 0.8]);
        mat4.scale(C_s, B_s, [0.4, 0.4, 0.8]);
        mat4.fromScaling(D_s, [1.3, 1.2, 1.0]);

        // Rotations.
        mat4.fromRotation(D_r, Math.PI/2.0, [0.0, 1.0, 0.0]);

        // Translations.
        mat4.fromTranslation(B_t, [0.1, 0.1, 4.9]);
        mat4.fromTranslation(C_t, [0.4, 0.4, 4.0]);
        mat4.mul(C_t, B_t, C_t);
        mat4.fromTranslation(D_t, [-0.5, -0.5, 4.3]);
        mat4.mul(D_t, C_t, D_t);
        // mat4.fromRotation(aux, Math.PI/2.0, [1.0, 0.0, 0.0]);
        // mat4.multiply(this.D_transf, aux, this.D_transf);
        // mat4.scale(this.D_transf, this.C_transf, [0.4, 0.4, 0.8]);
        // mat4.fromTranslation(aux, [0.4, 0.4, 3.5]);
        // mat4.multiply(this.D_transf, aux, this.D_transf);

        // Compute final results:
        this.A_transf = A_s;
        mat4.mul(this.B_transf, B_t, B_r);
        mat4.mul(this.B_transf, this.B_transf, B_s);
        mat4.mul(this.C_transf, C_t, C_r);
        mat4.mul(this.C_transf, this.C_transf, C_s);
        mat4.mul(this.D_transf, D_t, D_r);
        mat4.mul(this.D_transf, this.D_transf, D_s);
        
    }
}