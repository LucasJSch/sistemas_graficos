function drawScene(glProgram, modelMatrix, viewMatrix, projMatrix, normalMatrix){

    var modelMatrixUniform = gl.getUniformLocation(glProgram, "modelMatrix");
    var viewMatrixUniform  = gl.getUniformLocation(glProgram, "viewMatrix");
    var projMatrixUniform  = gl.getUniformLocation(glProgram, "projMatrix");
    var normalMatrixUniform  = gl.getUniformLocation(glProgram, "normalMatrix");

    gl.uniformMatrix4fv(modelMatrixUniform, false, modelMatrix);
    gl.uniformMatrix4fv(viewMatrixUniform, false, viewMatrix);
    gl.uniformMatrix4fv(projMatrixUniform, false, projMatrix);
    gl.uniformMatrix4fv(normalMatrixUniform, false, normalMatrix);

    var plane = new Plane(glProgram, /*X0=*/[-0.5, -0.5, 0.0], /*X1=*/[0.0, 0.0, 1.0], /*vNormal=*/[0.0, 0.5, 0.5], /*vColor=*/[1.0, 0.0, 0.0], /*n_rows=*/100.0, /*n_cols=*/100.0);
    plane.draw();
}