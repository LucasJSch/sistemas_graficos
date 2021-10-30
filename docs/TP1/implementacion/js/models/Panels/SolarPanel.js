class SolarPanel {
    // Draws a single panel.
    constructor(glProgram) {
        this.glProgram = glProgram;
        this.plane_color = [0.823529412, 0.662745098, 0.53333333];
        this.cylinder_color = [0.873529412, 0.712745098, 0.58333333];
        this.cylinder = new Cylinder(glProgram, this.cylinder_color);
        this.plane = new Cube(glProgram, this.plane_color);

        this.utils = new Utils();
    }

    draw(transformMatrix) {
        if (transformMatrix == null) {
            transformMatrix = mat4.create();
        }

        var t_cylinder = mat4.create();
        mat4.fromScaling(t_cylinder, [0.1, 0.1, 5.0]);
        mat4.mul(t_cylinder, transformMatrix, t_cylinder);
        this.cylinder.draw(t_cylinder);

        var aux = mat4.create();
        var t_plane = mat4.create();

        mat4.fromScaling(t_plane, [1.0, 4.0, 0.2]);
        mat4.fromRotation(aux, -Math.PI/2.0, [1.0, 0.0, 0.0]);
        mat4.mul(t_plane, aux, t_plane);

        mat4.fromTranslation(aux, [0.0, 0.1, 0.0]);
        mat4.mul(t_plane, aux, t_plane);
        
        mat4.fromTranslation(aux, [0.0, 0.0, 3.0]);
        mat4.mul(t_plane, aux, t_plane);

        mat4.mul(t_plane, transformMatrix, t_plane);

        this.plane.draw(t_plane);
    }
}
