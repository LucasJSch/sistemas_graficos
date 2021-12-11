var mat4 = glMatrix.mat4;
var mat3 = glMatrix.mat3;
var vec3 = glMatrix.vec3;
var vec4 = glMatrix.vec4;

var n_paneles_solares = 4.0;
var angulo_paneles = 0.0;
var vel_rotacion_anillo = 0.0;
var n_secciones_nucleo = 2.0;

var gl = null;
var canvas = null;

var aux_t = mat4.create();
var capsule_t = mat4.create();
mat4.fromRotation(aux_t, Math.PI, [1.0, 0.0, 0.0]);
mat4.fromTranslation(capsule_t, [0.0, -13.0, 0.0]);
mat4.mul(capsule_t, capsule_t, aux_t);

var capsule_controls = new SceneControls(capsule_t);

var modelMatrix = mat4.create();
var viewMatrix = mat4.create();
var projMatrix = mat4.create();
var normalMatrix = mat4.create();
var rotacion_anillo = 0;


var camera = new Camera(capsule_controls);
camera.initialize();

// var global;
var MAIN_SHADER_PROGRAM;

function onResize() {
    gl.canvas.width = $canvas.width();
    gl.canvas.height = $canvas.height();
    aspect = $canvas.width() / $canvas.height();
}

function _rgbToFloat(r,g,b) {
    return [r/256, g/256, b/256];
}

function setupWebGL() {

    gl.enable(gl.DEPTH_TEST);
    //set the clear color
    // gl.clearColor(0.1, 0.1, 0.2, 1.0);     
    // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);     

    gl.viewport(0, 0, canvas.width, canvas.height);

    // Matrix de Proyeccion Perspectiva
    mat4.perspective(projMatrix,45, canvas.width / canvas.height, 0.1, 100000.0);
    
    mat4.identity(modelMatrix);
    // mat4.rotate(modelMatrix, modelMatrix, Math.PI, [0.0, 0.0, 1.0]);

}

function initMenu() {
    var gui = new dat.GUI();
    gui.add(window, "n_paneles_solares", 1, 10).step(1);
    gui.add(window, "angulo_paneles", 0, Math.PI * 2.0).step(0.1);
    gui.add(window, "vel_rotacion_anillo", 0, 5.0).step(0.1);
    gui.add(window, "n_secciones_nucleo", 2, 8).step(1);
}

function animate(){
    rotacion_anillo += 0.1 * vel_rotacion_anillo;


    camera.update();
    viewMatrix = camera.getMatrix();

    mat4.identity(modelMatrix);
    mat4.identity(normalMatrix);
    mat4.multiply(normalMatrix, viewMatrix, modelMatrix);
    mat4.invert(normalMatrix, normalMatrix);
    mat4.transpose(normalMatrix, normalMatrix);
}

function tick() {
    requestAnimationFrame(tick);
    drawScene(MAIN_SHADER_PROGRAM,
              modelMatrix,
              viewMatrix,
              projMatrix,
              normalMatrix,
              n_paneles_solares,
              angulo_paneles,
              rotacion_anillo,
              n_secciones_nucleo,
              capsule_controls);
    animate();
}

function webGLStart() {

    canvas = document.getElementById("my-canvas");

    try{
        gl = canvas.getContext("webgl");      

    } catch(e) {
        alert("Error: Your browser does not appear to support WebGL.");
    }

    if(gl) {

        setupWebGL();
        initMenu(); 

        MAIN_SHADER_PROGRAM = new MainProgram();
        MAIN_SHADER_PROGRAM.setearParametros();
        tick();

    } else{    
        alert("Error: Your browser does not appear to support WebGL.");
    }
}

function main() {
    loadShaders(webGLStart);
}