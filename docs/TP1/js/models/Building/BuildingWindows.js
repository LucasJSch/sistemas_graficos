class BuildingWindows {
    // Draws the windows of a building.
    // Receives: position of windows
    constructor(glProgram, texture, nFloors, shapeGen, height, scaleMatrix, translationMatrix) {
        this.rectangle = new LinearExtrusion(glProgram, nFloors, /*vStartPos=*/[0.0, 0.0, 0.0], /*vEndPos=*/[0.0, 0.0, height], shapeGen);
        this.scaleMatrix = scaleMatrix;
        this.translationMatrix = translationMatrix;
    }

    draw(transformMatrix) {
        if (transformMatrix == null) {
            transformMatrix = mat4.create();
        }
        var t = mat4.create();
        mat4.mul(t, this.translationMatrix, this.scaleMatrix);
        mat4.mul(t, transformMatrix, t);
        this.rectangle.draw(t);
    }
}
