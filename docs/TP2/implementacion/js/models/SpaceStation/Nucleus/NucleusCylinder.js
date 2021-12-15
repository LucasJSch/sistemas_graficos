class NucleusCylinder {
    // Draws a cylinder with Bezier-defined surfaces
    constructor(shader, bezier_points, length) {
        this.shader = shader;
        this.color = [0.823529412, 0.662745098, 0.53333333];
        this.cylinder_length = length;
        this.bezier_points = bezier_points;
        this.bezier_concatenator = null;

        this.n_rows = 18.0;
        this.diferencial_rotacion = 2.0 * Math.PI / this.n_rows;
        this.ptos_longitudinal = 12.0;
        this.n_points_bezier = this.bezier_points.length / 4.0;

        this.sides_pos_buf = [];
        this.sides_nrm_buf = [];
        this.sides_uv_buf = [];

        this.bottom_pos_buf = [];
        this.bottom_nrm_buf = [];
        this.bottom_uv_buf = [];

        this.top_pos_buf = [];
        this.top_nrm_buf = [];
        this.top_uv_buf = [];

        this.ptos_base = [];
        this.utils = new Utils();

        this.scale_factor_u = 1.0;
        this.scale_factor_v = 1.0;
    }

    setScalingFactorUV(factor_u, factor_v) {
        this.scale_factor_u = factor_u;
        this.scale_factor_v = factor_v;
    }

    setTexture(texture) {
        this.texture = texture;
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

        var sides_grid = new Grid(this.shader, this.sides_pos_buf, this.sides_nrm_buf, this.color, /*n_rows=*/this.n_rows + 1.0, /*n_cols=*/this.ptos_longitudinal, this.sides_uv_buf);
        sides_grid.setTexture(this.texture);
        var top_grid = new Grid(this.shader, this.top_pos_buf, this.top_nrm_buf, this.color, /*n_rows=*/2.0, /*n_cols=*/((this.n_rows + 1.0) / 2.0), this.top_uv_buf);
        top_grid.setTexture(this.texture);
        var bottom_grid = new Grid(this.shader, this.bottom_pos_buf, this.bottom_nrm_buf, this.color, /*n_rows=*/2.0, /*n_cols=*/((this.n_rows + 1.0) / 2.0), this.bottom_uv_buf);
        bottom_grid.setTexture(this.texture);
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
            for (var i = 0; i < ptos_rotados.length; i+=3) {
                this.sides_uv_buf.push(this.scale_factor_u * 4.0 * i / ptos_rotados.length);
                this.sides_uv_buf.push(this.scale_factor_v * 1.0 * rotacion / Math.PI);
            }
        }

        for (var i = 0; i < this.sides_pos_buf.length; i += 3) {
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
            this.bottom_uv_buf.push(0.1);
            this.bottom_uv_buf.push(0.1);
            this.top_uv_buf.push(0.1);
            this.top_uv_buf.push(0.1);
        }
        this.bottom_pos_buf.push(this.bottom_pos_buf[0]);
        this.bottom_pos_buf.push(this.bottom_pos_buf[1]);
        this.bottom_pos_buf.push(this.bottom_pos_buf[2]);

        var t_traslacion = mat4.create();
        mat4.fromTranslation(t_traslacion, [this.cylinder_length, 0.0, 0.0]);
        this.top_pos_buf = this.utils.TransformPosBuffer(t_traslacion, this.bottom_pos_buf);

        for (var i = 0; i < this.bottom_pos_buf.length; i += 3) {
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
