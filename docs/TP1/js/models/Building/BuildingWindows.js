class BuildingWindows {
    // Draws the windows of a building.
    // Receives: position of windows
    constructor(glProgram, texture, nFloors, shapeGen, height) {
        this.rectangle = new LinearExtrusion(glProgram, nFloors, /*vStartPos=*/[0.0, 0.0, 0.0], /*vEndPos=*/[0.0, 0.0, height], shapeGen);
    }

    // TODO: Use transformMatrix.
    draw(transformMatrix) {
        // var t = mat4.create();
        // var t2 = mat4.create();
        // mat4.fromScaling(t, [7.0, 6.5, 1.0]);
        // mat4.fromTranslation(t2, [2.0, 1.0, 0.0]);
        // mat4.mul(t, t2, t);
        this.rectangle.draw();
    }
}
