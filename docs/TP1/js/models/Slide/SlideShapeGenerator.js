class SlideShapeGenerator {
    constructor(vColor, step) {
        this.points = [[0.0, 0.0, 0.0], [-2.0, 0.0, 0.0], [-2.0, -1.0, 0.0], [0.0, -1.0, 0.0], [0.0, -1.0, 0.0], [2.0, -1.0, 0.0], [2.0, 0.0, 0.0], [0.0, 0.0, 0.0]];
        this.concatenator = new CubicBezierConcatenator(this.points);
        this.vColor = vColor;
        this.step = step;
    }

    getPosBuffer(central_pos) {
        var buffer = [];
        for (var i = 0.0; i < this.concatenator.getNumberOfCurves(); i+=this.step) {
            var p = this.concatenator.getPoint(i);
            buffer.push(p[0] + central_pos[0]);
            buffer.push(p[1] + central_pos[1]);
            buffer.push(i*0.5 + central_pos[2]);
        }
        return buffer;
    }

    // TODO: Fix this. This is incorrect.
    getNormalBuffer(central_pos) {
        var buffer = [];
        for (var i = 0.0; i < this.concatenator.getNumberOfCurves(); i+=this.step) {
            buffer.push(0.0);
            buffer.push(0.0);
            buffer.push(1.0);
        }
        return buffer;
    }
        
    getColorBuffer(central_pos) {
        var buffer = [];
        for (var i = 0.0; i < this.concatenator.getNumberOfCurves(); i+=this.step) {
            buffer.push(this.vColor[0]);
            buffer.push(this.vColor[1]);
            buffer.push(this.vColor[2]);
        }
        return buffer;
    }
}