class CraneBox {
    // Draws a crane box.
    constructor(glProgram, vColor, screwColor) {
        // TODO: Add a class for a rectangel-pyramid and then add an instance of it here.
        // TODO: Add cranebox connection to the long thingy.
        this.mainCube = new Cube(glProgram, vColor);
        this.mainCube_transf = mat4.create();
        this.top = new Cube(glProgram, vColor);
        this.top_transf = mat4.create();
        this.bottom = new Cube(glProgram, vColor);
        this.bottom_transf = mat4.create();
        this.connection_l = new ConvergedCube(glProgram, vColor, 0.55);
        this.connection_l_transf = mat4.create();
        this.connection_r = new ConvergedCube(glProgram, vColor, 0.55);
        this.connection_r_transf = mat4.create();
        this.screw = new Cylinder(glProgram, screwColor);
        this.screw_transf = mat4.create();
    }

    draw(transformMatrix) {
        if (transformMatrix == null) {
            transformMatrix = mat4.create();
        }

        this.createTransformationMatrices(transformMatrix);
        this.mainCube.draw(this.mainCube_transf);
        this.top.draw(this.top_transf);
        this.bottom.draw(this.bottom_transf);
        this.connection_l.draw(this.connection_l_transf);
        this.connection_r.draw(this.connection_r_transf);
        this.screw.draw(this.screw_transf);
    }

    createTransformationMatrices(transformMatrix) {
        // Scaling matrices:
        var mainCube_s = mat4.create();
        var top_s = mat4.create();
        var bottom_s = mat4.create();
        var connection_l_s = mat4.create();
        var connection_r_s = mat4.create();
        var screw_s = mat4.create();

        // Rotation matrices:
        var top_r = mat4.create();
        var bottom_r = mat4.create();
        var connection_l_r = mat4.create();
        var connection_r_r = mat4.create();
        var screw_r = mat4.create();

        // Translation matrices:
        var top_t = mat4.create();
        var bottom_t = mat4.create();
        var connection_l_t = mat4.create();
        var connection_r_t = mat4.create();
        var screw_t = mat4.create();

        // Scaling.
        mat4.fromScaling(mainCube_s,  [1.0, 1.0, 1.0]);
        mat4.scale(top_s, mainCube_s, [1.0, 1.4, 0.05]);
        mat4.scale(bottom_s, mainCube_s, [1.0, 1.7, 0.3]);
        mat4.scale(connection_l_s, mainCube_s, [0.1, 0.4, 0.7]);
        mat4.scale(connection_r_s, mainCube_s, [0.1, 0.4, 0.7]);
        mat4.fromScaling(screw_s, [0.1, 0.1, 0.4]);

        // Rotations.
        mat4.fromRotation(screw_r, Math.PI/2.0, [0.0, 1.0, 0.0]);

        // Translations.
        mat4.fromTranslation(top_t, [0.0, 0.2, 0.98]);
        mat4.fromTranslation(bottom_t, [0.0, 0.35, 0.0]);
        mat4.fromTranslation(connection_l_t, [-0.15, 0.0, 1.0]);
        mat4.fromTranslation(connection_r_t, [+0.15, 0.0, 1.0]);
        mat4.fromTranslation(screw_t, [-0.2, 0.0, 1.5]);

        // Compute final results:
        this.mainCube_transf = mainCube_s;
        mat4.mul(this.top_transf, top_t, top_r);
        mat4.mul(this.top_transf, this.top_transf, top_s);
        mat4.mul(this.bottom_transf, bottom_t, bottom_r);
        mat4.mul(this.bottom_transf, this.bottom_transf, bottom_s);
        mat4.mul(this.connection_l_transf, connection_l_t, connection_l_r);
        mat4.mul(this.connection_l_transf, this.connection_l_transf, connection_l_s);
        mat4.mul(this.connection_r_transf, connection_r_t, connection_r_r);
        mat4.mul(this.connection_r_transf, this.connection_r_transf, connection_r_s);
        mat4.mul(this.screw_transf, screw_t, screw_r);
        mat4.mul(this.screw_transf, this.screw_transf, screw_s);

        // Apply transformMatrix
        mat4.mul(this.mainCube_transf,  transformMatrix, this.mainCube_transf);
        mat4.mul(this.top_transf, transformMatrix, this.top_transf);
        mat4.mul(this.bottom_transf, transformMatrix, this.bottom_transf);
        mat4.mul(this.connection_l_transf, transformMatrix, this.connection_l_transf);
        mat4.mul(this.connection_r_transf, transformMatrix, this.connection_r_transf);
        mat4.mul(this.screw_transf, transformMatrix, this.screw_transf);
    }
}