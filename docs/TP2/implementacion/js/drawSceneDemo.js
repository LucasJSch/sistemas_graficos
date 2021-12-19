// This function serves as an interface between the main js script that initializes the environment and the JS classes.
function drawSceneDemo(shader,
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


var coord = new Coordinates(shader);
coord.draw();

var space_station = new SpaceStation(shader, n_secciones_nucleo, 4, 0.0, rotacion_anillo);
space_station.setPanelsTexture(shader.getPanelTexture());
space_station.setModuloCilindricoTexture(shader.getModuloCilindricoTexture());
space_station.setModuloEsfericoTexture(shader.getModuloEsfericoTexture());
space_station.setModuloTexture(shader.getModuloTexture());
space_station.draw();

// var nucleus = new Nucleus(shader, [0.0, 0.0, 0.0]);
// nucleus.setTexture1(shader.getCapsuleTexture());
// nucleus.draw();

// var coord = new Coordinates(shader, [0.0, 0.0, 0.0]);
// coord.setTexture(shader.getPanelTexture());
// coord.draw();

var capsule = new Capsule(shader, [1.0, 0.0, 0.0]);
capsule.setTexture(shader.getCapsuleTexture());
capsule.draw(capsule_controls.getMatrix());

// var aux = mat4.create();

// var cyl = new Cube(shader, [0.0, 0.0, 0.0]);
// cyl.setTexture(shader.getEarthTexture());
// cyl.draw(aux);

// mat4.fromTranslation(aux, [2.0, 2.0, 0.0]);
// cyl.draw(aux);

// mat4.fromTranslation(aux, [3.0, 3.0, 0.0]);
// cyl.draw(aux);

// mat4.fromTranslation(aux, [4.0, 4.0, 0.0]);
// cyl.draw(aux);

// mat4.fromTranslation(aux, [5.0, 5.0, 0.0]);
// cyl.draw(aux);

// mat4.fromTranslation(aux, [6.0, 6.0, 0.0]);
// cyl.draw(aux);
// mat4.fromTranslation(aux, [7.0, 7.0, 0.0]);
// cyl.draw(aux);
// mat4.fromTranslation(aux, [8.0, 8.0, 0.0]);
// cyl.draw(aux);

// mat4.fromTranslation(aux, [0.0, -15.0, 0.0]);
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
