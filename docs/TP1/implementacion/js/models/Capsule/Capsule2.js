class Capsule2 {
    // Draws the capsule.
    constructor(glProgram) {
        this.glProgram = glProgram;
        this.color = [0.823529412, 0.662745098, 0.53333333];
        this.bezier_points = [[0.0, 0.0, 0.0], [0.0, -0.1, 0.5], [0.0, -0.1, 0.5], [0.0, -2.0, 0.9], [0.0, -2.0, 0.9], [0.0, -2.0, 0.85], [0.0, -5.0, 0.6], [0.0, -8.0, 0.1]];
        this.bezier_concatenator = null;
        this.slide_shapeGen = new CapsuleSG(this.color);
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
                //&&&&&&&&&&&&&&&&&&&&&&&&&& TODO: Change this
                this.nrm_buf.push(1.0);
                this.clr_buf.push(0.5);
                //&&&&&&&&&&&&&&&&&&&&&&&&&&
            }
        }

        // for (var i = 0; i < ptos_base.length; i++) {
        //     this.pos_buf.push(this.pos_buf[i]);
        //     this.nrm_buf.push(1.0);
        //     this.clr_buf.push(0.5);
        // }

        console.log(this.pos_buf.length);
    }
}

class CapsuleSG {
    constructor(vColor) {
        this.vColor = vColor;
        this.resolution = 50;
        this.x_radius = 0.25;
        this.y_radius = 0.5;
        this.x_offset = 0.75;
        this.y_offset = 0.0;
    }

    // Percentage va de [0; 1]
    getPositionBuffer(percentage) {
        
        var buffer = [];
        for (var i = 0; i < this.resolution-1; i++) {
            buffer.push(x_0 + this.x_radius*Math.cos(-i * 2.0 * Math.PI / (this.resolution*2)) + this.x_offset);
            buffer.push(y_0 + this.y_radius*Math.sin(-i * 2.0 * Math.PI / (this.resolution*2)) + this.y_offset);
            buffer.push(z_0);
        }

        buffer.push(buffer[0]);
        buffer.push(buffer[1]);
        buffer.push(buffer[2]);

        return buffer;
    }

    // No es necesario ya que lo usamos para sup. de rev.
    getNormalBuffer(central_pos) {
        return [];
    }

    getColorBuffer(central_pos) {
        return this.vColor;
    }
}