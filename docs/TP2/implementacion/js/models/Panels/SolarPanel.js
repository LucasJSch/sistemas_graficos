class SolarPanel {
    // Draws a single panel.
    constructor(shader) {
        this.shader = shader;
        this.plane_color = [0.0, 0.0, 0.0];
        this.cylinder_color = [0.0, 0.0, 0.0];
        this.cylinder = new Cylinder(shader, this.cylinder_color, /*pointsPerCircle=*/10);
        this.plane = new Cube(shader, this.plane_color);
    }

    setTexture(texture) {
        this.plane.setTexture(texture);
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
