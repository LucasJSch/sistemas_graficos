class Cube {
    // Draws a cube of unitary sides in the origin.
    // TODO: Do this more elegantly with a LinearExtrusion.
    constructor(glProgram, vColor) {
        this.glProgram = glProgram;
        this.vColor = vColor;
        this.side_length = 1.0;
    }

    draw(transformMatrix) {
        // TODO: Apply transformation matrix to pos.
        if (transformMatrix == null) {
            transformMatrix = mat4.create();
        }

        this.createAndDrawPlanes(transformMatrix);
    }

    createAndDrawPlanes(transformMatrix) {
        this.sides = [];
        var aux = mat4.create();
        var plane_xy =  new Plane(this.glProgram, this.vColor);
        var plane_xy2 = new Plane(this.glProgram, this.vColor);
        var plane_xz =  new Plane(this.glProgram, this.vColor);
        var plane_xz2 = new Plane(this.glProgram, this.vColor);
        var plane_yz =  new Plane(this.glProgram, this.vColor);
        var plane_yz2 = new Plane(this.glProgram, this.vColor);

        var plane_xy2_transform = transformMatrix;

        var plane_xy2_transform = mat4.create();
        mat4.fromTranslation(plane_xy2_transform, [0.0, 0.0, 0.975]);
        mat4.mul(plane_xy2_transform, transformMatrix, plane_xy2_transform);

        var plane_xz_transform  = mat4.create();
        mat4.fromRotation(plane_xz_transform, -Math.PI/2.0, [0.0, 1.0, 0.0]);
        mat4.mul(plane_xz_transform, transformMatrix, plane_xz_transform);

        var plane_xz2_transform = mat4.create();
        mat4.fromRotation(plane_xz2_transform, -Math.PI/2.0, [0.0, 1.0, 0.0]);
        mat4.mul(plane_xz2_transform, plane_xz2_transform, mat4.fromTranslation(aux, [0.0, 0.0, -0.975]));
        mat4.mul(plane_xz2_transform, transformMatrix, plane_xz2_transform);

        var plane_yz_transform  = mat4.create();
        mat4.fromRotation(plane_yz_transform, Math.PI/2.0, [1.0, 0.0, 0.0]);
        mat4.mul(plane_yz_transform, transformMatrix, plane_yz_transform);

        var plane_yz2_transform = mat4.create();
        mat4.fromRotation(plane_yz2_transform, Math.PI/2.0, [1.0, 0.0, 0.0]);
        mat4.mul(plane_yz2_transform, plane_yz2_transform, mat4.fromTranslation(aux, [0.0, 0.0, -0.975]));
        mat4.mul(plane_yz2_transform, transformMatrix, plane_yz2_transform);

        plane_xy.draw(plane_xy2_transform);
        plane_xy2.draw(plane_xy2_transform);
        plane_xz.draw(plane_xz_transform);
        plane_xz2.draw(plane_xz2_transform);
        plane_yz.draw(plane_yz_transform);
        plane_yz2.draw(plane_yz2_transform);

    }
}