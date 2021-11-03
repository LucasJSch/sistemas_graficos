class CircularCylinder {
    constructor(glProgram) {
        this.glProgram = glProgram;
        this.color = [1.0, 0.0, 0.0];
        this.points_per_shape = 10.0;
        this.radius = 2.0;
        // this.bezier_points = [[0.0, 0.0, 0.0], [1.0, 0.0, 0.0], [1.0, 2.0, 0.0], [0.0, 2.0, 0.0],
        //                       [0.0, 2.0, 0.0], [-1.0, 2.0, 0.0], [-1.0, 0.0, 0.0], [0.0, 0.0, 0.0]];
        this.bezier_concatenator = null;
        // The curve in this case is the shape to draw multiple times.
        this.n_curves = 10.0;
        this.n_points_per_curve = 10.0;
        // this.n_bezier_pts = this.bezier_points.length / 4.0;

        this.pos_buf = [];
        this.nrm_buf = [];
        this.clr_buf = [];

        this.base_shape_pos = null;

        this.utils = new Utils();
    }

    draw(transformMatrix) {
        if (transformMatrix == null) {
            transformMatrix = mat4.create();
        }

        for (var angle = 0.0; angle <= 2.0 * Math.PI; angle += 2.0 * Math.PI / this.n_curves) {
            var pos = this.getShapePosBuf(angle);
            for (var elem of pos) {
                this.pos_buf.push(elem);
                this.clr_buf.push(0.5);
                this.nrm_buf.push(0.33);
            }
        }


        var grid = new Grid(this.glProgram, this.pos_buf, this.nrm_buf, this.clr_buf, /*n_rows=*/this.n_points_per_curve, /*n_cols=*/this.n_curves);
        grid.draw(transformMatrix);
    }

    getShapePosBuf(angleToRotate) {
        // TODO: Compute once and then transform.
        if (this.base_shape_pos == null) {
            this.base_shape_pos = [];
            for (var i = 0.0; i < this.points_per_shape; i++) {
                this.base_shape_pos.push(1.0 + this.radius*Math.cos(i * 2.0 * Math.PI / this.points_per_shape));
                this.base_shape_pos.push(this.radius*Math.sin(i * 2.0 * Math.PI / this.points_per_shape));
                this.base_shape_pos.push(0.0);
            }
            // We need to connect the shape's end and beginning.
            // Because of this we iterate in the other functions until points_per_shape + 1.
            this.base_shape_pos.push(1.0 + Math.cos(0.0));
            this.base_shape_pos.push(Math.sin(0.0));
            this.base_shape_pos.push(0.0);
        }

        var transformation = mat4.create();
        mat4.fromRotation(transformation, angleToRotate, [0.0, 1.0, 0.0]);
        return this.utils.TransformPosBuffer(transformation, this.base_shape_pos);
    }
}
