function drawScene(glProgram, modelMatrix, viewMatrix, projMatrix, normalMatrix) {

    var modelMatrixUniform = gl.getUniformLocation(glProgram, "modelMatrix");
    var viewMatrixUniform  = gl.getUniformLocation(glProgram, "viewMatrix");
    var projMatrixUniform  = gl.getUniformLocation(glProgram, "projMatrix");
    var normalMatrixUniform  = gl.getUniformLocation(glProgram, "normalMatrix");

    gl.uniformMatrix4fv(modelMatrixUniform, false, modelMatrix);
    gl.uniformMatrix4fv(viewMatrixUniform, false, viewMatrix);
    gl.uniformMatrix4fv(projMatrixUniform, false, projMatrix);
    gl.uniformMatrix4fv(normalMatrixUniform, false, normalMatrix);

    var levels = 2;
    var extrusion = new LinearExtrusion(glProgram, levels, /*vStartPos*/[-0.0, -0.0, 0.0], /*vEndPos*/[0.521, 0.521, 0.0], fShapePos, fShapeNormal, fShapeColor);
    extrusion.draw();

}

function fShapePos(central_pos) {
    var x_0 = central_pos[0];
    var y_0 =  central_pos[1];
    var z_0 = central_pos[2];

    var buffer = [];
    var n = 50;
    for (var i = 0; i < n; i++) {
        buffer.push(x_0 + 0.3*Math.cos(i * 2.0 * Math.PI / n));
        buffer.push(y_0 + 0.3*Math.sin(i * 2.0 * Math.PI / n));
        buffer.push(z_0);
    }
    return buffer;
}

function fShapeNormal(central_pos) {
    var buffer = [];
    var n = 50;
    for (var i = 0; i < n; i++) {
        buffer.push(0.0);
        buffer.push(0.0);
        buffer.push(1.0);
    }
    return buffer;
}

function fShapeColor(central_pos) {
    var buffer = [];
    var n = 50;
    for (var i = 0; i < n/5; i++) {
        buffer.push(0.5);
        buffer.push(0.0);
        buffer.push(0.5);
    }
    for (var i = 0; i < n/5; i++) {
        buffer.push(1.0);
        buffer.push(0.3);
        buffer.push(0.5);
    }
    for (var i = 0; i < n/5; i++) {
        buffer.push(1.0);
        buffer.push(0.5);
        buffer.push(0.0);
    }
    for (var i = 0; i < n/5; i++) {
        buffer.push(0.0);
        buffer.push(0.5);
        buffer.push(1.0);
    }
    for (var i = 0; i < n/5; i++) {
        buffer.push(0.0);
        buffer.push(1.0);
        buffer.push(0.75);
    }
    return buffer;
}