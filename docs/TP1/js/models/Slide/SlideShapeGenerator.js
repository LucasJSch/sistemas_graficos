class SlideShapeGenerator {
    constructor(vColor) {
        this.vColor = vColor;
        this.resolution = 50;
        this.x_radius = 0.25;
        this.y_radius = 0.5;
        this.x_offset = 0.75;
        this.y_offset = 0.0;
    }

    getPositionBuffer(central_pos) {
        var x_0 = central_pos[0];
        var y_0 =  central_pos[1];
        var z_0 = central_pos[2];
        
        var buffer = [];
        for (var i = 0; i < this.resolution-1; i++) {
            buffer.push(x_0 + this.x_radius*Math.cos(-i * 2.0 * Math.PI / (this.resolution*2)) + this.x_offset);
            buffer.push(y_0 + this.y_radius*Math.sin(-i * 2.0 * Math.PI / (this.resolution*2)) + this.y_offset);
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