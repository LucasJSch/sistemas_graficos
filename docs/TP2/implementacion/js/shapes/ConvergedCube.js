class ConvergedCube {
    // Draws a cube with one end bigger than the other.
    // The smaller the scaleFactor, the similar it will be to a pyramid.
    // scaleFactor: Scale difference between each end.
    constructor(shader, vColor, scaleFactor) {
        this.shader = shader;
        this.vColor = vColor;
        this.scaleFactor = scaleFactor;
        this.vCentralBottomPos = [0.0, 0.0, 0.0];
        this.vCentralTopPos = [0.0, 0.0, 1.0];
        this.sides = null;
        this.top_fan = null;
        this.bottom_fan = null;
        this.shapeGen = null

        this.top_fan_uv_buf = [];
    }

    draw(transformMatrix) {
        if (transformMatrix == null) {
            transformMatrix = mat4.create();
        }

        this.shapeGen = new ConvergedCubeShapeGenerator(this.vColor, this.vCentralTopPos, this.vCentralBottomPos, this.scaleFactor);
        this.sides = new Extrusion(this.shader, /*levels=*/2, /*vStartPos=*/this.vCentralBottomPos, /*vEndPos=*/this.vCentralTopPos, this.shapeGen);
        this.createTopAndBottomFans();
        this.sides.draw(transformMatrix);
        this.top_fan.draw(transformMatrix);
        this.bottom_fan.draw(transformMatrix);
    }

    createTopAndBottomFans() {
        var top_pos_buffer = [];
        top_pos_buffer.push(this.vCentralTopPos[0]);
        top_pos_buffer.push(this.vCentralTopPos[1]);
        top_pos_buffer.push(this.vCentralTopPos[2]);
        top_pos_buffer = top_pos_buffer.concat(this.shapeGen.getPosBuffer(this.vCentralTopPos));

        var top_normal_buffer = [];
        for (var i = 0; i < top_pos_buffer.length; i+=3) {
            top_normal_buffer.push(0.0);
            top_normal_buffer.push(0.0);
            top_normal_buffer.push(1.0);
        }

        var top_color_buffer = this.shapeGen.getColorBuffer(this.vCentralTopPos);
        top_color_buffer.push(top_color_buffer[0]);
        top_color_buffer.push(top_color_buffer[1]);
        top_color_buffer.push(top_color_buffer[2]);

        this.top_fan_uv_buf = this.top_fan_uv_buf.concat(this.shapeGen.getUVBuffer_internal(this.vCentralTopPos));

        this.top_fan = new Fan(this.shader, top_pos_buffer, top_normal_buffer, top_color_buffer, this.top_fan_uv_buf);

        var bottom_pos_buffer = [];
        bottom_pos_buffer.push(this.vCentralBottomPos[0]);
        bottom_pos_buffer.push(this.vCentralBottomPos[1]);
        bottom_pos_buffer.push(this.vCentralBottomPos[2]);
        bottom_pos_buffer = bottom_pos_buffer.concat(this.shapeGen.getPosBuffer(this.vCentralBottomPos));

        var bottom_normal_buffer = [];
        for (var i = 0; i < bottom_pos_buffer.length; i+=3) {
            bottom_normal_buffer.push(0.0);
            bottom_normal_buffer.push(0.0);
            bottom_normal_buffer.push(-1.0);
        }

        var bottom_color_buffer = this.shapeGen.getColorBuffer(this.vCentralBottomPos);
        bottom_color_buffer.push(bottom_color_buffer[0]);
        bottom_color_buffer.push(bottom_color_buffer[1]);
        bottom_color_buffer.push(bottom_color_buffer[2]);
        this.bottom_fan = new Fan(this.shader, bottom_pos_buffer, bottom_normal_buffer, bottom_color_buffer, this.top_fan_uv_buf);
    }
}

class ConvergedCubeShapeGenerator {
    constructor(vColor, vCentralTopPos, vCentralBottomPos, scaleFactor) {
        this.vColor = vColor;
        this.vCentralTopPos = vCentralTopPos;
        this.vCentralBottomPos = vCentralBottomPos;
        this.scaleFactor = scaleFactor;
    }
    
    getPosBuffer(central_pos) {
        var radius = 0.5;
        if (central_pos == this.vCentralTopPos) {
            radius = radius * this.scaleFactor;
        }
        
        var x_0 = central_pos[0];
        var y_0 =  central_pos[1];
        var z_0 = central_pos[2];
        
        var buffer = [];
        buffer.push(x_0 + radius);
        buffer.push(y_0 + radius);
        buffer.push(z_0);
        buffer.push(x_0 - radius);
        buffer.push(y_0 + radius);
        buffer.push(z_0);
        buffer.push(x_0 - radius);
        buffer.push(y_0 - radius);
        buffer.push(z_0);
        buffer.push(x_0 + radius);
        buffer.push(y_0 - radius);
        buffer.push(z_0);
        buffer.push(x_0 + radius);
        buffer.push(y_0 + radius);
        buffer.push(z_0);

        return buffer;
    }
        
    // TODO: Fix this. This is incorrect.
    getNormalBuffer(central_pos) {
        var buffer = [];
        for (var i = 0; i < 5; i++) {
            buffer.push(0.0);
            buffer.push(0.0);
            buffer.push(1.0);
        }
        return buffer;
    }
        
    getColorBuffer(central_pos) {
        var buffer = [];
        for (var i = 0; i < 5; i++) {
            buffer.push(this.vColor[0]);
            buffer.push(this.vColor[1]);
            buffer.push(this.vColor[2]);
        }
        return buffer;
    }

    getUVBuffer(pos) {
        var buffer = [];

        buffer.push(0.0);
        buffer.push(0.0);

        buffer.push(1.0);
        buffer.push(0.0);

        buffer.push(1.0);
        buffer.push(1.0);

        buffer.push(0.0);
        buffer.push(1.0);

        buffer.push(0.0);
        buffer.push(0.0);

        return buffer;
    }

    getUVBuffer_internal(pos) {
        var buffer = [];

        // // First goes the central location because we're using fans.
        buffer.push(0.5);
        buffer.push(0.5);

        buffer.push(0.0);
        buffer.push(0.0);

        buffer.push(1.0);
        buffer.push(0.0);

        buffer.push(1.0);
        buffer.push(1.0);

        buffer.push(0.0);
        buffer.push(1.0);

        buffer.push(0.0);
        buffer.push(0.0);

        return buffer;
    }
}