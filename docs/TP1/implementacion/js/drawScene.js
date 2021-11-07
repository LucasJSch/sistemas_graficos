// This function serves as an interface between the main js script that initializes the environment and the JS classes.
function drawScene(glProgram,
                   modelMatrix,
                   viewMatrix,
                   projMatrix,
                   normalMatrix,
                   n_paneles_solares,
                   angulo_paneles,
                   rotacion_anillo,
                   n_secciones_nucleo,
                   capsule_controls) {

    var modelMatrixUniform = gl.getUniformLocation(glProgram, "modelMatrix");
    var viewMatrixUniform  = gl.getUniformLocation(glProgram, "viewMatrix");
    var projMatrixUniform  = gl.getUniformLocation(glProgram, "projMatrix");
    var normalMatrixUniform  = gl.getUniformLocation(glProgram, "normalMatrix");

    gl.uniformMatrix4fv(modelMatrixUniform, false, modelMatrix);
    gl.uniformMatrix4fv(viewMatrixUniform, false, viewMatrix);
    gl.uniformMatrix4fv(projMatrixUniform, false, projMatrix);
    gl.uniformMatrix4fv(normalMatrixUniform, false, normalMatrix);

    var aux_t = mat4.create();

    var coord = new Coordinates(glProgram);
    coord.draw();

    var capsule = new Capsule(glProgram);
    
    mat4.fromTranslation(aux_t, [capsule_controls.x, capsule_controls.y, capsule_controls.z]);
    mat4.mul(capsule_controls.current_t, capsule_controls.current_t, aux_t);
    
    mat4.fromRotation(aux_t, capsule_controls.roll_angle, [0.0, 0.0, 1.0]);
    mat4.mul(capsule_controls.current_t, capsule_controls.current_t, aux_t);
    
    mat4.fromRotation(aux_t, capsule_controls.pitch_angle, [1.0, 0.0, 0.0]);
    mat4.mul(capsule_controls.current_t, capsule_controls.current_t, aux_t);

    capsule_controls.x = 0;
    capsule_controls.y = 0;
    capsule_controls.z = 0;
    capsule_controls.roll_angle = 0;
    capsule_controls.pitch_angle = 0;

    var space_station = new SpaceStation(glProgram, n_secciones_nucleo, n_paneles_solares, angulo_paneles, rotacion_anillo);
    
    var planet = new Planet(glProgram);
    var planet_t = mat4.create();
    mat4.fromScaling(planet_t, [100.0, 100.0, 100.0])
    mat4.fromTranslation(aux_t, [0.0, 0.0, -550.0]);
    mat4.mul(planet_t, aux_t, planet_t);
    
    space_station.draw();
    planet.draw(planet_t);
    capsule.draw(capsule_controls.current_t);
}
