class CircularRectangles {
    constructor(shader, n_rectangles) {
        this.shader = shader;
        this.color = [0.184313725, 0.31372549, 0.31372549];
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
            for (var elem of pos_buf) {
                clr_buf.push(this.color[0]);
                clr_buf.push(this.color[1]);
                clr_buf.push(this.color[2]);
                // TODO: COmpute normal correctly.
                nrm_buf.push(this.color[0]);
                nrm_buf.push(this.color[1]);
                nrm_buf.push(this.color[2]);
            }

            // Close the section's top and bottom
            var bottom_pos_buf = [];
            var bottom_nrm_buf = [];
            var bottom_clr_buf = [];
            var top_pos_buf = [];
            // TODO: Compute top normal and color vectors.
            for (var i = 0; i <= this.n_points_per_curve; i++) {
                bottom_pos_buf.push(pos_buf[i*3]);
                bottom_pos_buf.push(pos_buf[i*3+1]);
                bottom_pos_buf.push(pos_buf[i*3+2]);
                bottom_clr_buf.push(this.color[0]);
                bottom_clr_buf.push(this.color[1]);
                bottom_clr_buf.push(this.color[2]);
                // TODO: Compute normal correctly.
                bottom_nrm_buf.push(this.color[0]);
                bottom_nrm_buf.push(this.color[1]);
                bottom_nrm_buf.push(this.color[2]);          
            }
            var transformation = mat4.create();
            mat4.fromRotation(transformation, this.angular_length_per_section - this.angular_length_per_section / this.n_curves_per_section, [0.0, 1.0, 0.0]);
            top_pos_buf = this.utils.TransformPosBuffer(transformation, bottom_pos_buf);

            this.grids.push(new Grid(this.shader, pos_buf, nrm_buf, clr_buf, /*n_rows=*/this.n_curves_per_section + 0.0, /*n_cols=*/this.n_points_per_curve + 1.0));
            this.grids.push(new Fan(this.shader, bottom_pos_buf, bottom_nrm_buf, bottom_clr_buf, /*n_rows=*/2.0, /*n_cols=*/this.n_points_per_curve + 1.0));
            this.grids.push(new Fan(this.shader, top_pos_buf, bottom_nrm_buf, bottom_clr_buf, /*n_rows=*/2.0, /*n_cols=*/this.n_points_per_curve + 1.0));
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
