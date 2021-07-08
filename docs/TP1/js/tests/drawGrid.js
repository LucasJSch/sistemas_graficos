function drawScene(glProgram, modelMatrix, viewMatrix, projMatrix, normalMatrix) {

    var modelMatrixUniform = gl.getUniformLocation(glProgram, "modelMatrix");
    var viewMatrixUniform  = gl.getUniformLocation(glProgram, "viewMatrix");
    var projMatrixUniform  = gl.getUniformLocation(glProgram, "projMatrix");
    var normalMatrixUniform  = gl.getUniformLocation(glProgram, "normalMatrix");

    gl.uniformMatrix4fv(modelMatrixUniform, false, modelMatrix);
    gl.uniformMatrix4fv(viewMatrixUniform, false, viewMatrix);
    gl.uniformMatrix4fv(projMatrixUniform, false, projMatrix);
    gl.uniformMatrix4fv(normalMatrixUniform, false, normalMatrix);


    var central_pos = [0.0, 0.0, 0.0];
    var n_rows = 5;
    var n_cols = 5;
    var grid = new Grid(glProgram, fShapePos(central_pos), fShapeNormal(central_pos), fShapeColor(central_pos), n_rows, n_cols);
    grid.draw();
}

function fShapePos(central_pos) {
    var x_0 = central_pos[0];
    var y_0 =  central_pos[1];
    var z_0 = central_pos[2];

    var buffer = [];
    var n = 10;
    for (var i = 0; i < 10; i++) {
        buffer.push(x_0 + Math.cos(i * 2.0 * Math.PI / n));
        buffer.push(y_0 + Math.sin(i * 2.0 * Math.PI / n));
        buffer.push(z_0);
    }
    return buffer;
}

function fShapeNormal(central_pos) {
    var buffer = [];
    var n = 10;
    for (var i = 0; i < 10; i++) {
        buffer.push(0.0);
        buffer.push(0.0);
        buffer.push(1.0);
    }
    return buffer;
}

function fShapeColor(central_pos) {
    var buffer = [];
    var n = 10;
    for (var i = 0; i < 10; i++) {
        buffer.push(1.0);
        buffer.push(i/10);
        buffer.push(1.0);
    }
    return buffer;
}