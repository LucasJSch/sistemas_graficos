class BuildingFloors {
    // Draws the floors of a building (i.e. only the concrete.)
    // shapeGen: defines the contour of the floor.
    constructor(glProgram, nFloors, bsplineConcatenator, vColor, height) {
        this.glProgram = glProgram;
        this.shapeGen = new FloorShapeGenerator(glProgram, /*n_points=*/70, bsplineConcatenator, vColor);
        this.vColor = [0.95, 0.95, 0.95];
        this.nFloors = nFloors;
        this.height = height;
    }

    draw(transformMatrix) {
        if (transformMatrix == null) {
            transformMatrix = mat4.create();
        }

        var floors = new LinearExtrusionWithFillings(this.glProgram, this.nFloors, /*vStartPos=*/[0.0, 0.0, 0.0], /*vEndPos=*/[0.0, 0.0, this.height], this.shapeGen);
        floors.draw(transformMatrix);
    }
}


class FloorShapeGenerator {
    constructor(glProgram, n_points, bsplineConcatenator, vColor) {
        this.glProgram = glProgram;
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
            buffer.push(0.0);
            buffer.push(0.5);
            buffer.push(0.3);
        }
        return buffer;
    }
}