class Panels {
    // Draws the solar panels.
    // Must have at least 4 panels per side.
    constructor(shader, n_solar_panels, angle_panels) {
        this.shader = shader;
        this.cylinder_color = [0.794117647, 0.7, 0.809803922];
        this.n_panels_per_side = n_solar_panels;
        this.panel_dist = 1.5;
        // this.cylinder_length = 8.0 + (this.n_panels_per_side - 4.0) * this.panel_dist;
        this.cylinder_length = this.getModelLength(this.n_panels_per_side);
        this.cylinder = new Cylinder(shader, this.cylinder_color);
        this.panel_rotation_rad = angle_panels;
    }

    getModelLength(n_panels_per_side) {
        return 8.0 + (n_panels_per_side - 4.0) * this.panel_dist;
    }

    draw(transformMatrix) {
        if (transformMatrix == null) {
            transformMatrix = mat4.create();
        }

        var t_cylinder = mat4.create();
        mat4.fromScaling(t_cylinder, [0.15, 0.15,  this.cylinder_length]);
        mat4.mul(t_cylinder, transformMatrix, t_cylinder);
        this.cylinder.draw(t_cylinder);

        for (var i = 0; i < this.n_panels_per_side; i++) {
            this.drawSolarPanel(transformMatrix, i, false);
            this.drawSolarPanel(transformMatrix, i, true);
        }
    }

    // number: int that says which number of panel it is
    // left: boolean that decides to draw on left or right
    drawSolarPanel(transformMatrix, number, left) {
        const init_dist = 0.2;

        var aux = mat4.create();
        var t_solar_panel = mat4.create();

        mat4.fromRotation(aux, this.panel_rotation_rad, [1.0, 0.0, 0.0]);
        if (left) {
            mat4.fromRotation(t_solar_panel, -Math.PI/2.0, [0.0, 1.0, 0.0]);
            mat4.mul(t_solar_panel, aux, t_solar_panel);
        } else {
            mat4.fromRotation(t_solar_panel, +Math.PI/2.0, [0.0, 1.0, 0.0]);
            mat4.mul(t_solar_panel, aux, t_solar_panel);
        }
        
        mat4.fromTranslation(aux, [0.0, 0.0, init_dist + this.panel_dist * number]);
        mat4.mul(t_solar_panel, aux, t_solar_panel);
        mat4.mul(t_solar_panel, transformMatrix, t_solar_panel);
        var solarPanel = new SolarPanel(this.shader);
        solarPanel.draw(t_solar_panel);
    }
}
