class Texture {
    static TEX_CACHE = {};

    constructor(textureFile) {
        this.gl_tex = null;
        this.finished = false;
        this.initTexture(textureFile);
    }

    initTexture(textureFile) {
        if (Texture.TEX_CACHE[textureFile] != null) {
			this.gl_tex = Texture.TEX_CACHE[textureFile];
		}

        this.gl_tex = gl.createTexture();
        this.gl_tex.image = new Image();

        this.gl_tex.image.onload = () => this.onTextureLoaded(this.gl_tex);
        this.gl_tex.image.src = textureFile;

        Texture.TEX_CACHE[textureFile] = this.gl_tex;
    };

    onTextureLoaded(tex) {
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, tex.image);
        // gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 4, 0, gl.RGBA, gl.UNSIGNED_BYTE,
        //     new Uint8Array([255, 0, 0, 255,
        //                     0, 255, 0, 255,
        //                     0, 0, 255, 255,
        //                     0, 0, 0, 255])); // red
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
        gl.generateMipmap(gl.TEXTURE_2D);

        gl.bindTexture(gl.TEXTURE_2D, null);
        this.finished = true;
    };

}
