class ShaderProgram {
    constructor(vertexSrc, fragmentSrc) {
        var vertexShader = buildShader(gl, vertexSrc, "vertex");

        // agregar utils a frag shader
        // fragmentSrc = UTILS_SHADER_SRC + fragmentSrc;
        var fragmentShader = buildShader(gl, fragmentSrc, "fragment");

        this.program = gl.createProgram();
        gl.attachShader(this.program, vertexShader);
        gl.attachShader(this.program, fragmentShader);
        gl.linkProgram(this.program);

        // console.log(vertexSrc, this.program, vertexShader, fragmentShader);
        if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
            alert("Could not initialise shaders");
        }

        this.attribs = {};
        this.unifs = {};

        gl.useProgram(this.program);

        // definir attribs y unifs comunes a todos los shaders

        this.attribs.vertexPos = gl.getAttribLocation(this.program, "aVertexPosition");
        gl.enableVertexAttribArray(this.attribs.vertexPos);

        this.attribs.normal = gl.getAttribLocation(this.program, "aVertexNormal");
        gl.enableVertexAttribArray(this.attribs.normal);

        this.unifs.projMatrix = gl.getUniformLocation(this.program, "projMatrix");
        this.unifs.modelMatrix = gl.getUniformLocation(this.program, "modelMatrix");
        this.unifs.viewMatrix = gl.getUniformLocation(this.program, "viewMatrix");
        this.unifs.normalMatrix = gl.getUniformLocation(this.program, "normalMatrix");

        // this.attribs.texCoord = gl.getAttribLocation(this.program, "aVertexUV");
        // gl.enableVertexAttribArray(this.attribs.texCoord);

        // this.unifs.shininess = gl.getUniformLocation(this.program, "uShininess");
        // this.unifs.usarVariosSampleos = gl.getUniformLocation(this.program, "uUsarVariosSampleos");
    }

    setearParametros() {
        gl.useProgram(this.program);

        gl.uniformMatrix4fv(this.unifs.viewMatrix, false, viewMatrix);
        gl.uniformMatrix4fv(this.unifs.projMatrix, false, projMatrix);
        gl.uniformMatrix4fv(this.unifs.normalMatrix, false, normalMatrix);
        gl.uniformMatrix4fv(this.unifs.projMatrix, false, projMatrix);
    }

    getProgram() {
        return this.program;
    }

    getPosBufPtr() {
        return this.attribs.vertexPos;
    }

    getUvBufPtr() {
        return this.attribs.texCoord;
    }

    getProjMatrixPtr() {
        return this.unifs.projMatrix;
    }

    getModelMatrixPtr() {
        return this.unifs.modelMatrix;
    }

    getViewMatrixPtr() {
        return this.unifs.viewMatrix;
    }

    getNormalMatrixPtr() {
        return this.unifs.normalMatrix;
    }

    getNrmBufPtr() {
        return this.attribs.normal;
    }
}


class MainProgram extends ShaderProgram {
    constructor() {
        super(MAIN_VRTXSHADER_SRC, FRAGMENT_SHADER_SRC);

        // setear attribs y unifs particulares de este shader

        
        this.attribs.color = gl.getAttribLocation(this.program, "aVertexColor");
        gl.enableVertexAttribArray(this.attribs.color);
        
        // this.unifs.color = gl.getUniformLocation(this.program, "uColor");
        // this.unifs.deltaSampler = gl.getUniformLocation(this.program, "uDeltaSampler");
        // this.unifs.sampler = gl.getUniformLocation(this.program, "uSampler");
        // this.unifs.samplerMapaReflexion = gl.getUniformLocation(this.program, "uSamplerMapaReflexion");        
        // this.unifs.factorReflexion = gl.getUniformLocation(this.program, "uFactorReflexion");
    }

    setearParametros() {
        super.setearParametros();
    }

    getClrBufPtr() {
        return this.attribs.color;
    }




}

class PanelsProgram extends ShaderProgram {
    constructor() {
        super(MAIN_VRTXSHADER_SRC, FRAGMENT_SHADER_SRC);

        // setear attribs y unifs particulares de este shader
        
        this.attribs.color = gl.getAttribLocation(this.program, "aVertexColor");
        gl.enableVertexAttribArray(this.attribs.color);
        
    }

    setearParametros() {
        super.setearParametros();
        gl.uniformMatrix4fv(this.unifs.normalMatrix, false, projMatrix);
        gl.uniformMatrix4fv(this.unifs.projMatrix, false, projMatrix);
    }

    getClrBufPtr() {
        return this.attribs.color;
    }


}