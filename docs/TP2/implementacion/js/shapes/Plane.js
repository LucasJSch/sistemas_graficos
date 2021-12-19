class Plane {
    // Initializes a plane with a diagonal that goes from (0,0,0) to (1,1,0), normal to the z axis.
    constructor(shader, vColor, n_rows=50, n_cols=50) {
        this.shader = shader;
        this.vColor = vColor;
        this.n_rows = n_rows;
        this.n_cols = n_cols;
        this.grid = null;
    }

    setTexture(texture) {
        this.texture = texture;
    }

    draw(transformMatrix) {
        if (transformMatrix == null) {
            transformMatrix = mat4.create();
        }

        this.createBuffers(transformMatrix);
        this.grid = new Grid(this.shader, this.position_buffer, this.normal_buffer, this.color_buffer, this.n_rows, this.n_cols, this.uv_buffer);
        this.grid.setTexture(this.texture);
        this.grid.draw();
    }

    createBuffers(transformMatrix) {
        this.position_buffer = [];
        this.normal_buffer = [];
        this.color_buffer = [];
        this.uv_buffer = [];
        var step_x = 1.0/this.n_cols;
        var step_y = 1.0/this.n_rows;
        var transformed_pos = vec4.create();
        var current_pos = vec4.create();
        for (var y = 0.0; y < this.n_rows; y++){
            for (var x = 0.0; x < this.n_cols; x++){
                vec4.set(current_pos, x*step_x, y*step_y, 0.0, 1.0);
                vec4.transformMat4(transformed_pos, current_pos, transformMatrix);
                this.position_buffer.push(transformed_pos[0]);
                this.position_buffer.push(transformed_pos[1]);
                this.position_buffer.push(transformed_pos[2]);

                this.normal_buffer.push(0.0);
                this.normal_buffer.push(0.0);
                this.normal_buffer.push(1.0);

                this.uv_buffer.push(y / this.n_rows);
                this.uv_buffer.push(x / this.n_cols);

                this.color_buffer.push(this.vColor[0]);
                this.color_buffer.push(this.vColor[1]);
                this.color_buffer.push(this.vColor[2]);
            }
          }
    }
}