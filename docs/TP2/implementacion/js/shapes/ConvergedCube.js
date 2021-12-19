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

    setTexture(texture) {
        this.texture = texture;
    }

    draw(transformMatrix) {
        if (transformMatrix == null) {
            transformMatrix = mat4.create();
        }

        this.shapeGen = new ConvergedCubeShapeGenerator(this.vCentralTopPos, this.vCentralBottomPos, this.scaleFactor);
        this.sides = new Extrusion(this.shader, /*levels=*/2, /*vStartPos=*/this.vCentralBottomPos, /*vEndPos=*/this.vCentralTopPos, this.shapeGen, this.vColor);
        this.sides.setTexture(this.texture);
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

        this.top_fan_uv_buf = this.top_fan_uv_buf.concat(this.shapeGen.getUVBuffer_internal(this.vCentralTopPos));

        this.top_fan = new Fan(this.shader, top_pos_buffer, top_normal_buffer, this.vColor, this.top_fan_uv_buf);
        this.top_fan.setTexture(this.texture);

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

        this.bottom_fan = new Fan(this.shader, bottom_pos_buffer, bottom_normal_buffer, this.vColor, this.top_fan_uv_buf);
        this.bottom_fan.setTexture(this.texture);
    }
}

class ConvergedCubeShapeGenerator {
    constructor(vCentralTopPos, vCentralBottomPos, scaleFactor) {
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
        
    getNormalBuffer(central_pos) {
        var buffer = [];

        buffer.push(1.0);
        buffer.push(1.0);
        buffer.push(0.0);

        buffer.push(-1.0);
        buffer.push(1.0);
        buffer.push(0.0);

        buffer.push(-1.0);
        buffer.push(-1.0);
        buffer.push(0.0);

        buffer.push(1.0);
        buffer.push(-1.0);
        buffer.push(0.0);

        buffer.push(1.0);
        buffer.push(1.0);
        buffer.push(0.0);

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