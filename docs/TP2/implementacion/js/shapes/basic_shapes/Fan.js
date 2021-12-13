class Fan {
    // Initializes a Fan. 
    constructor(shader, position_buffer, normal_buffer, color_buffer, uv_buffer=[]) {
        this.shader = shader;
        this.position_buffer = position_buffer;
        this.normal_buffer = normal_buffer;
        this.color_buffer = color_buffer;
        this.index_buffer = null;
        this.uv_buffer = uv_buffer;
        this.texture = null;

        console.log("pos buffer len: " + position_buffer.length);
        console.log("normal_buffer len: " + normal_buffer.length);
        console.log("color_buffer len: " + color_buffer.length);
        console.log("uv_buffer len: " + uv_buffer.length);
    }

    setTexture(texture) {
        this.texture = texture;
    }

    draw(transformMatrix) {
        if (transformMatrix == null) {
            transformMatrix = mat4.create();
        }

        this.createIndexBuffer();
        this.applyTransformation(transformMatrix);
        this.setupBuffers();

        gl.drawElements(gl.TRIANGLE_FAN, this.index_buffer.length, gl.UNSIGNED_SHORT, 0);
    }

    getPosBuffer() {
        return this.position_buffer;
    }
    
    createIndexBuffer() {
        var len = this.color_buffer.length/3;
        this.index_buffer = [];
        for (var i = 0; i < len; i++){
                this.index_buffer.push(i);
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
        this.webgl_color_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_color_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.color_buffer), gl.STATIC_DRAW);



        // Cargamos los vértices en el shader.
        // var vertexPositionAttribute = gl.getAttribLocation(this.glProgram, "aVertexPosition");
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_position_buffer);
        gl.vertexAttribPointer(this.shader.getPosBufPtr(), 3, gl.FLOAT, false, 0, 0);
        
        // var vertexNormalAttribute = gl.getAttribLocation(this.glProgram, "aVertexNormal");
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_normal_buffer);
        gl.vertexAttribPointer(this.shader.getNrmBufPtr(), 3, gl.FLOAT, false, 0, 0);
                
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_uv_buffer);
        gl.vertexAttribPointer(this.shader.getUvBufPtr(), 2, gl.FLOAT, false, 0, 0);
        gl.activeTexture(gl.TEXTURE0);
        console.log(this.texture);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_color_buffer);
        gl.vertexAttribPointer(this.shader.getClrBufPtr(), 3, gl.FLOAT, false, 0, 0);
        
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer);
    }

    applyTransformation(transformMatrix) {
        var utils = new Utils();
        this.position_buffer = utils.TransformPosBuffer(transformMatrix, this.position_buffer);
    }
}