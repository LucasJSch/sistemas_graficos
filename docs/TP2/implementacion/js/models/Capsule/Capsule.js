class Capsule {
    // Draws the capsule.
    constructor(shader) {
        this.shader = shader;
        this.color = [0.0, 0.0, 0.0];
        this.color_aleron = [0.0, 0.0, 0.0];
        this.bezier_points = [[0.0, 0.0, 0.0], [0.0, 0.0, 0.0], [0.0, 0.0, 0.5], [0.0, 0.0, 0.5],
                              [0.0, 0.0, 0.5], [0.0, 0.0, 0.75], [0.0, 0.0, 0.75], [0.0, -0.3, 0.9],
                              [0.0, -0.3, 0.9], [0.0, -1.0, 0.9], [0.0, -2.0, 0.8], [0.0, -2.3, 0.5],
                              [0.0, -2.3, 0.5], [0.0, -2.3, 0.5], [0.0, -2.4, 0.25], [0.0, -2.4, 0.25],
                              [0.0, -2.4, 0.25], [0.0, -2.4, 0.25], [0.0, -2.5, 0.1], [0.0, -2.5, 0.1],
                              [0.0, -2.5, 0.1], [0.0, -2.5, 0.1], [0.0, 0.0, 0.0], [0.0, 0.0, 0.0]];
        this.bezier_concatenator = null;

        this.n_rows = 48.0;
        this.diferencial_rotacion = 2.0 * Math.PI / this.n_rows;
        this.ptos_longitudinal = 20.0;
        this.n_points_bezier = this.bezier_points.length / 4.0;

        this.pos_buf = [];
        this.nrm_buf = [];
        this.uv_buf = [];

        this.aleron_pos_buf = [];
        this.aleron_nrm_buf = [];

        this.red_light = new Cube(shader, [1.0, 0.0, 0.0]);
        this.green_light = new Cube(shader, [0.0, 1.0, 0.0]);

        this.utils = new Utils();

        this.front_pos = [0.0, -2.5, -0.05];
        this.back_pos = [0.0, 0, 0];
    }

    getDirection(transformMatrix) {
        var front = vec3.create();
        var back = vec3.create();
        vec3.transformMat4(front, this.front_pos, transformMatrix);
        vec3.transformMat4(back, this.back_pos, transformMatrix);
        return [front[0] - back[0], front[1] - back[1], front[2] - back[2]];
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
        
        var capsula = new Grid(this.shader, this.pos_buf, this.nrm_buf, this.color, /*n_rows=*/this.n_rows + 1.0, /*n_cols=*/this.ptos_longitudinal, this.uv_buf);
        capsula.setTexture(this.texture);
        var aleron = new Grid(this.shader, this.aleron_pos_buf, this.aleron_nrm_buf, this.color_aleron, /*n_rows=*/this.n_rows + 1.0, /*n_cols=*/this.ptos_longitudinal);
        gl.uniform1f(this.shader.getReflectionFactorPtr(), 0.5);
        capsula.draw(transformMatrix);
        gl.uniform1f(this.shader.getReflectionFactorPtr(), 0.0);
        aleron.draw(transformMatrix);

        var green_t = mat4.create();
        var red_t = mat4.create();
        var aux_t = mat4.create();
        mat4.fromScaling(green_t, [0.2, 0.2, 0.2]);
        mat4.fromScaling(red_t, [0.2, 0.2, 0.2]);
        mat4.fromTranslation(aux_t, [0.8, -1.5, -0.2]);
        mat4.mul(red_t, aux_t, red_t);
        mat4.fromTranslation(aux_t, [-0.8, -1.5, -0.2]);
        mat4.mul(green_t, aux_t, green_t);
        mat4.mul(green_t, transformMatrix, green_t);
        mat4.mul(red_t, transformMatrix, red_t);

        this.green_light.draw(green_t);
        this.red_light.draw(red_t);

        var spotlight_pos = vec3.clone(this.front_pos);
        vec3.transformMat4(spotlight_pos, spotlight_pos, transformMatrix);

        var aux = vec3.create();
        gl.uniform3fv(this.shader.getCapsuleSpotlightPosPtr(), spotlight_pos);
        gl.uniform3fv(this.shader.getCapsuleSpotlightDirPtr(), this.getDirection(transformMatrix));
        gl.uniform3fv(this.shader.getCapsuleGreenLightPosPtr(), vec3.transformMat4(aux, vec3.clone(this.front_pos), green_t));
        gl.uniform3fv(this.shader.getCapsuleRedLightPosPtr(), vec3.transformMat4(aux, vec3.clone(this.front_pos), red_t));
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
        var nrm_base = [];
        for (var i = 0; i < this.ptos_longitudinal; i++) {
            var aux = this.bezier_concatenator.getPoint(this.n_points_bezier * i / this.ptos_longitudinal);
            ptos_base.push(aux[0]);
            ptos_base.push(aux[1]);
            ptos_base.push(aux[2]);

            aux = this.bezier_concatenator.getSecondDerivative(this.n_points_bezier * i / this.ptos_longitudinal);
            nrm_base.push(aux[0]);
            nrm_base.push(aux[1]);
            nrm_base.push(aux[2]);
        }

        var t_rotacion = mat4.create();
        for (var rotacion = 0.0; rotacion <= 2.0 * Math.PI; rotacion += this.diferencial_rotacion) {
            mat4.fromRotation(t_rotacion, rotacion, [0.0, -1.0, 0.0]);
            const ptos_rotados = this.utils.TransformPosBuffer(t_rotacion, ptos_base);
            const nrm_rotados = this.utils.TransformPosBuffer(t_rotacion, nrm_base);
            for (var elem of ptos_rotados) {
                this.pos_buf.push(elem);
            }
            for (var elem of nrm_rotados) {
                this.nrm_buf.push(-elem);
            }
            for (var i = 0; i < ptos_rotados.length; i+=3) {
                this.uv_buf.push(2.0 * i / ptos_rotados.length);
                this.uv_buf.push(1.0 * rotacion / Math.PI);
            }
        }

        var t = mat4.create();
        var aux = mat4.create();
        mat4.fromScaling(t, [0.5, 0.5, 0.75]);
        mat4.fromTranslation(aux, [0.0, 1.0, 0.0]);
        mat4.mul(t, aux, t);
        this.aleron_pos_buf = this.utils.TransformPosBuffer(t, this.pos_buf);
        this.aleron_nrm_buf = Array.from(this.nrm_buf);
    }
}
