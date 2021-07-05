class BuildingColumns {
    // Draws the columns of a building.
    // Receives: n_floors, position of each columns, heightPerFloor, vColor
    constructor(glProgram, vColor, height, columns_positions) {
        this.glProgram = glProgram;
        this.columns_positions = columns_positions;
        this.vColor = vColor;
        this.scale_matrix = mat4.create();
        mat4.fromScaling(this.scale_matrix, [0.1, 0.1, height]);
    }

    draw(transformMatrix) {
        if (transformMatrix == null) {
            transformMatrix = mat4.create();
        }

        var t = mat4.create();
        for (var i = 0; i < columns_positions.length; i++) {
            var cyl = new Cylinder(this.glProgram, this.vColor);
            mat4.fromTranslation(t, columns_positions[i]);
            mat4.mul(t, t, s);
            cyl.draw(t);
        }
    }
}
