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

    // Coordinates.
    var coordinates = new Coordinates(glProgram);
    coordinates.draw();

    // Building.
    // var building = new Building(glProgram);
    // building.draw();

    // Slide
    t_slide = mat4.create();
    mat4.fromTranslation(t_slide, [0.0, 0.0, 0.0]);
    var slide = new Slide(glProgram);
    slide.draw();

    // Crane.
    // t_crane = mat4.create();
    // mat4.fromTranslation(t_crane, [20, 20, 0]);
    // var crane = new Crane(glProgram);
    // crane.draw(t_crane);

    // Floor.
    // t_floor_s = mat4.create();
    // t_floor_t = mat4.create();
    // mat4.fromScaling(t_floor_s, [1000.0, 1000.0, 0.0]);
    // mat4.fromTranslation(t_floor_t, [-0.5, -0.5, 0.0]);
    // mat4.mul(t_floor_t, t_floor_s, t_floor_t);
    // var floor = new Plane(glProgram, [0.721, 0.737, 0.580]);
    // floor.draw(t_floor_t);
}