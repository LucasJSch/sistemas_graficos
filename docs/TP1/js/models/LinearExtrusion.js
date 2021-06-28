class LinearExtrusion {
    // fShapePos is a function that generates the index buffer for the shape based from the received point.
    // The received point represents the central axis of the shape.
    // Same applies for fShapeNormal and fShapeColor, but with the other buffers.
    constructor(glProgram, levels, vStartPos, vEndPos, fShapePos, fShapeNormal, fShapeColor, n_rows_per_shape=100, n_cols_per_shape=100) {
        this.glProgram = glProgram;
        this.levels = levels;
        this.vStartPos = vStartPos;
        this.vEndPos = vEndPos;
        this.fShapePos = fShapePos;
        this.fShapeNormal = fShapeNormal;
        this.fShapeColor = fShapeColor;
        this.n_rows_per_shape = n_rows_per_shape;
        this.n_cols_per_shape = n_cols_per_shape;
        this.level_buffers = null;
    }

    draw() {
        this.createBuffers();
        this.drawShapes();
    }

    createBuffers() {
        // This array contains references to all the buffers for each level.
        // The order is: 
        // [lvl_0_idx_buffer, lvl_0_normal_buffer, lvl_0_color_buffer, lvl_1_idx_buffer, lvl_1_normal_buffer, lvl_1_color_buffer, ... ]

        this.level_buffers = [];
        for (var level = 0; level < this.levels; level++) {
            var buffers = this.generateBuffersForLevel(level);
            this.level_buffers.push(buffers[0]);
            this.level_buffers.push(buffers[1]);
            this.level_buffers.push(buffers[2]);
        }
    }

    generateBuffersForLevel(level) {
        // Get central point of level.
        var direction_vector = vec3.create();
        var minus_start_pos = vec3.create();
        var central_point = vec3.create();

        var lvl_step = vec3.distance(this.vStartPos, this.vEndPos) / this.levels;
        vec3.scale(minus_start_pos, this.vStartPos, -1.0);
        vec3.add(direction_vector, this.vEndPos, minus_start_pos);

        vec3.scale(central_point, direction_vector, level * lvl_step);
        vec3.add(central_point, this.vStartPos, central_point);
        var pos_buffer = this.fShapePos(central_point);
        var normal_buffer = this.fShapeNormal(central_point);
        var color_buffer = this.fShapeColor(central_point);

        return [pos_buffer, normal_buffer, color_buffer];
    }

    drawShapes() {
        for (var i = 0; i < this.levels; i++) {
            var grid = new Grid(this.glProgram, this.level_buffers[i*3], this.level_buffers[i*3 + 1], this.level_buffers[i*3 + 2], this.n_rows_per_shape, this.n_cols_per_shape);
            grid.draw();
        }
    }
}