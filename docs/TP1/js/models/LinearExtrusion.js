class LinearExtrusion {
    // fShapePos is a function that generates the index buffer for the shape based from the received point.
    // The received point represents the central axis of the shape.
    // Same applies for fShapeNormal and fShapeColor, but with the other buffers.
    constructor(glProgram, levels, vStartPos, vEndPos, fShapePos, fShapeNormal, fShapeColor) {
        this.glProgram = glProgram;
        this.levels = levels;
        this.vStartPos = vStartPos;
        this.vEndPos = vEndPos;
        this.fShapePos = fShapePos;
        this.fShapeNormal = fShapeNormal;
        this.fShapeColor = fShapeColor;
        this.n_rows = levels;
        this.n_cols = null;
        this.pos_buffer = null;
        this.normal_buffer = null;
        this.color_buffer = null;
    }

    draw() {
        this.createBuffers();
        console.log(this.pos_buffer.length);
        var grid = new Grid(this.glProgram, this.pos_buffer, this.normal_buffer, this.color_buffer, this.n_rows, this.n_cols);
        grid.draw();
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
}