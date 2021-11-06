// This function serves as an interface between the main js script that initializes the environment and the JS classes.
function drawScene(glProgram, modelMatrix, viewMatrix, projMatrix, normalMatrix, n_paneles_solares, angulo_paneles, vel_rotacion_anillo, n_secciones_nucleo) {

    var modelMatrixUniform = gl.getUniformLocation(glProgram, "modelMatrix");
    var viewMatrixUniform  = gl.getUniformLocation(glProgram, "viewMatrix");
    var projMatrixUniform  = gl.getUniformLocation(glProgram, "projMatrix");
    var normalMatrixUniform  = gl.getUniformLocation(glProgram, "normalMatrix");

    gl.uniformMatrix4fv(modelMatrixUniform, false, modelMatrix);
    gl.uniformMatrix4fv(viewMatrixUniform, false, viewMatrix);
    gl.uniformMatrix4fv(projMatrixUniform, false, projMatrix);
    gl.uniformMatrix4fv(normalMatrixUniform, false, normalMatrix);

    var aux_t = mat4.create();
    // var coordinates = new Coordinates(glProgram);
    // coordinates.draw();

    var space_station = new SpaceStation(glProgram, n_secciones_nucleo, n_paneles_solares);
    space_station.draw();

    var planet = new Planet(glProgram);
    var planet_t = mat4.create();
    mat4.fromScaling(planet_t, [100.0, 100.0, 100.0])
    mat4.fromTranslation(aux_t, [0.0, 0.0, -550.0]);
    mat4.mul(planet_t, aux_t, planet_t);
    planet.draw(planet_t);
}
