class Plane {
    // Initializes a Plane. 
    constructor(glProgram, vLowerLeftPos, vUpperRightPos, vNormal, vColor, n_rows, n_cols) {
        this.glProgram = glProgram;
        this.vLowerLeftPos = vLowerLeftPos;
        this.vUpperRightPos = vUpperRightPos;
        this.vNormal = vNormal;
        this.vColor = vColor;
        this.n_rows = n_rows;
        this.n_cols = n_cols;
        this.grid = null;
    }

    draw() {
        this.createBuffers();
        this.grid = new Grid(glProgram, this.position_buffer, this.normal_buffer, this.color_buffer, this.n_rows, this.n_cols);
        this.grid.draw();
    }

    createBuffers() {
        // 1. Transform the plane to (0,0,0) and (1,1,0)
        // 1.1. Traslate vLowerLeftPos to (0,0,0)
        var first_transformation = mat4.create();
        if (1 + [0.0, 0.0, 0.0] === 1 + this.vLowerLeftPos) { // TODO: Don't use this ugly hack.
            first_transformation = mat4.create();
        } else {
            mat4.fromTranslation(first_transformation, [-this.vLowerLeftPos[0], -this.vLowerLeftPos[1], -this.vLowerLeftPos[2]]);
        }
        // 1.2. Normalize vUpperRightPos
        var normalized_vUpperRightPos = vec3.create();
        vec3.normalize(normalized_vUpperRightPos, this.vUpperRightPos);
        // 1.3. Rotate normalized vUpperRightPos unto (1,1,0)
        var second_transformation = this.getTransformToRotateVectorIntoAnotherVector(normalized_vUpperRightPos, [1.0, 1.0, 0.0]);
        // 1.4. Rotate the whole plane into XY
        vec3.normalize(this.vNormal, this.vNormal);
        var third_transformation = this.getTransformToRotateVectorIntoAnotherVector(this.vNormal, [1.0, 1.0, 0.0]);
        // 1.5. Generate the transformation matrix
        var transform_matrix = mat4.create();
        mat4.mul(transform_matrix, transform_matrix, third_transformation);
        mat4.mul(transform_matrix, transform_matrix, second_transformation);
        mat4.mul(transform_matrix, transform_matrix, first_transformation);


        // 2. Generate the position buffer for the normalized spaces.
        this.position_buffer = [];
        this.normal_buffer = [];
        this.color_buffer = [];
        var step_x = 1.0/this.n_cols;
        var step_y = 1.0/this.n_rows;
        for (var y = 0.0; y < this.n_rows; y++){
            for (var x = 0.0; x < this.n_cols; x++){
                // TODO: Transform here directly and records positions just once.
                this.position_buffer.push(x*step_x);
                this.position_buffer.push(y*step_y);
                this.position_buffer.push(0.0);

                // This is not necessarily correct.
                // The normal is a parameter that allows to know the position of the map,
                // it's not necessarily related to lighting conditions.
                this.normal_buffer.push(this.vNormal[0]);
                this.normal_buffer.push(this.vNormal[1]);
                this.normal_buffer.push(this.vNormal[2]);

                this.color_buffer.push(this.vColor[0]);
                this.color_buffer.push(this.vColor[1]);
                this.color_buffer.push(this.vColor[2]);
            }
          }
        
        
        // 3. Transform the position buffer to the original space.
        // 3.1. Get inverse transformation
        mat4.invert(transform_matrix, transform_matrix);
        // 3.2. Transform

        for (var i = 0; i < this.position_buffer.length; i+=3) {
            var transformed_pos = vec4.create();
            vec4.transformMat4(transformed_pos, [this.position_buffer[i], this.position_buffer[i+1], this.position_buffer[i+2], 1.0],transform_matrix);
            this.position_buffer[i] = transformed_pos[0];
            this.position_buffer[i+1] = transformed_pos[1];
            this.position_buffer[i+2] = transformed_pos[2];
        }

    }

    // Must receive normalized vectors.
    getTransformToRotateVectorIntoAnotherVector(vector_to_rotate, vector_to_rotate_into) {
        // Reference: https://stackoverflow.com/questions/10798954/how-to-rotate-a-vector-to-a-place-that-is-aligned-with-z-axis
        var rotation_angle = vec3.dot(vector_to_rotate, vector_to_rotate_into);
        var axis_of_rotation = vec3.create();
        vec3.cross(axis_of_rotation, vector_to_rotate, vector_to_rotate_into);
        var transformation = mat4.create();
        mat4.fromRotation(transformation, rotation_angle, axis_of_rotation);
        return transformation;
    }
}