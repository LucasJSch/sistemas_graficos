class BuildingFloors {
    // Draws the floors of a building (i.e. only the concrete.)
    // shapeGen: defines the contour of the floor.
    constructor(glProgram, nFloors, bsplineConcatenator, vColor, height, scale=1.0) {
        this.glProgram = glProgram;
        this.bsplineConcatenator = bsplineConcatenator;
        this.vColor = [0.95, 0.95, 0.95];
        this.nFloors = nFloors;
        this.height = height;
        this.scale = scale;
    }

    draw(transformMatrix) {
        if (transformMatrix == null) {
            transformMatrix = mat4.create();
        }

        for (var i = 0; i < this.nFloors + 1; i++) {
            var t = mat4.create();
            mat4.fromTranslation(t, [0.0, 0.0, i * this.height/this.nFloors]);
            var floor = new SingleBuildingFloor(this.glProgram, this.bsplineConcatenator, this.vColor, this.height, this.scale);
            mat4.mul(t, transformMatrix, t);
            floor.draw(t);
        }
    }
}

class SingleBuildingFloor {
    constructor(glProgram, bsplineConcatenator, vColor, height, scale) {
        this.glProgram = glProgram;
        this.shapeGen = new FloorShapeGenerator(glProgram, /*n_points=*/70, bsplineConcatenator, vColor, scale);
        this.vColor = vColor;
        this.height = 0.3;
    }

    draw(transformMatrix) {
        if (transformMatrix == null) {
            transformMatrix = mat4.create();
        }

        var floors = new LinearExtrusionWithFillings(this.glProgram, 2, /*vStartPos=*/[0.0, 0.0, 0.0], /*vEndPos=*/[0.0, 0.0, this.height], this.shapeGen);
        floors.draw(transformMatrix);
    }
}

class FloorShapeGenerator {
    constructor(glProgram, n_points, bsplineConcatenator, vColor, scale) {
        this.glProgram = glProgram;
        this.n_points = n_points;
        this.bsplineConcatenator = bsplineConcatenator;
        this.vColor = vColor;
        this.scale = scale;
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
            buffer.push(x_0 + p[0] * this.scale);
            buffer.push(y_0 + p[1] * this.scale);
            buffer.push(z_0 + p[2] * this.scale);
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
        let bspline_points = this.bsplineConcatenator.getNumberOfSplines();
        let step =  bspline_points / this.n_points;
        for (var i = 0; i < bspline_points; i+=step) {
            buffer.push(0.0);
            buffer.push(0.0);
            buffer.push(1.0);
        }
        return buffer;
    }
        
    getColorBuffer(central_pos) {
        var buffer = [];
        let bspline_points = this.bsplineConcatenator.getNumberOfSplines();
        let step =  bspline_points / this.n_points;
        for (var i = 0; i < bspline_points; i+=step) {
            buffer.push(this.vColor[0]);
            buffer.push(this.vColor[1]);
            buffer.push(this.vColor[2]);
        }
        return buffer;
    }
}