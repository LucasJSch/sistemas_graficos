class Slide {
    // Draws a slide.
    constructor(glProgram) {
        this.glProgram = glProgram;
        this.height = 5.0;
        this.levels = 2;
    }

    draw(transformMatrix) {
        if (transformMatrix == null) {
            transformMatrix = mat4.create();
        }

        var shapeGen = new SlideShapeGenerator([0.6, 0.7, 0.34], 0.025);
        var step = this.height / this.levels;
        for (var i = 0; i < this.levels; i+=step) {
            var central_pos = [0.0, 0.0, i];
            var shape = new Grid(this.glProgram, shapeGen.getPosBuffer(central_pos), shapeGen.getNormalBuffer(central_pos), shapeGen.getColorBuffer(central_pos), 50, 50);
            shape.draw();
        }
    }
}