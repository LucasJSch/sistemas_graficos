class Coordinates {
    // Draws XYZ coordinates. (3 thin cylinders)
    constructor(shader) {
        this.shader = shader;
    }

    setTexture(texture) {
        this.texture = texture;
    }

    // vScaleFactor: vec3 with a scale for each coordinate axis.
    draw(transformMatrix, vScaleFactor) {
        if (transformMatrix == null) {
            transformMatrix = mat4.create();
        }

        if (vScaleFactor == null || vScaleFactor == [0.0, 0.0, 0.0]) {
            vScaleFactor = vec3.create();
            vec3.set(vScaleFactor, 1.0, 1.0, 1.0);
        }

        var x_coord = new Cylinder(this.shader, [1.0, 0.0, 0.0]);
        x_coord.setTexture(this.texture);
        var y_coord = new Cylinder(this.shader, [0.0, 1.0, 0.0]);
        y_coord.setTexture(this.texture);
        var z_coord = new Cylinder(this.shader, [0.0, 0.0, 1.0]);
        z_coord.setTexture(this.texture);

        // Create rotation transforms (each cylinder goes in a different axis).
        var transf_x_rotation = mat4.create();
        var transf_y_rotation = mat4.create();
        var transf_z_rotation = mat4.create();
        mat4.fromRotation(transf_x_rotation, Math.PI/2, [0.0, 1.0, 0.0]);
        mat4.fromRotation(transf_y_rotation, -Math.PI/2, [1.0, 0.0, 0.0]);

        // One transform for the custom passed by parameter, and one fixed by this class.
        var scaleTransform_x = mat4.create();
        var scaleTransform_y = mat4.create();
        var scaleTransform_z = mat4.create();
        // Generic scaling for each coordinate axis.
        var scaleTransform_generic = mat4.create();
        mat4.fromScaling(scaleTransform_generic, [0.05, 0.05, 1.0]);
        mat4.fromScaling(scaleTransform_x, [vScaleFactor[0], vScaleFactor[0], vScaleFactor[0]]);
        mat4.fromScaling(scaleTransform_y, [vScaleFactor[1], vScaleFactor[1], vScaleFactor[1]]);
        mat4.fromScaling(scaleTransform_z, [vScaleFactor[2], vScaleFactor[2], vScaleFactor[2]]);
        mat4.multiply(scaleTransform_x, scaleTransform_x, scaleTransform_generic);
        mat4.multiply(scaleTransform_y, scaleTransform_y, scaleTransform_generic);
        mat4.multiply(scaleTransform_z, scaleTransform_z, scaleTransform_generic);

        // Get final transformation matrices (scale, then rotate, then apply the outside matrix).
        var transf_x = mat4.create();
        var transf_y = mat4.create();
        var transf_z = mat4.create();
        mat4.multiply(transf_x, transformMatrix, transf_x_rotation);
        mat4.multiply(transf_x, transf_x, scaleTransform_x);
        mat4.multiply(transf_y, transformMatrix, transf_y_rotation);
        mat4.multiply(transf_y, transf_y, scaleTransform_y);
        mat4.multiply(transf_z, transformMatrix, transf_z_rotation);
        mat4.multiply(transf_z, transf_z, scaleTransform_z);
        

        x_coord.draw(transf_x);
        // y_coord.draw(transf_y);
        // z_coord.draw(transf_z);
    }
}