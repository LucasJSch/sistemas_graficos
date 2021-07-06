class Slide {
    // Draws a slide.
    constructor(glProgram) {
        this.glProgram = glProgram;
    }

    draw(transformMatrix) {
        if (transformMatrix == null) {
            transformMatrix = mat4.create();
        }

        var points = [[+0.0, +0.0, 0.0], [-2.0, +0.0, 0.0], [-2.0, -1.0, 0.0], [+0.0, -1.0, 0.0], 
                      [+0.0, -1.0, 0.0], [+2.0, -1.0, 0.0], [+2.0, 0.0, 0.0], [+0.0, +0.0, 0.0]];
        var concatenator = new CubicBezierConcatenator(points);
        console.log(concatenator.getNumberOfCurves());
        for (var i = 0.0; i < concatenator.getNumberOfCurves(); i+=0.025) {
            var cube = new Cube(this.glProgram, [1.0, 0.0, 1.0]);
            var t = mat4.create();
            var s = mat4.create();
            mat4.fromTranslation(t, [concatenator.getPoint(i)[0], concatenator.getPoint(i)[1], i*0.5]);
            mat4.fromScaling(s, [0.1, 0.1, 0.1]);
            mat4.mul(t, t, s);
            cube.draw(t);
        }
    }
}