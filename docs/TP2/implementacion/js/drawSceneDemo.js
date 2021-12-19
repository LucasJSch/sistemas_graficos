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


var capsule = new Capsule(shader, [1.0, 0.0, 0.0]);
capsule.setTexture(shader.getCapsuleTexture());
capsule.draw(capsule_controls.getMatrix());

var plane = new Cube(shader, [1.0, 1.0, 1.0]);

var plane_t = mat4.create();
var aux = mat4.create();
mat4.fromScaling(plane_t, [50, 50, 50]);
// mat4.fromRotation(aux, Math.PI/2.0, [1.0, 0.0, 0.0]);
// mat4.mul(plane_t, aux, plane_t);
mat4.fromTranslation(aux, [-10.0, -7.0, -10.0]);
mat4.mul(plane_t, aux, plane_t);

plane.draw(plane_t);
}