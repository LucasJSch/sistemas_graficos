class LinearExtrusionWithFillings {
    constructor(shader, levels, vStartPos, vEndPos, shapeGenerator) {
        this.shader = shader;
        this.shapeGenerator = shapeGenerator;
        this.extrusion = new LinearExtrusion(shader, levels, vStartPos, vEndPos, shapeGenerator);
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
            var clrBuf = buffers[2];
            var nrmBuf = [];
            if (level == 0) { // bottom
                nrmBuf = this.shapeGenerator.getNormalBufferBottom();
            }
            if (level == 1) { // top
                nrmBuf = this.shapeGenerator.getNormalBufferTop();
            }

            // Add center pos at the beginning as the fan's center.
            posBuf.unshift(buffers[3][2]);
            posBuf.unshift(buffers[3][1]);
            posBuf.unshift(buffers[3][0]);
            // Add last point to close the fan.
            posBuf.push(posBuf[3]);
            posBuf.push(posBuf[4]);
            posBuf.push(posBuf[5]);

            nrmBuf.unshift(nrmBuf[0]);
            nrmBuf.unshift(nrmBuf[1]);
            nrmBuf.unshift(nrmBuf[2]);
            nrmBuf.unshift(nrmBuf[0]);
            nrmBuf.unshift(nrmBuf[1]);
            nrmBuf.unshift(nrmBuf[2]);

            clrBuf.unshift(buffers[2][0]);
            clrBuf.unshift(buffers[2][1]);
            clrBuf.unshift(buffers[2][2]);
            clrBuf.unshift(buffers[2][0]);
            clrBuf.unshift(buffers[2][1]);
            clrBuf.unshift(buffers[2][2]);

            var fan = new Fan(this.shader, posBuf, nrmBuf, clrBuf);
            fan.draw(transformMatrix);
        }
        this.extrusion.draw(transformMatrix);
    }

}