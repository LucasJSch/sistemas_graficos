class Capsule {
    // Draws the capsule.
    constructor(shader) {
        this.shader = shader;
        this.color = [0.823529412, 0.662745098, 0.53333333];
        this.color_aleron = [0.1, 0.1, 0.1];
        this.bezier_points = [[0.0, 0.0, 0.0], [0.0, 0.0, 0.0], [0.0, 0.0, 0.5], [0.0, 0.0, 0.5],
                              [0.0, 0.0, 0.5], [0.0, 0.0, 0.75], [0.0, 0.0, 0.75], [0.0, -0.3, 0.9],
                              [0.0, -0.3, 0.9], [0.0, -1.0, 0.9], [0.0, -2.0, 0.8], [0.0, -2.3, 0.5],
                              [0.0, -2.3, 0.5], [0.0, -2.3, 0.5], [0.0, -2.4, 0.25], [0.0, -2.4, 0.25],
                              [0.0, -2.4, 0.25], [0.0, -2.4, 0.25], [0.0, -2.5, 0.1], [0.0, -2.5, 0.1]];
        this.bezier_concatenator = null;

        this.n_rows = 48.0;
        this.diferencial_rotacion = 2.0 * Math.PI / this.n_rows;
        this.ptos_longitudinal = 20.0;
        this.n_points_bezier = this.bezier_points.length / 4.0;

        this.pos_buf = [];
        this.nrm_buf = [];
        this.clr_buf = [];
        this.uv_buf = [];

        this.aleron_pos_buf = [];
        this.aleron_nrm_buf = [];
        this.aleron_clr_buf = [];

        this.utils = new Utils();
    }

    setTexture(texture) {
        this.texture = texture;
    }

    draw(transformMatrix) {
        if (transformMatrix == null) {
            transformMatrix = mat4.create();
        }

        this.generateBezierConcatenator();
        this.generateBuffers();

        var capsula = new Grid(this.shader, this.pos_buf, this.nrm_buf, this.clr_buf, /*n_rows=*/this.n_rows + 1.0, /*n_cols=*/this.ptos_longitudinal, this.uv_buf);
        capsula.setTexture(this.texture);
        var aleron = new Grid(this.shader, this.aleron_pos_buf, this.aleron_nrm_buf, this.aleron_clr_buf, /*n_rows=*/this.n_rows + 1.0, /*n_cols=*/this.ptos_longitudinal);
        capsula.draw(transformMatrix);
        aleron.draw(transformMatrix);
    }

    generateBezierConcatenator() {
        var points = [];
        for (var i = 0; i < this.bezier_points.length; i++) {
            points.push([this.bezier_points[i][0], this.bezier_points[i][1], this.bezier_points[i][2]]);
        }
        this.bezier_concatenator = new CubicBezierConcatenator(points);
    }

    generateBuffers() {
        var ptos_base = [];
        for (var i = 0; i < this.ptos_longitudinal; i++) {
            var aux = this.bezier_concatenator.getPoint(this.n_points_bezier * i / this.ptos_longitudinal);
            ptos_base.push(aux[0]);
            ptos_base.push(aux[1]);
            ptos_base.push(aux[2]);
        }

        var t_rotacion = mat4.create();
        for (var rotacion = 0.0; rotacion <= 2.0 * Math.PI; rotacion += this.diferencial_rotacion) {
            mat4.fromRotation(t_rotacion, rotacion, [0.0, -1.0, 0.0]);
            const ptos_rotados = this.utils.TransformPosBuffer(t_rotacion, ptos_base);
            for (var elem of ptos_rotados) {
                this.pos_buf.push(elem);
            }
            for (var i = 0; i < ptos_rotados.length; i+=3) {
                this.uv_buf.push(2.0 * i / ptos_rotados.length);
                this.uv_buf.push(1.0 * rotacion / Math.PI);
            }
        }

        for (var i = 0; i < this.pos_buf.length; i += 3) {
            this.clr_buf.push(this.color[0]);
            this.clr_buf.push(this.color[1]);
            this.clr_buf.push(this.color[2]);

            // Genero normal cada 3 puntos (i.e. 1 por triangulo)
            if (i < 6) {
                continue;
            }
            var nrm = this.utils.GetTriangNormal(
                [this.pos_buf[i-6], this.pos_buf[i-5], this.pos_buf[i-4]],
                [this.pos_buf[i-3], this.pos_buf[i-2], this.pos_buf[i-1]],
                [this.pos_buf[i], this.pos_buf[i+1], this.pos_buf[i+2]]);
            this.nrm_buf.push(nrm[0]);
            this.nrm_buf.push(nrm[1]);
            this.nrm_buf.push(nrm[2]);
        }

        var t = mat4.create();
        var aux = mat4.create();
        mat4.fromScaling(t, [0.5, 0.5, 0.75]);
        mat4.fromTranslation(aux, [0.0, 1.0, 0.0]);
        mat4.mul(t, aux, t);
        this.aleron_pos_buf = this.utils.TransformPosBuffer(t, this.pos_buf);
        for (var i = 0; i < this.clr_buf.length; i+= 3) {
            this.aleron_clr_buf.push(this.color_aleron[0]);
            this.aleron_clr_buf.push(this.color_aleron[1]);
            this.aleron_clr_buf.push(this.color_aleron[2]);
        }
        this.aleron_nrm_buf = Array.from(this.nrm_buf);
    }
}
