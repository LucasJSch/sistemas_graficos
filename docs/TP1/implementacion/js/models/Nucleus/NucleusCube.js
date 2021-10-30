class NucleusCube {
    // Draws a cube with Bezier-defined surfaces
    constructor(glProgram) {
        this.glProgram = glProgram;
        this.color = [0.690196078, 0.298039216, 0.611764706];
        this.bezier_points = [[0.5, 0.0, 0.0], [1.0, 0.0, 0.0], [1.0, 0.0, 0.0], [1.0, 0.5, 0.0],
                              [1.0, 0.5, 0.0], [1.0, 1.0, 0.0], [1.0, 1.0, 0.0], [0.5, 1.0, 0.0],
                              [0.5, 1.0, 0.0], [0.0, 1.0, 0.0], [0.0, 1.0, 0.0], [0.0, 0.5, 0.0],
                              [0.0, 0.5, 0.0], [0.0, 0.0, 0.0], [0.0, 0.0, 0.0], [0.5, 0.0, 0.0]];
        this.bezier_concatenator = null;
        // Puntos a obtener del concatenador de Bezier.
        this.ptos_longitudinal = 100;
        // Vector a trasladar los ptos para generar el segundo lado del cubo.
        this.n_points_bezier = this.bezier_points.length / 4.0;
        this.n_levels = 2.0;
        this.cube_length = 1.0;
        this.diferencial_traslacion = this.cube_length / this.n_levels;

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

        var grid = new Grid(this.glProgram, this.pos_buf, this.nrm_buf, this.clr_buf, /*n_rows=*/this.n_levels + 1, /*n_cols=*/this.ptos_longitudinal+1);
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
        ptos_base.push(ptos_base[0]);
        ptos_base.push(ptos_base[1]);
        ptos_base.push(ptos_base[2]);

        var t_traslacion = mat4.create();
        for (var t = 0.0; t <= this.cube_length; t += this.diferencial_traslacion) {
            mat4.fromTranslation(t_traslacion, [0.0, 0.0, t]);
            const ptos_trasladados = this.utils.TransformPosBuffer(t_traslacion, ptos_base);
            for (var elem of ptos_trasladados) {
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
