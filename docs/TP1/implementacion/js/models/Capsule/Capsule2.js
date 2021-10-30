class Capsule2 {
    // Draws the capsule.
    constructor(glProgram) {
        this.glProgram = glProgram;
        this.color = [0.823529412, 0.662745098, 0.53333333];
        this.vCentralTopPos = [0.0, 0.0, 5.0];
        this.vCentralBottomPos = [0.0, 0.0, 0.0];
        this.bezier_points = [[0.0, 0.0, 0.0], [-2.0, 0.0, 0.2], [-2.0, -1.0, 0.4], [0.0, -1.0, 0.6], [0.0, -1.0, 0.6], [2.0, -1.0, 0.8], [2.0, 0.0, 1.0], [0.0, 0.0, 1.2]]; 
        this.bezier_concatenator = null;
        this.slide_shapeGen = new SlideShapeGenerator(this.color);
        this.extrusion_levels = 100;
        this.height = 5.0;
        this.slide_repetitions = 5;
    }

    draw(transformMatrix) {
        if (transformMatrix == null) {
            transformMatrix = mat4.create();
        }

        this.generateBezierConcatenator();
        console.log("scheink");
        console.log(this.bezier_concatenator);
        console.log(this.bezier_concatenator.getNumberOfCurves());
        var extrusion = new Extrusion(this.glProgram, this.extrusion_levels, this.slide_shapeGen, this.bezier_concatenator);
        // var t_extrusion = mat4.create();
        // mat4.fromTranslation(t_extrusion, [0.0, 0.0, 0.5]);
        // mat4.mul(t_extrusion, transformMatrix, t_extrusion);
        // extrusion.draw(t_extrusion);
    }

    generateBezierConcatenator() {
        var points = [];
        var height_step = this.height / this.slide_repetitions;
        for (var rep = 0; rep < this.slide_repetitions; rep++) {
            var current_height = rep * height_step;
            points.push([this.bezier_points[0][0], this.bezier_points[0][1], this.bezier_points[0][2] + current_height]);
            points.push([this.bezier_points[1][0], this.bezier_points[1][1], this.bezier_points[1][2] + current_height]);
            points.push([this.bezier_points[2][0], this.bezier_points[2][1], this.bezier_points[2][2] + current_height]);
            points.push([this.bezier_points[3][0], this.bezier_points[3][1], this.bezier_points[3][2] + current_height]);
            points.push([this.bezier_points[4][0], this.bezier_points[4][1], this.bezier_points[4][2] + current_height]);
            points.push([this.bezier_points[5][0], this.bezier_points[5][1], this.bezier_points[5][2] + current_height]);
            points.push([this.bezier_points[6][0], this.bezier_points[6][1], this.bezier_points[6][2] + current_height]);
            points.push([this.bezier_points[7][0], this.bezier_points[7][1], this.bezier_points[7][2] + current_height]);
        }

        this.bezier_concatenator = new CubicBezierConcatenator(points);
    }
}

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