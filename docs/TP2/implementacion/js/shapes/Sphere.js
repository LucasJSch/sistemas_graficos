class Sphere {
    // Draws a closed-surface cylinder at the origin with unitary radius and unitary length.
    constructor(shader, vColor, n_rows=50, n_cols=50) {
        this.shader = shader;
        this.vColor = vColor;
        this.n_rows = n_rows;
        this.n_cols = n_cols;
        this.pos_buf = [];
        this.nrm_buf = [];
        this.clr_buf = [];
        this.uv_buf = [];

        this.utils = new Utils();
    }

    draw(transformMatrix) {
        if (transformMatrix == null) {
            transformMatrix = mat4.create();
        }

        this.generateBuffers();

        // TODO: Change normal buffer as welll.
        var grid = new Grid(this.shader, this.pos_buf, this.nrm_buf, this.clr_buf, this.n_rows, this.n_cols, this.uv_buf);
        grid.draw(transformMatrix);
    }

    generateBuffers() {
        var latNumber;
        var longNumber;

        for (latNumber=0; latNumber <= this.n_rows; latNumber++) {
            var theta = latNumber * Math.PI / (this.n_rows);
            var sinTheta = Math.sin(theta);
            var cosTheta = Math.cos(theta);


            for (longNumber=0; longNumber < this.n_cols; longNumber++) {
                var phi = longNumber * 2 * Math.PI / this.n_cols;
                var sinPhi = Math.sin(phi);
                var cosPhi = Math.cos(phi);

                var r=1;                        

                var x = cosPhi * sinTheta*r;
                var y = cosTheta*r;
                var z = sinPhi * sinTheta*r;

                var u =  (longNumber / this.n_cols);
                var v = 1-(latNumber / this.n_rows);

                this.nrm_buf.push(x);
                this.nrm_buf.push(y);
                this.nrm_buf.push(z);

                this.uv_buf.push(u);
                this.uv_buf.push(v);
                
                this.pos_buf.push(x);
                this.pos_buf.push(y);
                this.pos_buf.push(z);

                this.clr_buf.push(1.0);
                this.clr_buf.push(0.0);
                this.clr_buf.push(0.0);
            }
        }
    }
}
