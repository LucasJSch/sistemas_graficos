class SlideShapeGenerator {
    constructor(vColor) {
        this.vColor = vColor;
        this.resolution = 50;
    }

    getPositionBuffer(central_pos) {
        var x_0 = central_pos[0];
        var y_0 =  central_pos[1];
        var z_0 = central_pos[2];
        
        var buffer = [];
        for (var i = 0; i < this.resolution-1; i++) {
            buffer.push(x_0 + 0.25*Math.cos(-i * 2.0 * Math.PI / (this.resolution*2)) + 0.75);
            buffer.push(y_0 + 0.5*Math.sin(-i * 2.0 * Math.PI / (this.resolution*2)));
            buffer.push(z_0);
        }

        buffer.push(buffer[0]);
        buffer.push(buffer[1]);
        buffer.push(buffer[2]);

        return buffer;
    }
        
    // TODO: Fix this. This is incorrect.
    getNormalBuffer(central_pos) {
        var buffer = [];
        for (var i = 0; i < this.resolution; i++) {
            buffer.push(0.0);
            buffer.push(0.0);
            buffer.push(1.0);
        }
        return buffer;
    }
        
    getColorBuffer(central_pos) {
        var buffer = [];
        for (var i = 0; i < this.resolution; i++) {
            buffer.push(this.vColor[0]);
            buffer.push(this.vColor[1]);
            buffer.push(this.vColor[2]);
        }
        return buffer;
    }
}