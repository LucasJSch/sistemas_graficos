class Extrusion {
    // shapeGenerator is an instance of a class that has 2 methods:
    // getPosBuffer(central_point), getNormalBuffer(central_point)
    // For a working example, see either the Cylinder class or the /tests/drawLinearExtrusion.js file.
    constructor(shader, levels, vStartPos, vEndPos, shapeGenerator, vColor) {
        this.shader = shader;
        this.levels = levels;
        this.vStartPos = vStartPos;
        this.vEndPos = vEndPos;
        this.shapeGenerator = shapeGenerator;
        this.n_rows = levels;
        this.n_cols = null;
        this.pos_buffer = null;
        this.normal_buffer = null;
        this.vColor = vColor;
        this.uv_buffer = null;

        this.useFan = false;
    }

    setTexture(texture) {
        this.texture = texture;
    }

    draw(transformMatrix) {
        if (transformMatrix == null) {
            transformMatrix = mat4.create();
        }

        this.createBuffers();

        if (this.useFan) {
            var fan = new Fan(this.shader, this.pos_buffer, this.normal_buffer, this.vColor, this.n_rows, this.n_cols, this.top_uv_buffer);
            fan.setTexture(this.texture);
            fan.draw(transformMatrix);          
        } else {
            var grid = new Grid(this.shader, this.pos_buffer, this.normal_buffer, this.vColor, this.n_rows, this.n_cols, this.uv_buffer);
            grid.setTexture(this.texture);
            grid.draw(transformMatrix);
        }
    }

    createBuffers() {
        this.pos_buffer = [];
        this.normal_buffer = [];
        this.uv_buffer = [];
        for (var level = 0; level < this.levels; level++) {
            var buffers = this.generateBuffersForLevel(level);
            this.n_cols = (buffers[0].length/3);
            this.pos_buffer = this.pos_buffer.concat(buffers[0]);
            this.normal_buffer = this.normal_buffer.concat(buffers[1]);
            this.uv_buffer = this.uv_buffer.concat(buffers[3]);
        }
    }

    generateBuffersForLevel(level) {
        if (level > this.levels) {
            console.log("ERROR: Level received: " + level);
            console.log("ERROR: Max allowed level: " + this.levels);

        }
        // Get central point of level.
        var direction_vector = vec3.create();
        var minus_start_pos = vec3.create();
        var central_point = vec3.create();
        var topPos = false;

        // If this is the first level, the central_pos should match with the start pos.
        if (level == 0) {
            central_point = this.vStartPos;
        }
        // If this is not the last nor the first level, compute the current pos.
        else if (level != (this.levels -1)) {
            var lvl_step = vec3.distance(this.vStartPos, this.vEndPos) / (this.levels-1);
            vec3.scale(minus_start_pos, this.vStartPos, -1.0);
            vec3.add(direction_vector, this.vEndPos, minus_start_pos);
            vec3.normalize(direction_vector, direction_vector);

            vec3.scale(central_point, direction_vector, level * lvl_step);
            vec3.add(central_point, this.vStartPos, central_point);
        // If this is the last level, the central_pos should match with the end pos.
        } else {
            central_point = this.vEndPos;
            topPos = true;
        }

        var pos_buffer = this.shapeGenerator.getPosBuffer(central_point);
        var normal_buffer = this.shapeGenerator.getNormalBuffer(central_point);
        var uv_buffer = this.shapeGenerator.getUVBuffer(topPos);

        return [pos_buffer, normal_buffer, central_point, uv_buffer];
    }
}