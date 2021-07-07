function drawScene(glProgram, modelMatrix, viewMatrix, projMatrix, normalMatrix) {

    var modelMatrixUniform = gl.getUniformLocation(glProgram, "modelMatrix");
    var viewMatrixUniform  = gl.getUniformLocation(glProgram, "viewMatrix");
    var projMatrixUniform  = gl.getUniformLocation(glProgram, "projMatrix");
    var normalMatrixUniform  = gl.getUniformLocation(glProgram, "normalMatrix");

    gl.uniformMatrix4fv(modelMatrixUniform, false, modelMatrix);
    gl.uniformMatrix4fv(viewMatrixUniform, false, viewMatrix);
    gl.uniformMatrix4fv(projMatrixUniform, false, projMatrix);
    gl.uniformMatrix4fv(normalMatrixUniform, false, normalMatrix);

    var coord = new Coordinates(glProgram);
    coord.draw();

    var coordinates2 = new Coordinates(glProgram);
    t = mat4.create();
    t2 = mat4.create();
    mat4.targetTo(t, [0.0, 0.0, 0.0], [1.0, 0.0, 0.0], [0.9, 0.0, 0.0]);
    console.log(mat4.str(t));
    mat4.fromTranslation(t2, [0.0, 0.0, 5.3]);
    mat4.mul(t, t2, t);
    coordinates2.draw(t);


    // var levels = 60;
    // var shapeGen = new shapeGen();
    // var curveGen = new CurveGen();
    // var curveLength = 15;
    // var extrusion = new Extrusion(glProgram, levels, shapeGen, curveGen, curveLength);
    // var transf = mat4.create();
    // mat4.fromTranslation(transf, [0.0, 0.0, 0.0]);
    // extrusion.draw(transf);

}

class ShapeGen {
    constructor(glProgram) {
        this.vColor = [0.7, 0.4, 0.4];
    }

    getShape() {
        return new Cylinder(glProgram, this.vColor);
    }
}