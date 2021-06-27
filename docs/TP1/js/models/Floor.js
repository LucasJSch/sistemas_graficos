class Floor {
    // Initializes a Floor. 
    // glProgram: context variable.
    // vColor: the color of the plane.
    // vNormal: the normal vector of the plane.
    // vStartPos: the (0,0) position of the plane.
    // vEndPos: the (1,1) position of the plane.
    //
    // Explanatory drawing:
    //
    //               ------------- (1,1)
    //              |             |
    //              |             |
    //              |             |
    //        (0,0)  -------------
    constructor(glProgram, vColor, vNormal, vStartPos, vEndPos) {
        this.index_buffer = null;
        this.position_buffer = null;
        this.normal_buffer = null;
        this.color_buffer = null;
        this.vColor = vColor;
        this.vNormal = vNormal;
        this.vStartPos = vStartPos;
        this.vEndPos = vEndPos;
        this.n_cols = 100;
        this.n_rows = 100;
        this.glProgram = glProgram;
    }

    draw() {
        this.createIndexBuffer();
        this.createPropertiesBuffers();
        this.setupBuffers();

        // Dibujamos.
        gl.drawElements(gl.TRIANGLE_STRIP, this.index_buffer.length, gl.UNSIGNED_SHORT, 0);
    }

    createIndexBuffer() {
        this.index_buffer = [];
        for (var i=0;i<this.n_rows-1;i++){
            this.index_buffer.push(i*this.n_cols);
            for (var j=0;j<this.n_cols-1;j++){
                this.index_buffer.push(i*this.n_cols+j);
                this.index_buffer.push((i+1)*this.n_cols+j);
                this.index_buffer.push(i*this.n_cols+j+1);
                this.index_buffer.push((i+1)*this.n_cols+j+1);
            }
            this.index_buffer.push((i+1)*this.n_cols+this.n_cols-1);
        }
    }

    createPropertiesBuffers() {
        this.position_buffer = [];
        this.normal_buffer = [];
        this.color_buffer = [];
        for (var y = 0.0; y < this.n_rows; y++){
            for (var x = 0.0; x < this.n_cols; x++){
              this.position_buffer.push(x*0.01);
              this.position_buffer.push(y*0.01);
              this.position_buffer.push(0.0);

              // This is not necessarily correct.
              // The normal is a parameter that allows to know the position of the map,
              // it's not necessarily related to lighting conditions.
              this.normal_buffer.push(this.vNormal[0]);
              this.normal_buffer.push(this.vNormal[0]);
              this.normal_buffer.push(this.vNormal[0]);

              this.color_buffer.push(this.vColor[0]);
              this.color_buffer.push(this.vColor[1]);
              this.color_buffer.push(this.vColor[2]);
            }
          }
    }

    setupBuffers() {
        gl.useProgram(this.glProgram);
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
        // Notar tambi�n que se usa un array de enteros en lugar de floats.
        this.webgl_index_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.index_buffer), gl.STATIC_DRAW);

        this.webgl_color_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_color_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.color_buffer), gl.STATIC_DRAW);



        // Cargamos los vértices en el shader.
        var vertexPositionAttribute = gl.getAttribLocation(this.glProgram, "aVertexPosition");
        gl.enableVertexAttribArray(vertexPositionAttribute);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_position_buffer);
        gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
        
        var vertexNormalAttribute = gl.getAttribLocation(glProgram, "aVertexNormal");
        gl.enableVertexAttribArray(vertexNormalAttribute);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_normal_buffer);
        gl.vertexAttribPointer(vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);
                
        var colorAttribute = gl.getAttribLocation(glProgram, "aVertexColor");
        gl.enableVertexAttribArray(colorAttribute);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webgl_color_buffer);
        gl.vertexAttribPointer(colorAttribute, 3, gl.FLOAT, false, 0, 0);
        
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webgl_index_buffer);
        // // Se usa la matriz de modelado mv.
        // var u_model_view_matrix = gl.getUniformLocation(this.glProgram, "uMVMatrix");
        // gl.uniformMatrix4fv(u_model_view_matrix, false, mv);
        
        // // Matriz de transformación de normales mn.
        // var mn = mat4.create();
        // mat4.invert(mn, mv);
        // mat4.transpose(mn,mn);
        // var u_normal_matrix = gl.getUniformLocation(this.glProgram, "uNMatrix");
        // gl.uniformMatrix4fv(u_normal_matrix, false, mn);
   }
}