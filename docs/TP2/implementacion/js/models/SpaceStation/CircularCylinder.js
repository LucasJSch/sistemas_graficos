class CircularCylinder {
    constructor(shader) {
        this.shader = shader;
        this.color = [1.0, 0.0, 0.0];
        // The curve in this case is the shape to draw multiple times.
        // Use odd numbers here.
        this.n_curves = 43.0;
        this.radius = 0.3;
        this.n_points_per_curve = 10.0;
        this.distance_from_zero = 5.0;

        this.pos_buf = [];
        this.nrm_buf = [];

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
                // TODO: Use correct nrm.
                this.nrm_buf.push(0.33);
            }
        }


        var grid = new Grid(this.shader, this.pos_buf, this.nrm_buf, this.color, /*n_rows=*/this.n_curves + 1.0, /*n_cols=*/this.n_points_per_curve + 1.0);
        grid.draw(transformMatrix);
    }

    getShapePosBuf(angleToRotate) {
        if (this.base_shape_pos == null) {
            this.base_shape_pos = [];
            for (var i = 0.0; i < this.n_points_per_curve; i++) {
                this.base_shape_pos.push(this.distance_from_zero + this.radius * Math.cos(i * 2.0 * Math.PI / this.n_points_per_curve));
                this.base_shape_pos.push(this.radius * Math.sin(i * 2.0 * Math.PI / this.n_points_per_curve));
                this.base_shape_pos.push(0.0);
            }
            // We need to connect the shape's end and beginning.
            // Because of this we iterate in the other functions until n_points_per_curve + 1.
            this.base_shape_pos.push(this.distance_from_zero + this.radius * Math.cos(0.0));
            this.base_shape_pos.push(this.radius * Math.sin(0.0));
            this.base_shape_pos.push(0.0);
        }

        var transformation = mat4.create();
        mat4.fromRotation(transformation, angleToRotate, [0.0, 1.0, 0.0]);
        return this.utils.TransformPosBuffer(transformation, this.base_shape_pos);
    }
}
