class NucleusCylinder {
    // Draws a cylinder with Bezier-defined surfaces
    constructor(glProgram, bezier_points, length) {
        this.glProgram = glProgram;
        this.color = [0.0, 1.0, 0.0];
        this.cylinder_length = length;
        this.bezier_points = bezier_points;
        this.bezier_concatenator = null;

        this.n_rows = 48.0;
        this.diferencial_rotacion = 2.0 * Math.PI / this.n_rows;
        this.ptos_longitudinal = 40.0;
        this.n_points_bezier = this.bezier_points.length / 4.0;

        this.sides_pos_buf = [];
        this.sides_nrm_buf = [];
        this.sides_clr_buf = [];

        this.bottom_pos_buf = [];
        this.bottom_nrm_buf = [];
        this.bottom_clr_buf = [];

        this.top_pos_buf = [];
        this.top_nrm_buf = [];
        this.top_clr_buf = [];

        this.ptos_base = [];
        this.utils = new Utils();
    }

    draw(transformMatrix) {
        if (transformMatrix == null) {
            transformMatrix = mat4.create();
        }

        this.generateBezierConcatenator();
        this.generateBasePts();
        this.generateSideBuffers();
        this.generateTopBottomBuffers();
        this.applyTransformMatrix(transformMatrix);

        var sides_grid = new Grid(this.glProgram, this.sides_pos_buf, this.sides_nrm_buf, this.sides_clr_buf, /*n_rows=*/this.n_rows + 1.0, /*n_cols=*/this.ptos_longitudinal);
        var top_grid = new Grid(this.glProgram, this.top_pos_buf, this.top_nrm_buf, this.top_clr_buf, /*n_rows=*/2.0, /*n_cols=*/((this.n_rows + 1.0) / 2.0));
        var bottom_grid = new Grid(this.glProgram, this.bottom_pos_buf, this.bottom_nrm_buf, this.bottom_clr_buf, /*n_rows=*/2.0, /*n_cols=*/((this.n_rows + 1.0) / 2.0));
        sides_grid.draw();
        top_grid.draw();
        bottom_grid.draw();
    }

    applyTransformMatrix(transformMatrix) {
        // TODO: Transform normal buf.
        this.sides_pos_buf = this.utils.TransformPosBuffer(transformMatrix, this.sides_pos_buf);
        this.top_pos_buf = this.utils.TransformPosBuffer(transformMatrix, this.top_pos_buf);
        this.bottom_pos_buf = this.utils.TransformPosBuffer(transformMatrix, this.bottom_pos_buf);
    }

    generateBezierConcatenator() {
        var points = [];
        for (var i = 0; i < this.bezier_points.length; i++) {
            points.push([this.bezier_points[i][0], this.bezier_points[i][1], this.bezier_points[i][2]]);
        }
        this.bezier_concatenator = new CubicBezierConcatenator(points);
    }

    generateBasePts() {
        for (var i = 0; i < this.ptos_longitudinal; i++) {
            var aux = this.bezier_concatenator.getPoint(this.n_points_bezier * i / this.ptos_longitudinal);
            this.ptos_base.push(aux[0]);
            this.ptos_base.push(aux[1]);
            this.ptos_base.push(aux[2]);
        }
    }

    generateSideBuffers() {
        var t_rotacion = mat4.create();
        for (var rotacion = 0.0; rotacion <= 2.0 * Math.PI; rotacion += this.diferencial_rotacion) {
            mat4.fromRotation(t_rotacion, rotacion, [1.0, 0.0, 0.0]);
            const ptos_rotados = this.utils.TransformPosBuffer(t_rotacion, this.ptos_base);
            for (var elem of ptos_rotados) {
                this.sides_pos_buf.push(elem);
            }
        }

        for (var i = 0; i < this.sides_pos_buf.length; i += 3) {
            this.sides_clr_buf.push(this.color[0]);
            this.sides_clr_buf.push(this.color[1]);
            this.sides_clr_buf.push(this.color[2]);

            // Genero normal cada 3 puntos (i.e. 1 por triangulo)
            if (i < 6) {
                continue;
            }
            var nrm = this.utils.GetTriangNormal(
                [this.sides_pos_buf[i-6], this.sides_pos_buf[i-5], this.sides_pos_buf[i-4]],
                [this.sides_pos_buf[i-3], this.sides_pos_buf[i-2], this.sides_pos_buf[i-1]],
                [this.sides_pos_buf[i], this.sides_pos_buf[i+1], this.sides_pos_buf[i+2]]);
            this.sides_nrm_buf.push(nrm[0]);
            this.sides_nrm_buf.push(nrm[1]);
            this.sides_nrm_buf.push(nrm[2]);
        }
    }

    generateTopBottomBuffers() {
        var base_point = [this.sides_pos_buf[0], this.sides_pos_buf[1], this.sides_pos_buf[2]];
        var t_rotacion = mat4.create();
        for (var rotacion = 0.0; rotacion <= 2.0 * Math.PI; rotacion += this.diferencial_rotacion) {
            mat4.fromRotation(t_rotacion, rotacion, [1.0, 0.0, 0.0]);
            const rotated_point = this.utils.TransformPosBuffer(t_rotacion, base_point);
            for (var elem of rotated_point) {
                this.bottom_pos_buf.push(elem);
            }
        }
        this.bottom_pos_buf.push(this.bottom_pos_buf[0]);
        this.bottom_pos_buf.push(this.bottom_pos_buf[1]);
        this.bottom_pos_buf.push(this.bottom_pos_buf[2]);

        var t_traslacion = mat4.create();
        mat4.fromTranslation(t_traslacion, [this.cylinder_length, 0.0, 0.0]);
        this.top_pos_buf = this.utils.TransformPosBuffer(t_traslacion, this.bottom_pos_buf);

        for (var i = 0; i < this.bottom_pos_buf.length; i += 3) {
            this.bottom_clr_buf.push(this.color[0]);
            this.bottom_clr_buf.push(this.color[1]);
            this.bottom_clr_buf.push(this.color[2]);
            this.top_clr_buf.push(this.color[0]);
            this.top_clr_buf.push(this.color[1]);
            this.top_clr_buf.push(this.color[2]);

            // Genero normal cada 3 puntos (i.e. 1 por triangulo)
            if (i < 6) {
                continue;
            }
            var nrm = this.utils.GetTriangNormal(
                [this.bottom_pos_buf[i-6], this.bottom_pos_buf[i-5], this.bottom_pos_buf[i-4]],
                [this.bottom_pos_buf[i-3], this.bottom_pos_buf[i-2], this.bottom_pos_buf[i-1]],
                [this.bottom_pos_buf[i], this.bottom_pos_buf[i+1], this.bottom_pos_buf[i+2]]);
            this.bottom_nrm_buf.push(nrm[0]);
            this.bottom_nrm_buf.push(nrm[1]);
            this.bottom_nrm_buf.push(nrm[2]);
            this.top_nrm_buf.push(-nrm[0]);
            this.top_nrm_buf.push(-nrm[1]);
            this.top_nrm_buf.push(-nrm[2]);
        }
    }
}
