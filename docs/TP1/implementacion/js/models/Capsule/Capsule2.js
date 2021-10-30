class Capsule2 {
    // Draws the capsule.
    constructor(glProgram) {
        this.glProgram = glProgram;
        this.color = [0.823529412, 0.662745098, 0.53333333];
        this.bezier_points = [[0.0, 0.0, 0.0], [0.0, -0.1, 0.5], [0.0, -0.1, 0.5], [0.0, -2.0, 0.9], [0.0, -2.0, 0.9], [0.0, -2.0, 0.85], [0.0, -5.0, 0.6], [0.0, -8.0, 0.1]];
        this.bezier_concatenator = null;
        this.extrusion_levels = 100;

        this.n_rows = 48.0;
        this.diferencial_rotacion = 2.0 * Math.PI / this.n_rows;
        this.ptos_longitudinal = 20.0;
        this.n_points_bezier = this.bezier_points.length / 4.0;

        this.pos_buf = [];
        this.nrm_buf = [];
        this.clr_buf = [];

        this.utils = new Utils();
    }

    draw(transformMatrix) {
        if (transformMatrix == null) {
            transformMatrix = mat4.create();
        }

        this.generateBezierConcatenator();
        this.generateBuffers();

        var grid = new Grid(this.glProgram, this.pos_buf, this.nrm_buf, this.clr_buf, /*n_rows=*/this.n_rows, /*n_cols=*/this.ptos_longitudinal);
        grid.draw(transformMatrix);
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
    }
}
