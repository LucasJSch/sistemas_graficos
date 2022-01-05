class SpaceStation {
    constructor(shader, n_sections, n_solar_panels, panels_angle, ring_rotation) {
        this.shader = shader;
        this.n_sections = n_sections;
        this.n_solar_panels = n_solar_panels;
        this.ring_rotation = ring_rotation;

        this.rectangles = new CircularRectangles(shader, this.n_sections);
        this.columns = new CraneColumns(shader, this.n_sections);
        this.cylinder = new CircularCylinder(shader);
        this.nucleus = new Nucleus(shader);
        this.panels = new Panels(shader, n_solar_panels, panels_angle);
        this.center_cylinder = new Cylinder(shader, [0.5, 0.5, 0.5])
    }

    setPanelsTexture(texture) {
        this.panels.setTexture(texture);
    }

    setModuloCilindricoTexture(texture) {
        this.nucleus.setTexture2(texture);
    }
    
    setModuloEsfericoTexture(texture) {
        this.nucleus.setTexture1(texture);
    }
    
    setMetalTexture(texture) {
        this.cylinder.setTexture(texture);
    }
    
    setModuloTexture(texture) {
        this.rectangles.setTexture(texture);
    }

    draw(transformMatrix) {
        if (transformMatrix == null) {
            transformMatrix = mat4.create();
        }

        var aux = mat4.create();

        var t_panels = mat4.create();
        mat4.fromRotation(t_panels, Math.PI / 2.0, [1.0, 0.0, 0.0]);
        mat4.fromTranslation(aux, [0.0, 9.0 + this.panels.getModelLength(this.n_solar_panels), 0.0]);
        mat4.mul(t_panels, aux, t_panels);
        mat4.mul(t_panels, transformMatrix, t_panels);

        var t = mat4.create();
        mat4.fromRotation(t, Math.PI / 2.0, [0.0, 0.0, 1.0]);
        mat4.fromTranslation(aux, [0.0, -7.0, 0.0]);
        mat4.mul(t, aux, t);
        mat4.mul(t, transformMatrix, t);
        gl.uniform1f(this.shader.getReflectionFactorPtr(), 0.1);
        this.nucleus.draw(t);

        var center_cyl_t = mat4.create();
        mat4.fromRotation(aux, Math.PI / 2.0, [1.0, 0.0, 0.0]);
        mat4.fromScaling(center_cyl_t, [1.75, 1.75, 0.5]);
        mat4.mul(center_cyl_t, aux, center_cyl_t);
        mat4.fromTranslation(aux, [0.0, 0.25, 0.0]);
        mat4.mul(center_cyl_t, aux, center_cyl_t);
        mat4.mul(center_cyl_t, transformMatrix, center_cyl_t);

        mat4.fromRotation(aux, this.ring_rotation, [0.0, 1.0, 0.0]);
        mat4.mul(aux, transformMatrix, aux);

        this.rectangles.draw(aux);
        this.columns.draw(aux);
        this.cylinder.draw(transformMatrix);
        this.panels.draw(t_panels);
        this.center_cylinder.draw(center_cyl_t);
        gl.uniform1f(this.shader.getReflectionFactorPtr(), 0.0);
    }
}