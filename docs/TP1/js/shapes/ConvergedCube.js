class ConvergedCube {
    // Draws a cube with one end bigger than the other.
    // The smaller the scaleFactor, the similar it will be to a pyramid.
    // scaleFactor: Scale difference between each end.
    constructor(glProgram, vColor, scaleFactor) {
        this.glProgram = glProgram;
        this.vColor = vColor;
        this.scaleFactor = scaleFactor;
        this.vCentralBottomPos = [0.0, 0.0, 0.0];
        this.vCentralTopPos = [0.0, 0.0, 1.0];
        this.sides = null;
        this.top_fan = null;
        this.bottom_fan = null;
        this.shapeGen = null
    }

    draw(transformMatrix) {
        if (transformMatrix == null) {
            transformMatrix = mat4.create();
        }

        this.shapeGen = new ConvergedCubeShapeGenerator(this.vColor, this.vCentralTopPos, this.vCentralBottomPos, this.scaleFactor);
        this.sides = new LinearExtrusion(this.glProgram, /*levels=*/2, /*vStartPos=*/this.vCentralBottomPos, /*vEndPos=*/this.vCentralTopPos, this.shapeGen);
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
        var top_normal_buffer = this.shapeGen.getNormalBuffer(this.vCentralTopPos);
        top_normal_buffer.push(top_normal_buffer[0]);
        top_normal_buffer.push(top_normal_buffer[1]);
        top_normal_buffer.push(top_normal_buffer[2]);
        var top_color_buffer = this.shapeGen.getColorBuffer(this.vCentralTopPos);
        top_color_buffer.push(top_color_buffer[0]);
        top_color_buffer.push(top_color_buffer[1]);
        top_color_buffer.push(top_color_buffer[2]);
        this.top_fan = new Fan(this.glProgram, top_pos_buffer, top_normal_buffer, top_color_buffer);

        var bottom_pos_buffer = [];
        bottom_pos_buffer.push(this.vCentralBottomPos[0]);
        bottom_pos_buffer.push(this.vCentralBottomPos[1]);
        bottom_pos_buffer.push(this.vCentralBottomPos[2]);
        bottom_pos_buffer = bottom_pos_buffer.concat(this.shapeGen.getPosBuffer(this.vCentralBottomPos));
        var bottom_normal_buffer = this.shapeGen.getNormalBuffer(this.vCentralBottomPos);
        bottom_normal_buffer.push(bottom_normal_buffer[0]);
        bottom_normal_buffer.push(bottom_normal_buffer[1]);
        bottom_normal_buffer.push(bottom_normal_buffer[2]);
        var bottom_color_buffer = this.shapeGen.getColorBuffer(this.vCentralBottomPos);
        bottom_color_buffer.push(bottom_color_buffer[0]);
        bottom_color_buffer.push(bottom_color_buffer[1]);
        bottom_color_buffer.push(bottom_color_buffer[2]);
        this.bottom_fan = new Fan(this.glProgram, bottom_pos_buffer, bottom_normal_buffer, bottom_color_buffer);
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
}