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

    var levels = 100;
    var shapeGen = new ShapeGen2(glProgram);
    var repetitions = 5;
    var beizer_points = [];
    for (var rep = 0; rep < repetitions; rep++) {
        beizer_points.push([0.0, 0.0, 0.0   + rep*1.2]);
        beizer_points.push([-2.0, 0.0, 0.2  + rep*1.2]);
        beizer_points.push([-2.0, -1.0, 0.4 + rep*1.2]);
        beizer_points.push([0.0, -1.0, 0.6  + rep*1.2]);
        beizer_points.push([0.0, -1.0, 0.6  + rep*1.2]);
        beizer_points.push([2.0, -1.0, 0.8  + rep*1.2]);
        beizer_points.push([2.0, 0.0, 1.0   + rep*1.2]);
        beizer_points.push([0.0, 0.0, 1.2   + rep*1.2]);
    }
    var bezier = new CubicBezierConcatenator(beizer_points);
    var extrusion = new Extrusion(glProgram, levels, shapeGen, bezier);
    extrusion.draw();

    var column1 = new Cylinder(glProgram, [0.4, 0.4, 0.4]);
    var t = mat4.create();
    var aux = mat4.create();
    mat4.fromScaling(t, [0.2, 0.2, 5.5]);
    mat4.fromTranslation(aux, [0.5, -0.3, 0.0]);
    mat4.mul(t, aux, t);
    column1.draw(t);

    var column2 = new Cylinder(glProgram, [0.4, 0.4, 0.4]);
    mat4.fromScaling(t, [0.2, 0.2, 5.5]);
    mat4.fromTranslation(aux, [-0.5, -0.3, 0.0]);
    mat4.mul(t, aux, t);
    column1.draw(t);
}

class ShapeGen2 {
    constructor(glProgram) {
        this.vColor = [0.7, 0.4, 0.4];
    }

    getPositionBuffer(central_pos) {
        var x_0 = central_pos[0];
        var y_0 =  central_pos[1];
        var z_0 = central_pos[2];
        
        var buffer = [];
        var n = 50;
        for (var i = 0; i < n-1; i++) {
            buffer.push(x_0 + 0.25*Math.cos(-i * 2.0 * Math.PI / (n*2)) + 0.75);
            buffer.push(y_0 + 0.5*Math.sin(-i * 2.0 * Math.PI / (n*2)));
            buffer.push(z_0);
        }

        buffer.push(buffer[0]);
        buffer.push(buffer[1]);
        buffer.push(buffer[2]);

        return buffer;
    }
        
    getNormalBuffer(central_pos) {
        var buffer = [];
        var n = 50;
        for (var i = 0; i < n; i++) {
            buffer.push(0.0);
            buffer.push(0.0);
            buffer.push(1.0);
        }
        return buffer;
    }
        
    getColorBuffer(central_pos) {
        var buffer = [];
        var n = 50;
        // Rojo.
        for (var i = 0; i < n/5; i++) {
            buffer.push(1.0);
            buffer.push(0.0);
            buffer.push(0.0);
        }
        // Amarillo.
        for (var i = 0; i < n/5; i++) {
            buffer.push(1.0);
            buffer.push(1.0);
            buffer.push(0.0);
        }
        // Verde.
        for (var i = 0; i < n/5; i++) {
            buffer.push(0.0);
            buffer.push(1.0);
            buffer.push(0.0);
        }
        // Azul.
        for (var i = 0; i < n/5; i++) {
            buffer.push(0.0);
            buffer.push(0.0);
            buffer.push(1.0);
        }
        // Negro.
        for (var i = 0; i < n/5; i++) {
            buffer.push(0.0);
            buffer.push(0.0);
            buffer.push(0.0);
        }
        return buffer;
    }
}