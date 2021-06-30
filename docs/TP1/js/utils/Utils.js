class Utils {
    TransformPosBuffer(transformMatrix, buffer) {
        var transformedBuffer = new Array(buffer.length);
        var transformedPos = vec4.create();
        var originalPos = vec4.create();
        
        for (var i = 0; i < buffer.length; i+=3) {
            vec4.set(originalPos, buffer[i], buffer[i+1], buffer[i+2], 1)
            mat4.mul(transformedPos, transformMatrix, originalPos);
            transformedBuffer[i] = transformedPos[0];
            transformedBuffer[i+1] = transformedPos[1];
            transformedBuffer[i+2] = transformedPos[2];
        }
        
        return transformedBuffer;
    }
}