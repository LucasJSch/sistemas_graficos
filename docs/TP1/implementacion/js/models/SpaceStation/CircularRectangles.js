class CircularRectangles {
    constructor(glProgram, n_rectangles) {
        this.glProgram = glProgram;
        this.color = [1.0, 0.0, 0.0];
        // The curve in this case is the shape to draw multiple times.
        this.n_curves_per_section = 12.0;
        this.n_points_per_curve = 8.0;

        // Integer bigger than 3.
        this.n_sections = n_rectangles;
        this.angular_length_per_section = Math.PI / this.n_sections;

        this.grids = [];

        this.base_shape_pos = null;

        this.utils = new Utils();
    }

    draw(transformMatrix) {
        if (transformMatrix == null) {
            transformMatrix = mat4.create();
        }

        for (var section = 1.0; section <= this.n_sections; section++) {
            var init_angle = (section - 1.0) * this.angular_length_per_section * 2.0;
            // Correccion para que gire igual que las columnas de la estacion espacial.
            init_angle -= Math.PI / 2.0 + this.angular_length_per_section / 2.0;
            var end_angle = init_angle + this.angular_length_per_section;
            var pos_buf = [];
            var clr_buf = [];
            var nrm_buf = [];
            for (var angle = init_angle; angle <= end_angle; angle += this.angular_length_per_section / this.n_curves_per_section) {
                var aux  = this.getShapePosBuf(angle);
                // TODO: Use correct clr and nrm.
                for (var elem of aux) {
                    pos_buf.push(elem);
                }
            }
            this.grids.push(new Grid(this.glProgram, pos_buf, nrm_buf, clr_buf, /*n_rows=*/this.n_curves_per_section + 0.0, /*n_cols=*/this.n_points_per_curve + 1.0));
        }

        for (var grid of this.grids) {
            grid.draw(transformMatrix);
        }
    }

    getShapePosBuf(angleToRotate) {
        if (this.base_shape_pos == null) {
            this.base_shape_pos = [];
            this.base_shape_pos.push(+4.7);
            this.base_shape_pos.push(-1.0);
            this.base_shape_pos.push(0.0);

            this.base_shape_pos.push(+4.5);
            this.base_shape_pos.push(-0.6);
            this.base_shape_pos.push(0.0);

            this.base_shape_pos.push(+4.5);
            this.base_shape_pos.push(+0.6);
            this.base_shape_pos.push(0.0);

            this.base_shape_pos.push(+4.7);
            this.base_shape_pos.push(+1.0);
            this.base_shape_pos.push(0.0);

            this.base_shape_pos.push(5.0);
            this.base_shape_pos.push(1.0);
            this.base_shape_pos.push(0.0);

            this.base_shape_pos.push(5.5);
            this.base_shape_pos.push(0.6);
            this.base_shape_pos.push(0.0);

            this.base_shape_pos.push(+5.5);
            this.base_shape_pos.push(-0.6);
            this.base_shape_pos.push(0.0);

            this.base_shape_pos.push(+5.5);
            this.base_shape_pos.push(-1.0);
            this.base_shape_pos.push(0.0);

            this.base_shape_pos.push(+4.7);
            this.base_shape_pos.push(-1.0);
            this.base_shape_pos.push(0.0);
        }

        var transformation = mat4.create();
        mat4.fromRotation(transformation, angleToRotate, [0.0, 1.0, 0.0]);
        return this.utils.TransformPosBuffer(transformation, this.base_shape_pos);
    }
}
