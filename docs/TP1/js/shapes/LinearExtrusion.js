class LinearExtrusion {
    // shapeGenerator is an instance of a class that has 3 methods:
    // getPosBuffer(central_point), getNormalBuffer(central_point), getColorBuffer(central_point)
    // For a working example, see either the Cylinder class or the /tests/drawLinearExtrusion.js file.
    constructor(glProgram, levels, vStartPos, vEndPos, shapeGenerator) {
        this.glProgram = glProgram;
        this.levels = levels;
        this.vStartPos = vStartPos;
        this.vEndPos = vEndPos;
        this.shapeGenerator = shapeGenerator;
        this.n_rows = levels;
        this.n_cols = null;
        this.pos_buffer = null;
        this.normal_buffer = null;
        this.color_buffer = null;
        this.top_pos_buffer = null;
        this.top_normal_buffer = null;
        this.top_color_buffer = null;
    }

    draw(transformMatrix) {
        if (transformMatrix == null) {
            transformMatrix = mat4.create();
        }

        this.createBuffers();
        this.applyTransformation(transformMatrix);

        var grid = new Grid(this.glProgram, this.pos_buffer, this.normal_buffer, this.color_buffer, this.n_rows, this.n_cols);
        grid.draw();
    }

    applyTransformation(transformMatrix) {
        var utils = new Utils();
        this.pos_buffer = utils.TransformPosBuffer(transformMatrix, this.pos_buffer);
    }

    createBuffers() {
        this.pos_buffer = [];
        this.normal_buffer = [];
        this.color_buffer = [];
        for (var level = 0; level < this.levels; level++) {
            var buffers = this.generateBuffersForLevel(level);
            this.n_cols = (buffers[0].length/3);
            this.pos_buffer = this.pos_buffer.concat(buffers[0]);
            this.normal_buffer = this.normal_buffer.concat(buffers[1]);
            this.color_buffer = this.color_buffer.concat(buffers[2]);
        }
    }

    generateBuffersForLevel(level) {
        // Get central point of level.
        var direction_vector = vec3.create();
        var minus_start_pos = vec3.create();
        var central_point = vec3.create();

        // If this is the first level, the central_pos should match with the start pos.
        if (level == 0) {
        central_point = this.vStartPos;
        }
        // If this is not the last nor the first level, compute the current pos.
        else if (level != (this.levels -1)) {
            var lvl_step = vec3.distance(this.vStartPos, this.vEndPos) / (this.levels-1);
            vec3.scale(minus_start_pos, this.vStartPos, -1.0);
            vec3.add(direction_vector, this.vEndPos, minus_start_pos);

            vec3.scale(central_point, direction_vector, level * lvl_step);
            vec3.add(central_point, this.vStartPos, central_point);
        // If this is the las level, the central_pos should match with the end pos.
        } else {
            central_point = this.vEndPos;
        }
        var pos_buffer = this.shapeGenerator.getPosBuffer(central_point);
        var normal_buffer = this.shapeGenerator.getNormalBuffer(central_point);
        var color_buffer = this.shapeGenerator.getColorBuffer(central_point);

        return [pos_buffer, normal_buffer, color_buffer];
    }
}