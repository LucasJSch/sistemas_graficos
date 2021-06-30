class Cube {
    // Draws a cube of unitary sides in the origin.
    constructor(glProgram, vColor) {
        this.glProgram = glProgram;
        this.vColor = vColor;
        this.side_length = 1.0;
        this.n_rows_per_side = 100;
        this.n_cols_per_side = 100;
        // Array of sides.
        this.sides = null;
    }

    draw(transformMatrix) {
        // TODO: Apply transformation matrix to pos.
        if (transformMatrix == null) {
            transformMatrix = mat4.create();
        }

        this.createPlanes();
        this.drawPlanes();
    }

    createPlanes() {
        this.sides = [];
        var plane_xy =  new Plane(this.glProgram, [0.0, 0.0, 0.0], [1.0, 1.0, 0.0], [0.0, 0.0, 0.0], this.vColor, this.n_rows_per_side, this.n_cols_per_side);
        var plane_xy2 = new Plane(this.glProgram, [0.0, 0.0, 1.0], [1.0, 1.0, 1.0], [1.0, 1.0, 0.0], this.vColor, this.n_rows_per_side, this.n_cols_per_side);
        // var plane_xz =  new Plane(this.glProgram, [0.0, 0.0, 0.0], [1.0, 0.0, 1.0], [0.0, 1.0, 0.0], this.vColor, this.n_rows_per_side, this.n_cols_per_side);
        // var plane_xz2 = new Plane(this.glProgram, [0.0, 1.0, 0.0], [1.0, 1.0, 1.0], [0.0, 1.0, 0.0], this.vColor, this.n_rows_per_side, this.n_cols_per_side);
        // var plane_yz =  new Plane(this.glProgram, [0.0, 0.0, 0.0], [0.0, 1.0, 1.0], [1.0, 0.0, 0.0], this.vColor, this.n_rows_per_side, this.n_cols_per_side);
        // var plane_yz2 = new Plane(this.glProgram, [1.0, 0.0, 0.0], [1.0, 1.0, 1.0], [1.0, 0.0, 0.0], this.vColor, this.n_rows_per_side, this.n_cols_per_side);
        this.sides.push(plane_xy);
        this.sides.push(plane_xy2);
        // this.sides.push(plane_xz);
        // this.sides.push(plane_xz2);
        // this.sides.push(plane_yz);
        // this.sides.push(plane_yz2);
    }

    drawPlanes() {
        for (var side = 0; side < this.sides.length; side++) {
            this.sides[side].draw();
        }
    }
}