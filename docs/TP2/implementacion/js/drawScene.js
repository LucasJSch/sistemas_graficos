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
                   capsule_controls,
                   time) {

    gl.uniformMatrix4fv(shader.getModelMatrixPtr(), false, modelMatrix);
    gl.uniformMatrix4fv(shader.getViewMatrixPtr(), false, viewMatrix);
    gl.uniformMatrix4fv(shader.getProjMatrixPtr(), false, projMatrix);
    gl.uniformMatrix4fv(shader.getNormalMatrixPtr(), false, normalMatrix);

    var aux_t = mat4.create();
    mat4.fromScaling(aux_t, [10.0, 10.0, 10.0]);

    var capsule = new Capsule(shader, [1.0, 0.0, 0.0]);
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
    mat4.fromRotation(aux_t, time * 0.01, [1.0, 0.0, 0.0]);
    mat4.mul(earth_t, earth_t, aux_t);

    var sun = new Planet(shader);
    sun.setTexture(shader.getSunTexture());
    var sun_t = mat4.create();
    mat4.fromScaling(sun_t, [10.0, 10.0, 10.0])
    mat4.fromRotation(aux_t, 0.0 * Math.PI/3.0, [0.0, 1.0, 0.0])
    mat4.mul(sun_t, aux_t, sun_t);
    mat4.fromTranslation(aux_t, [200.0, 0.0, 30.0]);
    mat4.mul(sun_t, aux_t, sun_t);

    var moon = new Planet(shader);
    moon.setTexture(shader.getMoonTexture());
    var moon_t = mat4.create();
    mat4.fromScaling(moon_t, [10.0, 10.0, 10.0])
    mat4.fromRotation(aux_t, 0.0 * Math.PI/3.0, [0.0, 1.0, 0.0])
    mat4.mul(moon_t, aux_t, moon_t);
    mat4.fromTranslation(aux_t, [-200.0, 0.0, 30.0]);
    mat4.mul(moon_t, aux_t, moon_t);

    space_station.draw();
    earth.draw(earth_t);
    sun.draw(sun_t);
    moon.draw(moon_t);
    capsule.draw(capsule_controls.getMatrix());

    var surrounding = new Sphere(shader, [0.0, 0.0, 0.0]);
    surrounding.setTexture(shader.getSpaceTexture());
    mat4.fromScaling(aux_t, [300.0, 300.0, 300.0]);
    surrounding.draw(aux_t);
}
