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

    // var aux_t = mat4.create();
    // mat4.fromTranslation(aux_t, [180.0, 0.0, 30.0]);

    var coord = new Coordinates(shader);
    coord.setTexture(shader.getPanelTexture());
    coord.draw();

    var capsule = new Capsule(shader);
    capsule.setTexture(shader.getCapsuleTexture());
    
    var space_station = new SpaceStation(shader, n_secciones_nucleo, n_paneles_solares, angulo_paneles, rotacion_anillo);
    space_station.setPanelsTexture(shader.getPanelTexture());
    space_station.setModuloCilindricoTexture(shader.getModuloCilindricoTexture());
    space_station.setModuloEsfericoTexture(shader.getModuloEsfericoTexture());
    space_station.setModuloTexture(shader.getModuloTexture());
    
    var earth = new Planet(shader);
    earth.setTexture(shader.getEarthTexture());
    var earth_t = mat4.create();
    mat4.fromScaling(earth_t, [50.0, 50.0, 50.0])
    mat4.fromTranslation(aux_t, [0.0, 0.0, -100.0]);
    mat4.mul(earth_t, aux_t, earth_t);

    var sun = new Planet(shader);
    sun.setTexture(shader.getSunTexture());
    var sun_t = mat4.create();
    mat4.fromScaling(sun_t, [10.0, 10.0, 10.0])
    mat4.fromRotation(aux_t, 0.0 * Math.PI/3.0, [0.0, 1.0, 0.0])
    mat4.mul(sun_t, aux_t, sun_t);
    mat4.fromTranslation(aux_t, [200.0, 0.0, 30.0]);
    mat4.mul(sun_t, aux_t, sun_t);

    // space_station.draw();
    earth.draw(earth_t);
    sun.draw(sun_t);
    // capsule.draw(capsule_controls.getMatrix());

    // var aux = mat4.create();
    // mat4.fromTranslation(aux, [0.0, 0.0, -5.0]);
    // var cyl = new Cylinder(shader, [1.0, 0.0, 0.0]);
    // cyl.setTexture(shader.getEarthTexture());
    // cyl.draw(aux);

    // mat4.fromTranslation(aux, [0.0, 0.0, 5.0]);
    // cyl.draw(aux);

    // mat4.fromTranslation(aux, [0.0, 5.0, 0.0]);
    // cyl.draw(aux);

    // mat4.fromTranslation(aux, [0.0, -5.0, 0.0]);
    // cyl.draw(aux);

    // mat4.fromTranslation(aux, [5.0, 0.0, 0.0]);
    // cyl.draw(aux);

    // mat4.fromTranslation(aux, [-5.0, 0.0, 0.0]);
    // cyl.draw(aux);

    // mat4.fromTranslation(aux, [5.0, 5.0, 0.0]);
    // cyl.draw(aux);

    // mat4.fromTranslation(aux, [5.0, -5.0, 0.0]);
    // cyl.draw(aux);

    // mat4.fromTranslation(aux, [-5.0, 5.0, 0.0]);
    // cyl.draw(aux);

    // mat4.fromTranslation(aux, [-5.0, -5.0, 0.0]);
    // cyl.draw(aux);

    // mat4.fromTranslation(aux, [5.0, 5.0, 5.0]);
    // cyl.draw(aux);

    // mat4.fromTranslation(aux, [5.0, -5.0, 5.0]);
    // cyl.draw(aux);

    // mat4.fromTranslation(aux, [-5.0, 5.0, 5.0]);
    // cyl.draw(aux);

    // mat4.fromTranslation(aux, [-5.0, -5.0, 5.0]);
    // cyl.draw(aux);

    // mat4.fromTranslation(aux, [5.0, 5.0, -5.0]);
    // cyl.draw(aux);

    // mat4.fromTranslation(aux, [5.0, -5.0, -5.0]);
    // cyl.draw(aux);

    // mat4.fromTranslation(aux, [-5.0, 5.0, -5.0]);
    // cyl.draw(aux);

    // mat4.fromTranslation(aux, [-5.0, -5.0, -5.0]);
    // cyl.draw(aux);
}
