class BuildingElevator {
    // Draws the elevator of a building.
    // shapeGen: Defines the contour of the elevator.
    constructor(glProgram, texture, nFloors, shapeGen, height) {
        this.rectangle = new LinearExtrusion(glProgram, nFloors, /*vStartPos=*/[0.0, 0.0, 0.0], /*vEndPos=*/[0.0, 0.0, height], shapeGen);
    }

    draw(transformMatrix) {
        this.rectangle.draw(transformMatrix);
    }
}
