// This function serves as an interface between the main js script that initializes the environment and the JS classes.
function drawScene(glProgram, modelMatrix, viewMatrix, projMatrix, normalMatrix) {

    var modelMatrixUniform = gl.getUniformLocation(glProgram, "modelMatrix");
    var viewMatrixUniform  = gl.getUniformLocation(glProgram, "viewMatrix");
    var projMatrixUniform  = gl.getUniformLocation(glProgram, "projMatrix");
    var normalMatrixUniform  = gl.getUniformLocation(glProgram, "normalMatrix");

    gl.uniformMatrix4fv(modelMatrixUniform, false, modelMatrix);
    gl.uniformMatrix4fv(viewMatrixUniform, false, viewMatrix);
    gl.uniformMatrix4fv(projMatrixUniform, false, projMatrix);
    gl.uniformMatrix4fv(normalMatrixUniform, false, normalMatrix);

    var coordinates = new Coordinates(glProgram);
    coordinates.draw();

    var coordinates2 = new Coordinates(glProgram);
    t = mat4.create();
    t2 = mat4.create();
    mat4.fromScaling(t2, [5.0, 5.0, 5.0]);
    mat4.fromTranslation(t, [0.0, 0.0, 15.0]);
    mat4.mul(t, t, t2);
    coordinates2.draw(t);

    var building = new Building(glProgram);
    building.draw();

    // t = mat4.create();
    // mat4.fromTranslation(t, [20, 20, 0]);
    // var crane = new Crane(glProgram);
    // crane.draw(t);
}