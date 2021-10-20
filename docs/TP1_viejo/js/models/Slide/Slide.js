class Slide {
    // Draws a slide.
    constructor(glProgram) {
        this.glProgram = glProgram;
        this.height = 5.0;
        this.extrusion_levels = 100;
        this.slide_repetitions = 5;
        this.slide_color = [0.9778, 0.5511, 0.2622];
        this.bezier_points = [[0.0, 0.0, 0.0], [-2.0, 0.0, 0.2], [-2.0, -1.0, 0.4], [0.0, -1.0, 0.6], [0.0, -1.0, 0.6], [2.0, -1.0, 0.8], [2.0, 0.0, 1.0], [0.0, 0.0, 1.2]]; 
        this.bezier_concatenator = null;
        this.slide_shapeGen = new SlideShapeGenerator(this.slide_color);
    }

    draw(transformMatrix) {
        if (transformMatrix == null) {
            transformMatrix = mat4.create();
        }

        this.generateBezierConcatenator();
        var extrusion = new Extrusion(this.glProgram, this.extrusion_levels, this.slide_shapeGen, this.bezier_concatenator);
        var t_extrusion = mat4.create();
        mat4.fromTranslation(t_extrusion, [0.0, 0.0, 0.5]);
        mat4.mul(t_extrusion, transformMatrix, t_extrusion);
        extrusion.draw(t_extrusion);

        this.drawColumns(transformMatrix);
    }

    generateBezierConcatenator() {
        var aux = vec3.create();
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

    drawColumns(transformMatrix) {
        var column = new Cylinder(glProgram, [0.4, 0.4, 0.4]);
        var t = mat4.create();
        var aux = mat4.create();
        mat4.fromScaling(t, [0.2, 0.2, 5.5]);
        mat4.fromTranslation(aux, [0.5, -0.3, 0.0]);
        mat4.mul(t, aux, t);
        mat4.mul(t, transformMatrix, t);
        column.draw(t);
    
        mat4.fromScaling(t, [0.2, 0.2, 5.5]);
        mat4.fromTranslation(aux, [-0.5, -0.3, 0.0]);
        mat4.mul(t, aux, t);
        mat4.mul(t, transformMatrix, t);
        column.draw(t);
    }
}