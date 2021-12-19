class Grid {
    // Initializes a Grid. 
    constructor(shader, position_buffer, normal_buffer, color, n_rows, n_cols, uv_buffer=[]) {
        this.shader = shader;
        this.position_buffer = position_buffer;
        this.normal_buffer = normal_buffer;
        this.color = color;
        this.n_rows = n_rows;
        this.n_cols = n_cols;
        this.index_buffer = null;
        this.uv_buffer = uv_buffer;
        this.compute_normals = false;

        this.utils = new Utils();
    }

    setTexture(texture) {
        this.texture = texture;
    }

    setComputeNormals() {
        this.compute_normals = true;
    }

    draw(transformMatrix) {
        if (transformMatrix == null) {
            transformMatrix = mat4.create();
        }

        if (this.compute_normals) {
            this.computeNormals();
        }
        
        var normalMatrix = mat4.clone(transformMatrix);

        mat4.invert(normalMatrix, normalMatrix);
        mat4.transpose(normalMatrix, normalMatrix);
        gl.uniformMatrix4fv(this.shader.getNormalMatrixPtr(), false, normalMatrix);
        gl.uniform3fv(this.shader.getUniformColorPtr(), this.color);

        this.createIndexBuffer();
        this.applyTransformation(transformMatrix);
        this.setupBuffers();

        gl.drawElements(gl.TRIANGLE_STRIP, this.index_buffer.length, gl.UNSIGNED_SHORT, 0);
    }

    createIndexBuffer() {
        this.index_buffer = [];
        for (var i = 0; i < this.n_rows-1; i++){
            this.index_buffer.push(i*this.n_cols);
            for (var j = 0; j < this.n_cols-1; j++){
                this.index_buffer.push(i*this.n_cols+j);
                this.index_buffer.push((i+1)*this.n_cols+j);
                this.index_buffer.push(i*this.n_cols+j+1);
                this.index_buffer.push((i+1)*this.n_cols+j+1);
            }
            this.index_buffer.push((i+1)*this.n_cols+this.n_cols-1);
        }
    }

    setupBuffers() {
        // 1. Creamos un buffer para las posiciones dentro del pipeline.
        this.webgl_position_buffer = gl.createBuffer();
        // 2. Le decimos a WebGL que las siguientes operaciones que vamos a ser se aplican sobre el buffer que
        // hemos creado.
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_position_buffer);
        // 3. Cargamos datos de las posiciones en el buffer.
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.position_buffer), gl.STATIC_DRAW);

        this.webgl_normal_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_normal_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normal_buffer), gl.STATIC_DRAW);

        // Repetimos los pasos 1. 2. y 3. para la información de los índices
        // Notar que esta vez se usa ELEMENT_ARRAY_BUFFER en lugar de ARRAY_BUFFER.
        // Notar tambien que se usa un array de enteros en lugar de floats.
        this.webgl_index_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.index_buffer), gl.STATIC_DRAW);

        this.webgl_uv_buffer = gl.createBuffer();
        this.webgl_uv_buffer.itemSize = 2;
        this.webgl_uv_buffer.numItems = this.uv_buffer.length / 2;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_uv_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.uv_buffer), gl.STATIC_DRAW);

        // Cargamos los vértices en el shader.
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_position_buffer);
        gl.vertexAttribPointer(this.shader.getPosBufPtr(), 3, gl.FLOAT, false, 0, 0);
        
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_normal_buffer);
        gl.vertexAttribPointer(this.shader.getNrmBufPtr(), 3, gl.FLOAT, false, 0, 0);
                
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_uv_buffer);
        gl.vertexAttribPointer(this.shader.getUvBufPtr(), 2, gl.FLOAT, false, 0, 0);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this.shader.getEarthReflectionTexture());
        gl.uniform1i(this.shader.getReflectionMapSamplerPtr(), 1);
        
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer);
   }

    applyTransformation(transformMatrix) {
        var utils = new Utils();
        this.position_buffer = utils.TransformPosBuffer(transformMatrix, this.position_buffer);
    }

    computeNormals() {
        this.normal_buffer = [];

        for (var i = 0; i < this.position_buffer.length; i+=9) {
            var aux = this.utils.GetTriangNormal(
                [this.position_buffer[i],   this.position_buffer[i+1], this.position_buffer[i+2]],
                [this.position_buffer[i+3], this.position_buffer[i+4], this.position_buffer[i+5]],
                [this.position_buffer[i+6], this.position_buffer[i+7], this.position_buffer[i+8]]);
            this.normal_buffer.push(aux[0]);
            this.normal_buffer.push(aux[1]);
            this.normal_buffer.push(aux[2]);
        }
    }
}