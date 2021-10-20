function drawScene(glProgram, modelMatrix, viewMatrix, projMatrix, normalMatrix) {

    var modelMatrixUniform = gl.getUniformLocation(glProgram, "modelMatrix");
    var viewMatrixUniform  = gl.getUniformLocation(glProgram, "viewMatrix");
    var projMatrixUniform  = gl.getUniformLocation(glProgram, "projMatrix");
    var normalMatrixUniform  = gl.getUniformLocation(glProgram, "normalMatrix");

    gl.uniformMatrix4fv(modelMatrixUniform, false, modelMatrix);
    gl.uniformMatrix4fv(viewMatrixUniform, false, viewMatrix);
    gl.uniformMatrix4fv(projMatrixUniform, false, projMatrix);
    gl.uniformMatrix4fv(normalMatrixUniform, false, normalMatrix);

    var pos = [];
    var normals = [];
    var colors = [];
    var n_vertices = 3;
    var step = 1/n_vertices;
    for (var i = 0; i < n_vertices; i++) {
            pos.push(i * step - 0.75)
            pos.push(i*i * 0.15 - 0.5);
            pos.push(0);

            normals.push(0.0);
            normals.push(0.0);
            normals.push(1.0);

            colors.push(0.0);
            colors.push(i * step);
            colors.push(0.5);
    }
    var fan = new Fan(glProgram, pos, normals, colors);
    fan.draw();
}