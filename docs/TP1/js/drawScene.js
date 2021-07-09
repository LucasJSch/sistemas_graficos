// This function serves as an interface between the main js script that initializes the environment and the JS classes.
function drawScene(glProgram, modelMatrix, viewMatrix, projMatrix, normalMatrix, controls) {

    var modelMatrixUniform = gl.getUniformLocation(glProgram, "modelMatrix");
    var viewMatrixUniform  = gl.getUniformLocation(glProgram, "viewMatrix");
    var projMatrixUniform  = gl.getUniformLocation(glProgram, "projMatrix");
    var normalMatrixUniform  = gl.getUniformLocation(glProgram, "normalMatrix");

    gl.uniformMatrix4fv(modelMatrixUniform, false, modelMatrix);
    gl.uniformMatrix4fv(viewMatrixUniform, false, viewMatrix);
    gl.uniformMatrix4fv(projMatrixUniform, false, projMatrix);
    gl.uniformMatrix4fv(normalMatrixUniform, false, normalMatrix);

    var coordinates = new Coordinates(glProgram);
    coordinates.draw();
    
    // var coordinates2 = new Coordinates(glProgram);
    // var aux = mat4.create();
    // mat4.fromTranslation(aux, [0.0, 12.0, 13.4]);
    // coordinates2.draw(aux);
    // Slide
    t_slide = mat4.create();
    t_slide_scale = mat4.create();
    mat4.fromScaling(t_slide_scale, [2.0, 2.0, 2.5]);
    mat4.fromTranslation(t_slide, [-20.0, 20.0, 0.0]);
    mat4.mul(t_slide, t_slide, t_slide_scale);
    var slide = new Slide(glProgram);
    slide.draw(t_slide);

    // Crane.
    t_crane = mat4.create();
    var t_crane_2 = mat4.create();
    mat4.fromTranslation(t_crane, [20, 20, 0]);
    mat4.fromRotation(t_crane_2, Math.PI, [0.0, 0.0, 1.0]);
    mat4.mul(t_crane, t_crane, t_crane_2);
    var crane = new Crane(glProgram, controls);
    crane.draw(t_crane);

    // Floor.
    t_floor_s = mat4.create();
    t_floor_t = mat4.create();
    mat4.fromScaling(t_floor_s, [1000.0, 1000.0, 0.0]);
    mat4.fromTranslation(t_floor_t, [-0.5, -0.5, 0.0]);
    mat4.mul(t_floor_t, t_floor_s, t_floor_t);
    var floor = new Plane(glProgram, [0.721, 0.737, 0.580]);
    floor.draw(t_floor_t);

    // Building.
    var firstPartFloors = controls.firstPartFloors;
    var secondPartFloors = controls.secondPartFloors;
    var columnsLongSide = columnsLongSide = controls.buildingColumnsAmount / 2;
    var columnsShortSide = controls.buildingColumnsAmount - columnsLongSide;

    var building = new Building(glProgram, firstPartFloors, secondPartFloors, columnsLongSide, columnsShortSide);
    building.draw();
}