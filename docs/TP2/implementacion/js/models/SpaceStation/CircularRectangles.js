class CircularRectangles {
    constructor(shader, n_rectangles) {
        this.shader = shader;
        this.color = [0.184313725, 0.31372549, 0.31372549];
        // The curve in this case is the shape to draw multiple times.
        this.n_curves_per_section = 8.0;
        this.n_points_per_curve = 8.0;

        // Integer bigger than 3.
        this.n_sections = n_rectangles;
        this.angular_length_per_section = Math.PI / this.n_sections;

        this.grids = [];

        this.base_shape_pos = null;
        this.uv_buf = [];

        this.utils = new Utils();
    }

    setTexture(texture) {
        this.texture = texture;
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
            var nrm_buf = [];
            var uv_buf = [];
            for (var angle = init_angle; angle <= end_angle; angle += this.angular_length_per_section / this.n_curves_per_section) {
                var aux  = this.getShapePosBuf(angle);
                // var aux_pos_buf = aux[0];
                // var aux_nrm_buf = aux[1];
                for (var elem of aux) {
                    pos_buf.push(elem);
                }
                // for (var elem of aux_nrm_buf) {
                //     nrm_buf.push(elem);
                // }
                for (var idx = 0; idx < aux.length; idx+=3) {
                    uv_buf.push(1.0 * idx / aux.length + 0.0);
                    uv_buf.push(0.5 * angle / (Math.PI/4.0) + 0.2);
                }
            }

            // Close the section's top and bottom
            var bottom_pos_buf = [];
            var bottom_nrm_buf = [];
            var top_pos_buf = [];
            for (var i = 0; i <= this.n_points_per_curve; i++) {
                bottom_pos_buf.push(pos_buf[i*3]);
                bottom_pos_buf.push(pos_buf[i*3+1]);
                bottom_pos_buf.push(pos_buf[i*3+2]);
                bottom_nrm_buf.push(this.color[0]);
                bottom_nrm_buf.push(this.color[1]);
                bottom_nrm_buf.push(this.color[2]);          
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

            var top_fan = new Fan(this.shader, top_pos_buf, bottom_nrm_buf, this.color, /*n_rows=*/2.0, /*n_cols=*/this.n_points_per_curve + 1.0);
            top_fan.setTexture(this.texture);
            this.grids.push(top_fan);
        }

        for (var i = 0; i < this.grids.length; i++) {
            this.grids[i].draw(transformMatrix);
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
        // var transformed_pos_buf = this.utils.TransformPosBuffer(transformation, this.base_shape_pos);

        // var nrm_buf = [];
       
        // for (var i = 0; i < transformed_pos_buf.length; i+=3) {
        //     var aux = this.utils.crossProd(
        //         [transformed_pos_buf[i],   transformed_pos_buf[i+1], transformed_pos_buf[i+2]],
        //         [transformed_pos_buf[i+3], transformed_pos_buf[i+4], transformed_pos_buf[i+5]]);
        //     nrm_buf.push(aux[0]);
        //     nrm_buf.push(aux[1]);
        //     nrm_buf.push(aux[2]);
        // }

        // var nrm_buf = [];
        // for (var i = 0; i < transformed_pos_buf.length; i += 9) {
        //     var tmp = this.utils.GetTriangNormal(
        //         [transformed_pos_buf[i], transformed_pos_buf[i+1], transformed_pos_buf[i+2]],
        //         [transformed_pos_buf[i+3], transformed_pos_buf[i+4], transformed_pos_buf[i+5]],
        //         [transformed_pos_buf[i+6], transformed_pos_buf[i+7], transformed_pos_buf[i+8]]);
        //     nrm_buf.push(tmp[0], tmp[1], tmp[2]);
        //     nrm_buf.push(tmp[0], tmp[1], tmp[2]);
        //     nrm_buf.push(tmp[0], tmp[1], tmp[2]);
        // }

        // return [transformed_pos_buf, nrm_buf];
        return this.utils.TransformPosBuffer(transformation, this.base_shape_pos);;
    }
}
