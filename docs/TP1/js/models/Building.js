class Building {
    // Draws a crane.
    constructor(glProgram) {
        this.glProgram = glProgram;
        this.pointsPerLongSide = 10;
        this.pointsPerShortSide = 5;
        this.windows_shapeGen = new WindowsShapeGenerator(this.pointsPerLongSide, this.pointsPerShortSide, [1.0, 0.0, 0.0]);
        this.levels = 5;

        this.utils = new Utils();
    }

    draw(transformMatrix) {
        if (transformMatrix == null) {
            transformMatrix = mat4.create();
        }

        var rectangle = new LinearExtrusion(this.glProgram, this.levels, /*vStartPos=*/[0.0, 0.0, 0.0], /*vEndPos=*/[0.0, 0.0, 5.0], this.windows_shapeGen);
        rectangle.draw(transformMatrix);

        var columnsPosBuf = this.windows_shapeGen.getPosBuffer([0.0, 0.0, 0.0]);
        var transf = mat4.create();
        mat4.fromScaling(transf, [2.5, 2.5, 0.0]);
        columnsPosBuf = this.utils.TransformPosBuffer(transf, columnsPosBuf);
        columnsPosBuf = addNoiseToBuffer_(columnsPosBuf);
        var columns_vertices = [];
        for (var i = 0; i < columnsPosBuf.length; i+=3) {
            columns_vertices.push([columnsPosBuf[i], columnsPosBuf[i+1], columnsPosBuf[i+2]]);
        }
        var concatenator = new CuadraticBsplineConcatenator(columns_vertices);

        var floors_shapeGen = new FloorShapeGenerator(100, concatenator, [1.0, 0.0, 0.0]);
        var floors = new BuildingFloors(this.glProgram, floors_shapeGen, 5);
        floors.draw(transformMatrix);
        // var s = mat4.create();
        // mat4.fromScaling(s, [0.1, 0.1, 10.0]);
        // for (var i = 0; i < columns_vertices.length; i++) {
        //     var cyl = new Cylinder(this.glProgram, [1.0, 0.45, 0.1]);
        //     var t = mat4.create();
        //     mat4.fromTranslation(t, columns_vertices[i]);
        //     mat4.mul(t, t, s);
        //     cyl.draw(t);
        // }
    }
}

class WindowsShapeGenerator {
    constructor(pointsPerLongSide, pointsPerShortSide, vColor) {
        this.pointsPerLongSide = pointsPerLongSide;
        this.pointsPerShortSide = pointsPerShortSide;
        this.totalPoints = 2*pointsPerShortSide + 2*pointsPerLongSide + 1;
        this.vColor = vColor;
        this.longSideLength = 4.0;
        this.shortSideLength = 2.0;
    }
    
    getPosBuffer(central_pos) {
        var x_0 = central_pos[0];
        var y_0 =  central_pos[1];
        var z_0 = central_pos[2];
        
        var buffer = [];

        // First sides.
        for (var i = -this.pointsPerLongSide/2.0; i <= this.pointsPerLongSide/2.0; i++) {
            buffer.push(x_0 + this.longSideLength * i / this.pointsPerLongSide);
            buffer.push(y_0 - this.shortSideLength/2.0);
            buffer.push(z_0);
        }
        for (var i = -this.shortSideLength/2.0;  i <= this.pointsPerShortSide/2.0; i++) {
            buffer.push(x_0 + this.longSideLength/2.0);
            buffer.push(y_0 +  this.shortSideLength * i / this.pointsPerShortSide);
            buffer.push(z_0);
        }

        // Second sides.
        for (var i = this.pointsPerLongSide/2.0; i >= -this.pointsPerLongSide/2.0; i--) {
            buffer.push(x_0 + this.longSideLength * i / this.pointsPerLongSide);
            buffer.push(y_0 + this.shortSideLength/2.0);
            buffer.push(z_0);
        }
        for (var i = this.shortSideLength/2.0;   i >= -this.pointsPerShortSide/2.0; i--) {
            buffer.push(x_0 - this.longSideLength/2.0);
            buffer.push(y_0 +  this.shortSideLength * i / this.pointsPerShortSide);
            buffer.push(z_0);
        }

        // We need to connect the shape's end and beginning.
        buffer.push(buffer[0]);
        buffer.push(buffer[1]);
        buffer.push(buffer[2]);

        return buffer;
    }
        
    // TODO: Fix this. This is incorrect.
    getNormalBuffer(central_pos) {
        var buffer = [];
        for (var i = 0; i < this.totalPoints; i++) {
            buffer.push(0.0);
            buffer.push(0.0);
            buffer.push(1.0);
        }
        return buffer;
    }
        
    getColorBuffer(central_pos) {
        var buffer = [];
        for (var i = 0; i < this.totalPoints; i++) {
            buffer.push(0.5);
            buffer.push(0.3);
            buffer.push(central_pos[2]*0.1);
        }
        return buffer;
    }
}

class FloorShapeGenerator {
    constructor(n_points, bsplineConcatenator, vColor) {
        this.n_points = n_points;
        this.bsplineConcatenator = bsplineConcatenator;
        this.vColor = vColor;
    }
    
    getPosBuffer(central_pos) {
        var x_0 = central_pos[0];
        var y_0 =  central_pos[1];
        var z_0 = central_pos[2];
        
        var buffer = [];

        let bspline_points = this.bsplineConcatenator.getNumberOfSplines();
        let step =  bspline_points / this.n_points;
        for (var i = 0; i < bspline_points; i+=step) {
            var p = this.bsplineConcatenator.getPoint(i);
            buffer.push(x_0 + p[0]);
            buffer.push(y_0 + p[1]);
            buffer.push(z_0 + p[2]);
        }

        // We need to connect the shape's end and beginning.
        buffer.push(buffer[0]);
        buffer.push(buffer[1]);
        buffer.push(buffer[2]);

        return buffer;
    }
        
    // TODO: Fix this. This is incorrect.
    getNormalBuffer(central_pos) {
        var buffer = [];
        for (var i = 0; i <  this.bsplineConcatenator.getNumberOfSplines(); i++) {
            buffer.push(0.0);
            buffer.push(0.0);
            buffer.push(1.0);
        }
        return buffer;
    }
        
    getColorBuffer(central_pos) {
        var buffer = [];
        for (var i = 0; i <  this.bsplineConcatenator.getNumberOfSplines(); i++) {
            buffer.push(0.0);
            buffer.push(0.5);
            buffer.push(central_pos[2]*0.1);
        }
        return buffer;
    }
}

function addNoiseToBuffer_(buffer) {
    var transformedBuffer = new Array(buffer.length);
    var newPos = vec4.create();
    
    for (var i = 0; i < buffer.length; i+=3) {
        if (buffer[i] > 0.8) {
            vec4.set(newPos, buffer[i] + Math.cos(i), buffer[i+1] + Math.sin(i), buffer[i+2], 1);
        } else if (buffer[i] > 0.4) {
            vec4.set(newPos, buffer[i] + 0.5*Math.cos(i), buffer[i+1] + Math.sin(i), buffer[i+2], 1);
        }
        else {
            vec4.set(newPos, buffer[i] + 0.5*Math.tan(i) * Math.cos(i+0.1), buffer[i+1] + 0.5*Math.sin(i*0.79), buffer[i+2], 1);
        }
        transformedBuffer[i] = newPos[0];
        transformedBuffer[i+1] = newPos[1];
        transformedBuffer[i+2] = newPos[2];
    }
    
    return transformedBuffer;
}