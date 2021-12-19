class CircularRectangles {
    constructor(shader, n_rectangles) {
        this.shader = shader;
        this.color = [0.0, 0.0, 0.0];
        this.bezier_points = [[4.5, 1.0, 0.0], [4.5, 1.0, 0.0], [5.8, 1.1, 0.0], [5.8, 1.1, 0.0],
                              [5.8, 1.1, 0.0],  [5.8, 1.1, 0.0], [5.8, -1.1, 0.0], [5.8, -1.1, 0.0],
                              [5.8, -1.1, 0.0], [5.8, -1.1, 0.0], [4.5, -1.0, 0.0], [4.5, -1.0, 0.0],
                              [4.5, -1.0, 0.0], [4.5, -1.0, 0.0], [4.5, 1.0, 0.0], [4.5, 1.0, 0.0]];
        this.concatenator = new CubicBezierConcatenator(this.bezier_points);
        // The curve in this case is the shape to draw multiple times.
        this.n_bezier_points = this.bezier_points.length / 4.0;

        this.n_curves_per_section = 8.0;
        this.n_points_per_curve = 4.0;

        // Integer bigger than 3.
        this.n_sections = n_rectangles;
        this.angular_length_per_section = Math.PI / this.n_sections;

        this.grids = [];

        this.base_shape_pos = [];
        this.base_shape_nrm = [];
        this.base_shape_uv = [];

        this.utils = new Utils();
    }

    setTexture(texture) {
        this.texture = texture;
    }

    draw(transformMatrix) {
        if (transformMatrix == null) {
            transformMatrix = mat4.create();
        }

        this.generateBasePts();

        for (var section = 1.0; section <= this.n_sections; section++) {
            var init_angle = (section - 1.0) * this.angular_length_per_section * 2.0;
            // Correccion para que gire igual que las columnas de la estacion espacial.
            init_angle -= Math.PI / 2.0 + this.angular_length_per_section / 2.0;
            var end_angle = init_angle + this.angular_length_per_section;
            var pos_buf = [];
            var nrm_buf = [];
            var uv_buf = [];
            for (var angle = init_angle; angle <= end_angle; angle += this.angular_length_per_section / this.n_curves_per_section) {
                var aux  = this.getShapePosBuf(angle);
                var pos = aux[0];
                var nrm = aux[1];
                for (var elem of pos) {
                    pos_buf.push(elem);
                }
                for (var elem of nrm) {
                    nrm_buf.push(elem);
                }
                for (var idx = 0; idx < pos.length; idx+=3) {
                    uv_buf.push(1.0 * idx / pos.length + 0.0);
                    uv_buf.push(0.5 * angle / (Math.PI/4.0) + 0.2);
                }

            }

            // Close the section's top and bottom
            var bottom_pos_buf = [];
            var bottom_nrm_buf = [];
            var top_pos_buf = [];
            var top_nrm_buf = [];
            for (var i = 0; i <= this.n_points_per_curve; i++) {
                bottom_pos_buf.push(pos_buf[i*3]);
                bottom_pos_buf.push(pos_buf[i*3+1]);
                bottom_pos_buf.push(pos_buf[i*3+2]);
                var transformation = mat4.create();
                mat4.fromRotation(transformation, init_angle, [0.0, 1.0, 0.0]);
                var aux = this.utils.TransformPosBuffer(transformation, [0.0, 0.0, 1]);
                bottom_nrm_buf.push(aux[0]);
                bottom_nrm_buf.push(aux[1]);
                bottom_nrm_buf.push(aux[2]);
                mat4.fromRotation(transformation, end_angle, [0.0, 1.0, 0.0]);
                var aux = this.utils.TransformPosBuffer(transformation, [0.0, 0.0, -1]);
                top_nrm_buf.push(aux[0]);
                top_nrm_buf.push(aux[1]);
                top_nrm_buf.push(aux[2]);
            }
            var transformation = mat4.create();
            mat4.fromRotation(transformation, this.angular_length_per_section - this.angular_length_per_section / this.n_curves_per_section, [0.0, 1.0, 0.0]);
            top_pos_buf = this.utils.TransformPosBuffer(transformation, bottom_pos_buf);



            var grid = new Grid(this.shader, pos_buf, nrm_buf, this.color, /*n_rows=*/this.n_curves_per_section + 0.0, /*n_cols=*/this.n_points_per_curve + 1.0, uv_buf);
            grid.setTexture(this.texture);
            this.grids.push(grid);

            var bottom_fan = new Fan(this.shader, bottom_pos_buf, bottom_nrm_buf, this.color, /*n_rows=*/2.0, /*n_cols=*/this.n_points_per_curve + 1.0);
            bottom_fan.setTexture(this.texture);
            this.grids.push(bottom_fan);

            var top_fan = new Fan(this.shader, top_pos_buf, top_nrm_buf, this.color, /*n_rows=*/2.0, /*n_cols=*/this.n_points_per_curve + 1.0);
            top_fan.setTexture(this.texture);
            this.grids.push(top_fan);
        }

        for (var i = 0; i < this.grids.length; i++) {
            this.grids[i].draw(transformMatrix);
        }
    }

    getShapePosBuf(angleToRotate) {
        var transformation = mat4.create();
        mat4.fromRotation(transformation, angleToRotate, [0.0, 1.0, 0.0]);
        return [this.utils.TransformPosBuffer(transformation, this.base_shape_pos), this.utils.TransformPosBuffer(transformation, this.base_shape_nrm)];
    }

    generateBasePts() {
        for (var i = 0; i < this.n_points_per_curve; i++) {
            var aux = this.concatenator.getPoint(this.n_bezier_points * i / this.n_points_per_curve);
            this.base_shape_pos.push(aux[0]);
            this.base_shape_pos.push(aux[1]);
            this.base_shape_pos.push(aux[2]);
            // aux = this.concatenator.getSecondDerivative(this.n_bezier_points * i / this.n_points_per_curve);
            // this.base_shape_nrm.push(aux[0]);
            // this.base_shape_nrm.push(aux[1]);
            // this.base_shape_nrm.push(aux[2]);
            this.base_shape_uv.push(i / (this.n_points_per_curve-1));
            this.base_shape_uv.push(i / (this.n_points_per_curve-1));
        }
        this.base_shape_pos.push(this.base_shape_pos[0]);
        this.base_shape_pos.push(this.base_shape_pos[1]);
        this.base_shape_pos.push(this.base_shape_pos[2]);
        // this.base_shape_nrm.push(this.base_shape_nrm[0]);
        // this.base_shape_nrm.push(this.base_shape_nrm[1]);
        // this.base_shape_nrm.push(this.base_shape_nrm[2]);

        this.base_shape_nrm.push(0.0);
        this.base_shape_nrm.push(1.0);
        this.base_shape_nrm.push(0.0);

        this.base_shape_nrm.push(1.0);
        this.base_shape_nrm.push(0.0);
        this.base_shape_nrm.push(0.0);

        this.base_shape_nrm.push(0.0);
        this.base_shape_nrm.push(-1.0);
        this.base_shape_nrm.push(0.0);

        this.base_shape_nrm.push(-1.0);
        this.base_shape_nrm.push(0.0);
        this.base_shape_nrm.push(0.0);

        this.base_shape_nrm.push(0.0);
        this.base_shape_nrm.push(1.0);
        this.base_shape_nrm.push(0.0);
    }

    normalize(point) {
        var module = Math.sqrt(point[0]*point[0] + point[1]*point[1] + point[2]*point[2]);
        return [point[0] / module, point[1] / module, point[2] / module];
    }
}
