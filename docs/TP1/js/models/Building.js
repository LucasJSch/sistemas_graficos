class Building {
    // Draws a crane.
    constructor(glProgram) {
        this.glProgram = glProgram;
        this.pointsPerLongSide = 5;
        this.pointsPerShortSide = 5;
        this.cubic_cyl_gen = new CubicCylinderGenerator(this.pointsPerLongSide, this.pointsPerShortSide, [1.0, 0.0, 0.0]);
        this.levels = 2;
        this.buildingHeight = 5;

        this.utils = new Utils();
    }

    draw(transformMatrix) {
        if (transformMatrix == null) {
            transformMatrix = mat4.create();
        }

        // Elevator
        var elevator = new BuildingElevator(this.glProgram, /*texture=*/null, this.levels, this.cubic_cyl_gen, this.buildingHeight);
        elevator.draw(transformMatrix);

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

        // Generate column positions.
        var col_pos = [];
        for (var i = 0; i < concatenator.getNumberOfSplines(); i++) {
            var p = vec3.create();
            vec3.scale(p, concatenator.getPoint(i), 0.9);
            col_pos.push(p);
        }

        // Columns.
        var columns = new BuildingColumns(this.glProgram, [1.0, 0.2, 0.2], this.buildingHeight, col_pos);
        columns.draw(transformMatrix);

        // Floor.
        var floors_shapeGen = new FloorShapeGenerator(100, concatenator, [1.0, 0.0, 0.0]);
        var floors = new BuildingFloors(this.glProgram, this.levels, concatenator, [0.0, 1.0, 0.0], this.buildingHeight);
        floors.draw(transformMatrix);

        // Windows.
        var windows = new BuildingWindows(this.glProgram, /*texture=*/null, this.levels, this.cubic_cyl_gen, this.buildingHeight);
        windows.draw();
    }
}

class CubicCylinderGenerator {
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

// Adds random noise to the vertices.
function getColumnPositionsWithNoise_(vertices) {
    var r = new Random(1546);        
    let k = 5;
    for (var i = 0; i < vertices.length; i++) {
        vertices[i] = [k*r.nextFloat() + vertices[i][0], k*r.nextFloat() + vertices[i][1], vertices[i][2]];
    }
    return vertices;
}