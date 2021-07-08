function drawScene(glProgram, modelMatrix, viewMatrix, projMatrix, normalMatrix) {

    var modelMatrixUniform = gl.getUniformLocation(glProgram, "modelMatrix");
    var viewMatrixUniform  = gl.getUniformLocation(glProgram, "viewMatrix");
    var projMatrixUniform  = gl.getUniformLocation(glProgram, "projMatrix");
    var normalMatrixUniform  = gl.getUniformLocation(glProgram, "normalMatrix");

    gl.uniformMatrix4fv(modelMatrixUniform, false, modelMatrix);
    gl.uniformMatrix4fv(viewMatrixUniform, false, viewMatrix);
    gl.uniformMatrix4fv(projMatrixUniform, false, projMatrix);
    gl.uniformMatrix4fv(normalMatrixUniform, false, normalMatrix);

    var coord = new Coordinates(glProgram);
    coord.draw();

    var levels = 50;
    var shapeGen = new ShapeGen2(glProgram);
    var bezier = new CubicBezierConcatenator([[0.0, 0.0, 0.0], [-2.0, 0.0, 0.2], [-2.0, -1.0, 0.4], [0.0, -1.0, 0.6], [0.0, -1.0, 0.8], [2.0, -1.0, 1.0], [2.0, 0.0, 1.2], [0.0, 0.0, 1.4]]);
    var extrusion = new Extrusion(glProgram, levels, shapeGen, bezier);
    var transf = mat4.create();
    mat4.fromTranslation(transf, [0.0, 0.0, 0.0]);
    extrusion.draw(transf);

}

class ShapeGen2 {
    constructor(glProgram) {
        this.vColor = [0.7, 0.4, 0.4];
    }

    getPositionBuffer(central_pos) {
        var x_0 = central_pos[0];
        var y_0 =  central_pos[1];
        var z_0 = central_pos[2];
        
        var buffer = [];
        var n = 9;
        for (var i = 0; i < n-1; i++) {
            buffer.push(x_0 + 0.5*Math.cos(i * 2.0 * Math.PI / n));
            buffer.push(y_0 + 0.5*Math.sin(i * 2.0 * Math.PI / n));
            buffer.push(z_0);
        }

        buffer.push(buffer[0]);
        buffer.push(buffer[1]);
        buffer.push(buffer[2]);

        return buffer;
    }
        
    getNormalBuffer(central_pos) {
        var buffer = [];
        var n = 10;
        for (var i = 0; i < n; i++) {
            buffer.push(0.0);
            buffer.push(0.0);
            buffer.push(1.0);
        }
        return buffer;
    }
        
    getColorBuffer(central_pos) {
        var buffer = [];
        var n = 10;
        // Rojo.
        for (var i = 0; i < n/5; i++) {
            buffer.push(1.0);
            buffer.push(0.0);
            buffer.push(0.0);
        }
        // Amarillo.
        for (var i = 0; i < n/5; i++) {
            buffer.push(1.0);
            buffer.push(1.0);
            buffer.push(0.0);
        }
        // Verde.
        for (var i = 0; i < n/5; i++) {
            buffer.push(0.0);
            buffer.push(1.0);
            buffer.push(0.0);
        }
        // Azul.
        for (var i = 0; i < n/5; i++) {
            buffer.push(0.0);
            buffer.push(0.0);
            buffer.push(1.0);
        }
        // Negro.
        for (var i = 0; i < n/5; i++) {
            buffer.push(0.0);
            buffer.push(0.0);
            buffer.push(0.0);
        }
        return buffer;
    }
}