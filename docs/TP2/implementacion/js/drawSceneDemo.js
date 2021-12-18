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
    capsule_controls) {

gl.uniformMatrix4fv(shader.getModelMatrixPtr(), false, modelMatrix);
gl.uniformMatrix4fv(shader.getViewMatrixPtr(), false, viewMatrix);
gl.uniformMatrix4fv(shader.getProjMatrixPtr(), false, projMatrix);
gl.uniformMatrix4fv(shader.getNormalMatrixPtr(), false, normalMatrix);

var capsule = new Capsule(shader, [1.0, 0.0, 0.0]);
capsule.setTexture(shader.getCapsuleTexture());
capsule.draw(capsule_controls.getMatrix());

var aux = mat4.create();
var aux2 = mat4.create();
mat4.fromScaling(aux2, [10.0, 10.0, 10.0]);
mat4.fromTranslation(aux, [0.0, 0.0, -15.0])
mat4.mul(aux, aux2, aux);
var cyl = new Cylinder(shader, [0.0, 0.0, 0.0]);
cyl.setTexture(shader.getEarthTexture());
// cyl.draw(aux);

mat4.fromTranslation(aux, [0.0, 2.0, -2.0]);
mat4.mul(aux, aux, aux2);
cyl.draw(aux);

mat4.fromTranslation(aux, [0.0, 0.0, 15.0]);
cyl.draw(aux);

mat4.fromTranslation(aux, [0.0, 15.0, 0.0]);
cyl.draw(aux);

mat4.fromTranslation(aux, [0.0, -15.0, 0.0]);
cyl.draw(aux);

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
