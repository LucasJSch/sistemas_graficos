class ShaderProgram {
    constructor(vertexSrc, fragmentSrc) {
        var vertexShader = buildShader(gl, vertexSrc, "vertex");

        // agregar utils a frag shader
        fragmentSrc = UTILS_SHADER_SRC + fragmentSrc;
        console.log(fragmentSrc);
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

        this.unifs.shininess = gl.getUniformLocation(this.program, "uShininess");
        this.unifs.capsuleSpotlightPos = gl.getUniformLocation(this.program, "uCapsuleSpotlightPos");
        this.unifs.capsuleSpotlightDirection = gl.getUniformLocation(this.program, "uCapsuleSpotlightDirection");
        this.unifs.capsuleRedLightPos = gl.getUniformLocation(this.program, "uCapsuleRedLightPos");
        this.unifs.capsuleGreenLightPos = gl.getUniformLocation(this.program, "uCapsuleGreenLightPos");
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

    getShininessPtr() {
        return this.unifs.shininess;
    }

    getCapsuleSpotlightPosPtr() {
        return this.unifs.capsuleSpotlightPos;
    }

    getCapsuleSpotlightDirPtr() {
        return this.unifs.capsuleSpotlightDirection;
    }

    getCapsuleGreenLightPosPtr() {
        return this.unifs.capsuleGreenLightPos;
    }

    getCapsuleRedLightPosPtr() {
        return this.unifs.capsuleRedLightPos;
    }
}


class PanelsProgram extends ShaderProgram {
    constructor() {
        super(MAIN_VRTXSHADER_SRC, FRAGMENT_SHADER_SRC);

        this.attribs.uv = gl.getAttribLocation(this.program, "aVertexUV");
        gl.enableVertexAttribArray(this.attribs.uv);

        this.unifs.uColor = gl.getUniformLocation(this.program, "uColor");
        this.unifs.uDontUseLight = gl.getUniformLocation(this.program, "uDontUseLight");

        this.unifs.panelSampler = gl.getUniformLocation(this.program, "uTextureSampler");
        this.panelTexture = new Texture("js/assets/textures/paneles_solares.jpg");

        this.unifs.samplerReflectionMap = gl.getUniformLocation(this.program, "uSamplerReflectionMap");   
        this.unifs.reflectionFactor = gl.getUniformLocation(this.program, "uReflectionFactor");   
        
        this.earthTexture = new Texture("js/assets/textures/tierra.jpg");
        this.cilindricoTexture = new Texture("js/assets/textures/cilindrico.jpg");
        this.esfericoTexture = new Texture("js/assets/textures/esferico.jpg");
        this.moduloTexture = new Texture("js/assets/textures/modulo.jpg");
        this.capsuleTexture = new Texture("js/assets/textures/shiphull.jpg");
        this.sunTexture = new Texture("js/assets/textures/8k_sun.jpg");
        this.moonTexture = new Texture("js/assets/textures/luna.jpg");
        this.spaceTexture = new Texture("js/assets/textures/8k_stars_milky_way.jpg");
        this.earthReflectionTexture = new Texture("js/assets/textures/earth_refmap.jpg");
        this.metalTexture = new Texture("js/assets/textures/metal_texture.jpg");
    }

    setearParametros() {
        super.setearParametros();
        gl.uniform1f(this.unifs.uDontUseLight, 0.0);
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

    getModuloTexture() {
        return this.moduloTexture.gl_tex;
    }

    getCapsuleTexture() {
        return this.capsuleTexture.gl_tex;
    }

    getSunTexture() {
        return this.sunTexture.gl_tex;
    }

    getMoonTexture() {
        return this.moonTexture.gl_tex;
    }

    getSpaceTexture() {
        return this.spaceTexture.gl_tex;
    }

    getUniformColorPtr() {
        return this.unifs.uColor;
    }

    getDontUseLightPtr() {
        return this.unifs.uDontUseLight;
    }

    getReflectionFactorPtr() {
        return this.unifs.reflectionFactor;
    }

    getReflectionMapSamplerPtr() {
        return this.unifs.samplerReflectionMap;
    }

    getEarthReflectionTexture() {
        return this.earthReflectionTexture.gl_tex;
    }

    getMetalTexture() {
        return this.metalTexture.gl_tex;
    }
}
