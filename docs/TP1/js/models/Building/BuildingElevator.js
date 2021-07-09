class BuildingElevator {
    // Draws the elevator of a building.
    // shapeGen: Defines the contour of the elevator.
    constructor(glProgram, texture, nFloors, shapeGen, height) {
        this.glProgram = glProgram;
        this.texture = new TextureLoader("textures/concrete.jpg");
        this.rectangle = new LinearExtrusion(glProgram, nFloors, /*vStartPos=*/[0.0, 0.0, 0.0], /*vEndPos=*/[0.0, 0.0, height], shapeGen, /*useFan=*/false, this.texture.getTexture());
    }

    draw(transformMatrix) {
        this.rectangle.draw(transformMatrix);
    }
}

class TextureLoader {
    constructor(textureFile) {
        this.texture = gl.createTexture();
        this.image = global["imgs"][textureFile];
        this.handleTexture(this.texture, this.image);
    }

    getTexture() {
        return this.texture;
    }

    handleTexture(textureR, imageR) {
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.bindTexture(gl.TEXTURE_2D, textureR);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imageR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.bindTexture(gl.TEXTURE_2D, null);
    }
}

