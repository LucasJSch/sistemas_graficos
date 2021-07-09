class Building {
    // Draws a crane.
    constructor(glProgram, firstPartLevels=5, secondPartLevels=5, pointsPerLongSide=5, pointsPerShortSide=5) {
        this.glProgram = glProgram;
        this.pointsPerLongSide = pointsPerLongSide;
        this.pointsPerShortSide = pointsPerShortSide;
        this.cubic_cyl_gen = new CubicCylinderGenerator(this.pointsPerLongSide, this.pointsPerShortSide, [1.0, 0.0, 0.0]);
        this.firstPartHeight = 5;
        this.firstPartLevels = firstPartLevels;
        this.secondPartHeight = 10;
        this.secondPartLevels = secondPartLevels;
        // 0 < scaleFactorBetweenParts <= 1
        this.scaleFactorBetweenParts = 0.75;
        this.floorColor = [1.0, 0.0, 0.0];
        this.columnsColor = [0.5, 0.5, 0.5];
        this.windowsColor = [0.3, 0.0, 8.0];
        this.elevatorColor = [1.0, 0.0, 0.0];

        this.utils = new Utils();
    }

    draw(transformMatrix) {
        if (transformMatrix == null) {
            transformMatrix = mat4.create();
        }

        // Generate bspline interpolation points.
        var bsplinePosBuf = this.cubic_cyl_gen.getPosBuffer([0.0, 0.0, 0.0]);
        var transf = mat4.create();
        mat4.fromScaling(transf, [10.0, 10.0, 0.0]);
        bsplinePosBuf = this.utils.TransformPosBuffer(transf, bsplinePosBuf);
        var bspline_vertices = [];
        for (var i = 0; i < bsplinePosBuf.length; i+=3) {
        bspline_vertices.push([bsplinePosBuf[i], bsplinePosBuf[i+1], bsplinePosBuf[i+2]]);
        }
        // Adds noise to the positions.
        bspline_vertices = getColumnPositionsWithNoise_(bspline_vertices);
        // Bspline curves generator.
        var concatenator = new CuadraticBsplineConcatenator(bspline_vertices);

        this.drawFirstPart(transformMatrix, concatenator);

        // Translate the second part in height in relation to the first part.
        var t = mat4.create();
        mat4.fromTranslation(t, [0.0, 0.0, this.firstPartHeight]);
        mat4.mul(t, transformMatrix, t);

        this.drawSecondPart(t, concatenator);
    }

    // Draws the first part of the building (the largest one).
    drawFirstPart(transformMatrix, concatenator) {
        // Elevator
        var elevator = new BuildingElevator(this.glProgram, /*texture=*/null, this.firstPartLevels, this.cubic_cyl_gen, this.firstPartHeight);
        elevator.draw(transformMatrix);

        // Generate column positions.
        var col_pos = [];
        for (var i = 0; i < concatenator.getNumberOfCurves(); i++) {
            var p = vec3.create();
            vec3.scale(p, concatenator.getPoint(i), 0.9);
            col_pos.push(p);
        }

        // Columns.
        var columns = new BuildingColumns(this.glProgram, this.columnsColor, this.firstPartHeight, col_pos);
        columns.draw(transformMatrix);

        // Floor.
        var floors = new BuildingFloors(this.glProgram, this.firstPartLevels, concatenator, this.floorColor, this.firstPartHeight);
        floors.draw(transformMatrix);

        // Windows.
        var scaleMatrix = mat4.create();
        var transMatrix = mat4.create();
        mat4.fromScaling(scaleMatrix, [7.0, 6.5, 1.0]);
        mat4.fromTranslation(transMatrix, [2.0, 1.0, 0.0]);
        var windows = new BuildingWindows(this.glProgram, /*texture=*/null, this.firstPartLevels, this.cubic_cyl_gen, this.firstPartHeight, scaleMatrix, transMatrix);
        // windows.draw(transformMatrix);
    }

    drawSecondPart(transformMatrix, concatenator) {
        // Elevator
        var elevator = new BuildingElevator(this.glProgram, /*texture=*/null, this.secondPartLevels, this.cubic_cyl_gen, this.secondPartHeight);
        elevator.draw(transformMatrix);

        // Generate column positions.
        var col_pos = [];
        for (var i = 0; i < concatenator.getNumberOfCurves(); i++) {
            var p = vec3.create();
            vec3.scale(p, concatenator.getPoint(i), 0.9 * this.scaleFactorBetweenParts);
            col_pos.push(p);
        }

        // Columns.
        var columns = new BuildingColumns(this.glProgram, this.columnsColor, this.secondPartHeight, col_pos);
        columns.draw(transformMatrix);

        // Floor.
        var floors = new BuildingFloors(this.glProgram, this.secondPartLevels, concatenator, this.floorColor, this.secondPartHeight, this.scaleFactorBetweenParts);
        floors.draw(transformMatrix);

        // Windows.
        var scaleMatrix = mat4.create();
        var transMatrix = mat4.create();
        mat4.fromScaling(scaleMatrix, [7.0 * this.scaleFactorBetweenParts, 6.5 * this.scaleFactorBetweenParts, 1.0]);
        mat4.fromTranslation(transMatrix, [2.0, 1.0, 0.0]);
        var windows = new BuildingWindows(this.glProgram, /*texture=*/null, this.secondPartLevels, this.cubic_cyl_gen, this.secondPartHeight, scaleMatrix, transMatrix);
        // windows.draw(transformMatrix);
    }
}

class CubicCylinderGenerator {
    constructor(pointsPerLongSide, pointsPerShortSide, vColor) {
        this.pointsPerLongSide = pointsPerLongSide;
        this.pointsPerShortSide = pointsPerShortSide;
        this.totalPoints = 2*(pointsPerShortSide+1) + 2*(pointsPerLongSide+1) + 1;
        // this.vColor = vColor;
        this.vColor = [0.0, 0.0, 0.0];
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
        for (var i = -this.pointsPerShortSide/2.0;  i <= this.pointsPerShortSide/2.0; i++) {
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
        for (var i = this.pointsPerShortSide/2.0;   i >= -this.pointsPerShortSide/2.0; i--) {
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
            buffer.push(this.vColor[0]);
            buffer.push(this.vColor[1]);
            buffer.push(this.vColor[2]);
        }
        return buffer;
    }

    getUVBuffer(topPos) {
        var buffer = [];
        for (var i = 0; i <= this.pointsPerLongSide; i++) {
            buffer.push(i / this.pointsPerLongSide);
            if (!topPos) {
                buffer.push(0.0);
            } else {
                buffer.push(1.0);
            }
        }
        for (var i = 0; i <= this.pointsPerShortSide; i++) {
            buffer.push(i / this.pointsPerShortSide);
            if (!topPos) {
                buffer.push(0.0);
            } else {
                buffer.push(1.0);
            }
        }
        for (var i = 0; i <= this.pointsPerLongSide; i++) {
            buffer.push(i / this.pointsPerLongSide);
            if (!topPos) {
                buffer.push(0.0);
            } else {
                buffer.push(1.0);
            }
        }
        for (var i = 0; i <= this.pointsPerShortSide; i++) {
            buffer.push(i / this.pointsPerShortSide);
            if (!topPos) {
                buffer.push(0.0);
            } else {
                buffer.push(1.0);
            }
        }
        return buffer;
    }
}

// Adds random noise to the vertices.
function getColumnPositionsWithNoise_(vertices) {
    var r = new Random(1546);        
    let k = 5;
    for (var i = 0; i < vertices.length; i++) {
        vertices[i] = [k*r.nextFloat() + vertices[i][0], k*r.nextFloat() + vertices[i][1], vertices[i][2]];
    }
    return vertices;
}