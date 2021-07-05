class BuildingFloors {
    // Draws the floors of a building (i.e. only the concrete.)
    // shapeGen: defines the contour of the floor.
    constructor(glProgram, shapeGen, nFloors) {
        this.glProgram = glProgram;
        this.shapeGen = shapeGen;
        this.vColor = [0.95, 0.95, 0.95];
        this.nFloors = nFloors;
    }

    draw(transformMatrix) {
        if (transformMatrix == null) {
            transformMatrix = mat4.create();
        }

        var floors = new LinearExtrusion(this.glProgram, this.nFloors, /*vStartPos=*/[0.0, 0.0, 0.0], /*vEndPos=*/[0.0, 0.0, 5.0], this.shapeGen);
        floors.draw(transformMatrix);
    }
}
