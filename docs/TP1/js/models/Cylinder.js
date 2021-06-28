class Cylinder {
    // Draws a closed-surface cylinder at the origin with unitary radius and unitary length.
    constructor(glProgram, vColor, pointsPerCircle=1000) {
        this.glProgram = glProgram;
        this.vColor = vColor;
        this.pointsPerCircle = pointsPerCircle;
        this.vCentralBottomPos = [0.0, 0.0, 0.0];
        this.vCentralTopPos = [0.0, 0.0, 1.0];
        this.length = 1.0;
        this.radius = 1.0;
        this.sides = null;
        this.top_fan = null;
        this.bottom_fan = null;
    }

    draw(transformMatrix) {
        // TODO: Apply transformation matrix to pos.
        if (transformMatrix == null) {
            transformMatrix = mat4.create();
        }

        this.sides = new LinearExtrusion(this.glProgram, /*levels=*/2, /*vStartPos=*/this.vCentralBottomPos, /*vEndPos=*/this.vCentralTopPos, this.fShapePos, this.fShapeNormal, this.fShapeColor);
        this.createTopAndBottomFans();
        this.sides.draw();
        this.top_fan.draw();
        this.bottom_fan.draw();
    }

    createTopAndBottomFans() {
        var top_pos_buffer = this.fShapePos(this.vCentralTopPos);
        var top_normal_buffer = this.fShapeNormal(this.vCentralTopPos);
        var top_color_buffer = this.fShapeColor(this.vCentralTopPos);
        this.top_fan = new Fan(this.glProgram, top_pos_buffer, top_normal_buffer, top_color_buffer);

        var bottom_pos_buffer = this.fShapePos(this.vCentralBottomPos);
        var bottom_normal_buffer = this.fShapeNormal(this.vCentralBottomPos);
        var bottom_color_buffer = this.fShapeColor(this.vCentralBottomPos);
        this.bottom_fan = new Fan(this.glProgram, bottom_pos_buffer, bottom_normal_buffer, bottom_color_buffer);
    }

    // TODO: This is z-axis centered. Make this generic.
    fShapePos(central_pos) {
        var x_0 = central_pos[0];
        var y_0 =  central_pos[1];
        var z_0 = central_pos[2];
    
        var buffer = [];
        var n = this.pointsPerCircle;
        for (var i = 0; i < n; i++) {
            buffer.push(x_0 + this.radius*Math.cos(i * 2.0 * Math.PI / n));
            buffer.push(y_0 + this.radius*Math.sin(i * 2.0 * Math.PI / n));
            buffer.push(z_0);
        }
        return buffer;
    }
    
    // TODO: Fix this. This is incorrect.
    fShapeNormal(central_pos) {
        var buffer = [];
        var n = this.pointsPerCircle;
        for (var i = 0; i < n; i++) {
            buffer.push(0.0);
            buffer.push(0.0);
            buffer.push(1.0);
        }
        return buffer;
    }
    
    fShapeColor(central_pos) {
        var buffer = [];
        var n = this.pointsPerCircle;
        for (var i = 0; i < n; i++) {
            buffer.push(this.vColor[0]);
            buffer.push(this.vColor[1]);
            buffer.push(this.vColor[2]);
        }
        return buffer;
    }
}