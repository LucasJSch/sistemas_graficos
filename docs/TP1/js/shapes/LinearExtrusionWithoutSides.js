class LinearExtrusionWithoutSides {
    constructor(glProgram, levels, vStartPos, vEndPos, shapeGenerator) {
        this.glProgram = glProgram;
        this.extrusion = new LinearExtrusion(glProgram, levels, vStartPos, vEndPos, shapeGenerator);
        this.levels = levels;

        this.fillings_fans = [];
    }

    draw(transformMatrix) {
        if (transformMatrix == null) {
            transformMatrix = mat4.create();
        }

        for (var level = 0; level < this.levels; level++) {
            var buffers = this.extrusion.generateBuffersForLevel(level);
            var posBuf = buffers[0];
            var nrmBuf = buffers[1];
            var clrBuf = buffers[2];

            // Add center pos at the beginning as the fan's center.
            posBuf.unshift(buffers[3][2]);
            posBuf.unshift(buffers[3][1]);
            posBuf.unshift(buffers[3][0]);
            // Add last point to close the fan.
            posBuf.push(posBuf[3]);
            posBuf.push(posBuf[4]);
            posBuf.push(posBuf[5]);

            nrmBuf.unshift(buffers[1][2]);
            nrmBuf.unshift(buffers[1][2]);
            nrmBuf.unshift(buffers[1][2]);
            nrmBuf.unshift(buffers[1][2]);
            nrmBuf.unshift(buffers[1][2]);
            nrmBuf.unshift(buffers[1][2]);

            clrBuf.unshift(buffers[2][2]);
            clrBuf.unshift(buffers[2][2]);
            clrBuf.unshift(buffers[2][2]);
            clrBuf.unshift(buffers[2][2]);
            clrBuf.unshift(buffers[2][2]);
            clrBuf.unshift(buffers[2][2]);

            var fan = new Fan(this.glProgram, posBuf, nrmBuf, clrBuf);
            fan.draw(transformMatrix);
        }
        this.extrusion.draw(transformMatrix);
    }

}