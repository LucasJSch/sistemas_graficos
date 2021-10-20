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

    var coordinates2 = new Coordinates(glProgram);
    t = mat4.create();
    t2 = mat4.create();
    mat4.fromScaling(t2, [5.0, 5.0, 5.0]);
    mat4.fromTranslation(t, [0.0, 0.0, 15.0]);
    mat4.mul(t, t, t2);
    coordinates2.draw(t);


    var levels = 60;
    var height = 5;
    var extrusion = new LinearExtrusion(glProgram, levels, /*vStartPos*/[0.0, 0.0, 0.0], /*vEndPos*/[0.0, 0.0, height], new ShapeGenerator(10, 5, [1.0, 0.0, 0.0]));
    var transf = mat4.create();
    mat4.fromTranslation(transf, [0.0, 0.0, 1.0]);
    extrusion.draw(transf);

}

class ShapeGenerator {
    getPosBuffer(central_pos) {
        var x_0 = central_pos[0];
        var y_0 =  central_pos[1];
        var z_0 = central_pos[2];
        
        var buffer = [];
        var n = 100;
        for (var i = 0; i < n; i++) {
            buffer.push(x_0 + 0.5*Math.cos(i * 2.0 * Math.PI / n));
            buffer.push(y_0 + 0.5*Math.sin(i * 2.0 * Math.PI / n));
            buffer.push(z_0);
        }
        return buffer;
    }
        
    getNormalBuffer(central_pos) {
        var buffer = [];
        var n = 100;
        for (var i = 0; i < n; i++) {
            buffer.push(0.0);
            buffer.push(0.0);
            buffer.push(1.0);
        }
        return buffer;
    }
        
    getColorBuffer(central_pos) {
        var buffer = [];
        var n = 100;
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