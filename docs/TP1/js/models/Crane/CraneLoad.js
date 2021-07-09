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

        this.length_offset = 0.0;
    }

    draw(transformMatrix) {
        if (transformMatrix == null) {
            transformMatrix = mat4.create();
        }

        this.createTransformationMatrices(transformMatrix);
        this.mainHolder.draw(this.mainHolder_transf);
        this.holder1.draw(this.holder1_transf);
        this.holder2.draw(this.holder2_transf);
        this.holder3.draw(this.holder3_transf);
        this.holder4.draw(this.holder4_transf);
        this.base.draw(this.base_transf);
    }

    elevate() {
        if (this.length_offset > 0) {
            this.length_offset -= 0.1;
        }
    }

    lower() {
        if (this.length_offset < 2.0) {
            this.length_offset += 0.1;
        }
    }
    
    createTransformationMatrices(transformMatrix) {
        var aux = mat4.create();
        
        // Scaling matrices:
        var mainHolder_s = mat4.create();
        mat4.fromScaling(mainHolder_s,  [0.01, 0.01, 3.0 + this.length_offset]);
        var secondary_holders_s = mat4.create();
        mat4.fromScaling(secondary_holders_s,  [0.01, 0.01, 2.0]);
        
        // Translation matrices:
        var mainHolder_t = mat4.create();
        mat4.fromTranslation(mainHolder_t, [0.0, 0.0, -this.length_offset]);
        mat4.mul(this.mainHolder_transf, mainHolder_t, mainHolder_s);
        var secondary_holders_t = mat4.create();
        mat4.fromTranslation(secondary_holders_t, [0.0, 0.0, -1.0]);
        // mat4.mul(secondary_holders_t, secondary_holders_t, mainHolder_t);
        
        // Secondary holders are distinguished from one another by their rotations.
        // They have the same translation and scaling.
        mat4.mul(this.holder1_transf, secondary_holders_s, secondary_holders_t);
        mat4.mul(this.holder2_transf, secondary_holders_s, secondary_holders_t);
        mat4.mul(this.holder3_transf, secondary_holders_s, secondary_holders_t);
        mat4.mul(this.holder4_transf, secondary_holders_s, secondary_holders_t);
        
        mat4.fromRotation(aux, Math.PI/5.0, [1.0, 0.0, 0.0]);
        mat4.mul(this.holder1_transf, aux, this.holder1_transf);
        mat4.fromRotation(aux, Math.PI/3.0, [0.0, 1.0, 0.0]);
        mat4.mul(this.holder1_transf, aux, this.holder1_transf);

        mat4.fromRotation(aux, Math.PI/2, [0.0, 0.0, 1.0]);
        mat4.mul(this.holder2_transf, aux, this.holder1_transf);
        mat4.mul(this.holder3_transf, aux, this.holder2_transf);
        mat4.mul(this.holder4_transf, aux, this.holder3_transf);

        mat4.mul(this.holder1_transf, mainHolder_t, this.holder1_transf);
        mat4.mul(this.holder2_transf, mainHolder_t, this.holder2_transf);
        mat4.mul(this.holder3_transf, mainHolder_t, this.holder3_transf);
        mat4.mul(this.holder4_transf, mainHolder_t, this.holder4_transf);

        mat4.fromScaling(aux, [2.8, 2.8, 0.1]);
        mat4.fromTranslation(this.base_transf, [0.0, 0.0, -0.90 - this.length_offset]);
        mat4.mul(this.base_transf, this.base_transf, aux);
        mat4.fromRotation(aux, 0.1, [0.0, 0.0, 1.0], [1.0, 0.0, 0.0]);
        mat4.mul(this.base_transf, aux, this.base_transf);

        // Apply transformMatrix.
        mat4.mul(this.base_transf, transformMatrix, this.base_transf);
        mat4.mul(this.holder1_transf, transformMatrix, this.holder1_transf);
        mat4.mul(this.holder2_transf, transformMatrix, this.holder2_transf);
        mat4.mul(this.holder3_transf, transformMatrix, this.holder3_transf);
        mat4.mul(this.holder4_transf, transformMatrix, this.holder4_transf);
        mat4.mul(this.mainHolder_transf, transformMatrix, this.mainHolder_transf);
    }
}