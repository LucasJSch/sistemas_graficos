class Panels {
    // Draws the solar panels.
    constructor(glProgram) {
        this.glProgram = glProgram;
        this.cylinder_color = [0.794117647, 0.7, 0.809803922];
        this.n_panels_per_side = 4.0; 
        this.cylinder = new Cylinder(glProgram, this.cylinder_color);

        this.utils = new Utils();
    }

    draw(transformMatrix) {
        if (transformMatrix == null) {
            transformMatrix = mat4.create();
        }

        // var t_cylinder = mat4.create();
        // mat4.fromScaling(t_cylinder, [0.2, 0.2, 5.0]);
        // mat4.mul(t_cylinder, transformMatrix, t_cylinder);
        // this.cylinder.draw(t_cylinder);
        var solarPanel = new SolarPanel(this.glProgram);
        solarPanel.draw(transformMatrix);
    }
}
