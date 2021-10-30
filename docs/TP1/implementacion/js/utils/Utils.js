class Utils {
    TransformPosBuffer(transformMatrix, buffer) {
        var transformedBuffer = new Array(buffer.length);
        var transformedPos = vec4.create();
        var originalPos = vec4.create();
        
        for (var i = 0; i < buffer.length; i+=3) {
            vec3.set(originalPos, buffer[i], buffer[i+1], buffer[i+2]);
            vec3.transformMat4(transformedPos, originalPos, transformMatrix);
            transformedBuffer[i] = transformedPos[0];
            transformedBuffer[i+1] = transformedPos[1];
            transformedBuffer[i+2] = transformedPos[2];
        }
        
        return transformedBuffer;
    }

    AddRandomNoiseToBufferWithRadius(vRadius, buffer) {
        var transformedBuffer = new Array(buffer.length);
        var newPos = vec4.create();
        
        for (var i = 0; i < buffer.length; i+=3) {
            vec4.set(newPos, buffer[i] + (Math.random()-0.5) * vRadius[0], buffer[i+1] + (Math.random()-0.5) * vRadius[1], buffer[i+2] + (Math.random()-0.5) * vRadius[2], 1);
            transformedBuffer[i] = newPos[0];
            transformedBuffer[i+1] = newPos[1];
            transformedBuffer[i+2] = newPos[2];
        }
        
        return transformedBuffer;
    }

    GetTriangNormal(p1, p2, p3) {
        var aux_p1 = [p2[0] - p1[0], p2[1] - p1[1], p2[2] - p1[2]];
        var aux_p2 = [p3[0] - p1[0], p3[1] - p1[1], p3[2] - p1[2]];
        var cross = Math.cross(aux_p1, aux_p2);
        // Return normalized cross product
        return cross / (cross[0] + cross[1] + cross[2]);
    }
}