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
    coordinates.draw(mat4.create());

    var concatenator = new CuadraticBsplineConcatenator([[0.0, -2.0, 0.0], [0.0, 0.0, 0.0], [-2.0, 0.0, 0.0], [-2.0, 2.0, 0.0], [0.0, 2.0, 0.0]]);
    for (var i = 0.0; i < 3.0; i+=0.05) {
        var dist = concatenator.getPoint(i);
        var t = mat4.create();
        vec3.scale(dist, dist, 3.0);
        var cube = new Cube(glProgram, [1.0, 0.0, 0.0]);
        var aux = mat4.create();
        mat4.fromScaling(aux, [0.1, 0.1, 0.1]);
        mat4.fromTranslation(t, dist);
        mat4.mul(t, t, aux);
        cube.draw(t);
    }
}