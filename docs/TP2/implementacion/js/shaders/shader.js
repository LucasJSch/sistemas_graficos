class ShaderProgram {
    constructor(vertexSrc, fragmentSrc) {
        var vertexShader = buildShader(gl, vertexSrc, "vertex");

        // agregar utils a frag shader
        fragmentSrc = fragmentSrc +  UTILS_SHADER_SRC;
        var fragmentShader = buildShader(gl, fragmentSrc, "fragment");

        this.program = gl.createProgram();
        gl.attachShader(this.program, vertexShader);
        gl.attachShader(this.program, fragmentShader);
        gl.linkProgram(this.program);

        if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
            alert("Could not initialise shaders");
        }

        this.attribs = {};
        this.unifs = {};

        gl.useProgram(this.program);

        this.attribs.vertexPos = gl.getAttribLocation(this.program, "aVertexPosition");
        gl.enableVertexAttribArray(this.attribs.vertexPos);

        this.attribs.normal = gl.getAttribLocation(this.program, "aVertexNormal");
        gl.enableVertexAttribArray(this.attribs.normal);

        this.unifs.projMatrix = gl.getUniformLocation(this.program, "projMatrix");
        this.unifs.modelMatrix = gl.getUniformLocation(this.program, "modelMatrix");
        this.unifs.viewMatrix = gl.getUniformLocation(this.program, "viewMatrix");
        this.unifs.normalMatrix = gl.getUniformLocation(this.program, "normalMatrix");
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

        this.attribs.color = gl.getAttribLocation(this.program, "aVertexColor");
        gl.enableVertexAttribArray(this.attribs.color);
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

        this.attribs.color = gl.getAttribLocation(this.program, "aVertexColor");
        gl.enableVertexAttribArray(this.attribs.color);

        this.attribs.uv = gl.getAttribLocation(this.program, "aVertexUV");
        gl.enableVertexAttribArray(this.attribs.uv);

        // this.unifs.panelSampler = gl.getUniformLocation(this.program, "uPanelsSampler");
        this.panelTexture = new Texture("js/assets/textures/paneles_solares.jpg");

        // this.unifs.earthSampler = gl.getUniformLocation(this.program, "uEarthSampler");
        this.earthTexture = new Texture("js/assets/textures/tierra.jpg");

        // this.unifs.cilindricoSampler = gl.getUniformLocation(this.program, "uCilindricoSampler");
        this.cilindricoTexture = new Texture("js/assets/textures/cilindrico.jpg");

        this.esfericoTexture = new Texture("js/assets/textures/modulo-esferico.jpg");
    }

    setearParametros() {
        super.setearParametros();

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.panelTexture.gl_tex);
        gl.uniform1i(this.unifs.panelSampler, 0);

        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this.earthTexture.gl_tex);
        gl.uniform1i(this.unifs.earthSampler, 1);

        gl.activeTexture(gl.TEXTURE2);
        gl.bindTexture(gl.TEXTURE_2D, this.cilindricoTexture.gl_tex);
        gl.uniform1i(this.unifs.cilindricoSampler, 2);
    }

    getClrBufPtr() {
        return this.attribs.color;
    }

    getUvBufPtr() {
        return this.attribs.uv;
    }

    getPanelTexture() {
        return this.panelTexture.gl_tex;
    }

    getEarthTexture() {
        return this.earthTexture.gl_tex;
    }

    getModuloCilindricoTexture() {
        return this.cilindricoTexture.gl_tex;
    }

    getModuloEsfericoTexture() {
        return this.esfericoTexture.gl_tex;
    }
}
