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

    var levels = 10;
    var shapeGen = new ShapeGen(glProgram);
    var bezier = new CubicBezierConcatenator([[0.0, 0.0, 0.0], [-2.0, 0.0, 0.0], [-2.0, -1.0, 0.0], [0.0, -1.0, 0.0], [0.0, -1.0, 0.0], [2.0, -1.0, 0.0], [2.0, 0.0, 0.0], [0.0, 0.0, 0.0]]);
    var extrusion = new Extrusion(glProgram, levels, shapeGen, bezier, /*enableFillings=*/false);
    var transf = mat4.create();
    mat4.fromTranslation(transf, [0.0, 0.0, 0.0]);
    extrusion.draw(transf);

}

class ShapeGen {
    constructor(glProgram) {
        this.vColor = [0.7, 0.4, 0.4];
    }

    getShape() {
        return new Cylinder(glProgram, this.vColor);
    }

    getHeight() {
        return 0.05;
    }

    getTransformMatrix(normal, position=null) {
        var t = mat4.create();
        mat4.targetTo(t, [0.0, 0.0, 0.0], normal, [0.0, 0.0, 1.0]);
        var aux = mat4.create();
        mat4.fromTranslation(aux, position);
        mat4.mul(t, aux, t);
        return t;
    }
    
    getPreTransformMatrix() {
        var t = mat4.create();
        mat4.fromScaling(t, [0.05, 0.05, 0.05]);
        return t;
    }
}