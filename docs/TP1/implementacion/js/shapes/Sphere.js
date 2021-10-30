class Sphere {
    // Draws a closed-surface cylinder at the origin with unitary radius and unitary length.
    constructor(glProgram, vColor, n_rows=50, n_cols=50) {
        this.glProgram = glProgram;
        this.vColor = vColor;
        this.n_rows = n_rows;
        this.n_cols = n_cols;
        this.pos_buf = [];
        this.nrm_buf = [];
        this.clr_buf = [];

        this.utils = new Utils();
    }

    draw(transformMatrix) {
        if (transformMatrix == null) {
            transformMatrix = mat4.create();
        }

        this.generateBuffers();
        var grid = new Grid(this.glProgram, this.pos_buf, this.nrm_buf, this.clr_buf, this.n_rows, this.n_cols);
        grid.draw(transformMatrix);
    }

    generateBuffers() {
        // Pos buffer generator.
        for (var row = 0; row < this.n_rows; row++) {
            for (var col = 0; col < this.n_cols; col++) {
                const pos = this.getPos(this.n_rows / row, this.n_cols / col);
                this.pos_buf.push(pos[0]);
                this.pos_buf.push(pos[1]);
                this.pos_buf.push(pos[2]);
            }
        }

        for (var i = 0; i < this.pos_buf.length; i += 3) {
            this.clr_buf.push(this.vColor[0]);
            this.clr_buf.push(this.vColor[1]);
            this.clr_buf.push(this.vColor[2]);

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

    getPos(u, v) {
        const theta = 2 * Math.PI * u;
        const phi = Math.PI * v;
        const radius = 5.0;
        
        const x = Math.cos(theta) * Math.sin(phi) * radius;
        const y = Math.sin(theta) * Math.sin(phi) * radius;
        const z = -Math.cos(phi) * radius;
        return [x,y,z];
    }
}
