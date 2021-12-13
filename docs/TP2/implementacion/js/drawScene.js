// This function serves as an interface between the main js script that initializes the environment and the JS classes.
function drawScene(shader,
                   modelMatrix,
                   viewMatrix,
                   projMatrix,
                   normalMatrix,
                   n_paneles_solares,
                   angulo_paneles,
                   rotacion_anillo,
                   n_secciones_nucleo,
                   capsule_controls) {

    gl.uniformMatrix4fv(shader.getModelMatrixPtr(), false, modelMatrix);
    gl.uniformMatrix4fv(shader.getViewMatrixPtr(), false, viewMatrix);
    gl.uniformMatrix4fv(shader.getProjMatrixPtr(), false, projMatrix);
    gl.uniformMatrix4fv(shader.getNormalMatrixPtr(), false, normalMatrix);

    // var coord = new Coordinates(shader);
    // coord.setTexture(shader.getPanelTexture());
    // coord.draw();

    var aux_t = mat4.create();
    var capsule = new Capsule(shader);
    capsule.setTexture(shader.getCapsuleTexture());
    
    var space_station = new SpaceStation(shader, n_secciones_nucleo, n_paneles_solares, angulo_paneles, rotacion_anillo);
    space_station.setPanelsTexture(shader.getPanelTexture());
    space_station.setModuloCilindricoTexture(shader.getModuloCilindricoTexture());
    space_station.setModuloEsfericoTexture(shader.getModuloEsfericoTexture());
    space_station.setModuloTexture(shader.getModuloTexture());
    
    var planet = new Planet(shader);
    planet.setTexture(shader.getEarthTexture());
    var planet_t = mat4.create();
    mat4.fromScaling(planet_t, [50.0, 50.0, 50.0])
    mat4.fromTranslation(aux_t, [0.0, 0.0, -100.0]);
    mat4.mul(planet_t, aux_t, planet_t);
    
    space_station.draw();
    planet.draw(planet_t);
    capsule.draw(capsule_controls.getMatrix());
}
