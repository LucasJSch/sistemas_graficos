class NucleusCylinder {
    // Draws a cylinder with Bezier-defined surfaces
    constructor(shader, bezier_points) {
        this.shader = shader;
        this.color = [0.0, 0.0, 0.0];
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
        this.nrms_base = [];
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

        var sides_grid = new Grid(this.shader, this.sides_pos_buf, this.sides_nrm_buf, this.color, /*n_rows=*/this.n_rows + 1.0, /*n_cols=*/this.ptos_longitudinal, this.sides_uv_buf);
        sides_grid.setTexture(this.texture);
        var top_grid = new Grid(this.shader, this.top_pos_buf, this.top_nrm_buf, this.color, /*n_rows=*/2.0, /*n_cols=*/((this.n_rows + 1.0) / 2.0), this.top_uv_buf);
        top_grid.setTexture(this.texture);
        var bottom_grid = new Grid(this.shader, this.bottom_pos_buf, this.bottom_nrm_buf, this.color, /*n_rows=*/2.0, /*n_cols=*/((this.n_rows + 1.0) / 2.0), this.bottom_uv_buf);
        bottom_grid.setTexture(this.texture);
        sides_grid.draw(transformMatrix);
        top_grid.draw(transformMatrix);
        bottom_grid.draw(transformMatrix);
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
            aux = this.bezier_concatenator.getSecondDerivative(this.n_points_bezier * i / this.ptos_longitudinal);
            this.nrms_base.push(aux[0]);
            this.nrms_base.push(aux[1]);
            this.nrms_base.push(aux[2]);
        }
    }

    generateSideBuffers() {
        var t_rotacion = mat4.create();
        for (var rotacion = 0.0; rotacion <= 2.0 * Math.PI; rotacion += this.diferencial_rotacion) {
            mat4.fromRotation(t_rotacion, rotacion, [1.0, 0.0, 0.0]);
            var ptos_rotados = this.utils.TransformPosBuffer(t_rotacion, this.ptos_base);
            for (var elem of ptos_rotados) {
                this.sides_pos_buf.push(elem);
            }
            for (var i = 0; i < ptos_rotados.length; i+=3) {
                this.sides_uv_buf.push(this.scale_factor_u * 4.0 * i / ptos_rotados.length);
                this.sides_uv_buf.push(this.scale_factor_v * 1.0 * rotacion / Math.PI);
            }
            ptos_rotados = this.utils.TransformPosBuffer(t_rotacion, this.nrms_base);
            // this.sides_nrm_buf = this.sides_nrm_buf.concat(this.nrms_base);
            for (var elem of ptos_rotados) {
                this.sides_nrm_buf.push(-elem);
            }
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
            this.bottom_nrm_buf.push(-1.0);
            this.bottom_nrm_buf.push(0.0);
            this.bottom_nrm_buf.push(0.0);
            this.top_nrm_buf.push(1.0);
            this.top_nrm_buf.push(0.0);
            this.top_nrm_buf.push(0.0);
        }
        this.bottom_pos_buf.push(this.bottom_pos_buf[0]);
        this.bottom_pos_buf.push(this.bottom_pos_buf[1]);
        this.bottom_pos_buf.push(this.bottom_pos_buf[2]);
        this.bottom_nrm_buf.push(-1.0);
        this.bottom_nrm_buf.push(0.0);
        this.bottom_nrm_buf.push(0.0);
        this.top_nrm_buf.push(1.0);
        this.top_nrm_buf.push(0.0);
        this.top_nrm_buf.push(0.0);

        for (var i = this.ptos_longitudinal*3-3; i < this.sides_pos_buf.length; i+= this.ptos_longitudinal*3.0) {
            this.top_pos_buf.push(this.sides_pos_buf[i]);
            this.top_pos_buf.push(this.sides_pos_buf[i+1]);
            this.top_pos_buf.push(this.sides_pos_buf[i+2]);
        }
        this.top_pos_buf.push(this.sides_pos_buf[this.ptos_longitudinal-1]);
        this.top_pos_buf.push(this.sides_pos_buf[this.ptos_longitudinal]);
        this.top_pos_buf.push(this.sides_pos_buf[this.ptos_longitudinal+1]);
    }
}
