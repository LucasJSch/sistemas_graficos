class Cylinder {
    // Draws a closed-surface cylinder at the origin with unitary radius and unitary length.
    constructor(glProgram, vColor, pointsPerCircle=100) {
        this.glProgram = glProgram;
        this.vColor = vColor;
        this.pointsPerCircle = pointsPerCircle;
        this.vCentralBottomPos = [0.0, 0.0, 0.0];
        this.vCentralTopPos = [0.0, 0.0, 1.0];
        this.radius = 1.0;
        this.sides = null;
        this.top_fan = null;
        this.bottom_fan = null;
        this.shapeGen = null
    }

    draw(transformMatrix) {
        if (transformMatrix == null) {
            transformMatrix = mat4.create();
        }

        this.shapeGen = new CylinderShapeGenerator(this.pointsPerCircle, this.radius, this.vColor);
        this.sides = new Extrusion(this.glProgram, /*levels=*/2, /*vStartPos=*/this.vCentralBottomPos, /*vEndPos=*/this.vCentralTopPos, this.shapeGen);
        this.createTopAndBottomFans();
        this.sides.draw(transformMatrix);
        this.top_fan.draw(transformMatrix);
        this.bottom_fan.draw(transformMatrix);
    }

    // TODO: Use correctly fan pos buffer. (i.e. first use central pos)
    createTopAndBottomFans() {
        var top_pos_buffer = this.shapeGen.getPosBuffer(this.vCentralTopPos);
        var top_normal_buffer = this.getTopNormalBuffer();
        var top_color_buffer = this.shapeGen.getColorBuffer(this.vCentralTopPos);
        this.top_fan = new Fan(this.glProgram, top_pos_buffer, top_normal_buffer, top_color_buffer);

        var bottom_pos_buffer = this.shapeGen.getPosBuffer(this.vCentralBottomPos);
        var bottom_normal_buffer = this.getBottomNormalBuffer();
        var bottom_color_buffer = this.shapeGen.getColorBuffer(this.vCentralBottomPos);
        this.bottom_fan = new Fan(this.glProgram, bottom_pos_buffer, bottom_normal_buffer, bottom_color_buffer);
    }

    getTopNormalBuffer() {
        var buffer = [];
        for (var i = 0 ; i < this.pointsPerCircle; i++) {
            buffer.push(0.0);
            buffer.push(0.0);
            buffer.push(1.0);
        }
        return buffer;
    }

    getBottomNormalBuffer() {
        var buffer = [];
        for (var i = 0 ; i < this.pointsPerCircle; i++) {
            buffer.push(0.0);
            buffer.push(0.0);
            buffer.push(-1.0);
        }
        return buffer;
    }
}

class CylinderShapeGenerator {
    constructor(pointsPerCircle, radius, vColor) {
        this.pointsPerCircle = pointsPerCircle;
        this.radius = radius;
        this.vColor = vColor;
    }
    
    getPosBuffer(central_pos) {
        var x_0 = central_pos[0];
        var y_0 =  central_pos[1];
        var z_0 = central_pos[2];
        
        var buffer = [];
        for (var i = 0; i < this.pointsPerCircle; i++) {
            buffer.push(x_0 + this.radius*Math.cos(i * 2.0 * Math.PI / this.pointsPerCircle));
            buffer.push(y_0 + this.radius*Math.sin(i * 2.0 * Math.PI / this.pointsPerCircle));
            buffer.push(z_0);
        }
        // We need to connect the shape's end and beginning.
        // Because of this we iterate in the other functions until pointsPerCircle + 1.
        buffer.push(x_0 + this.radius*Math.cos(0));
        buffer.push(y_0 + this.radius*Math.sin(0));
        buffer.push(z_0);

        return buffer;
    }
        
    getNormalBuffer() {
        var buffer = [];
        for (var i = 0; i < this.pointsPerCircle + 1; i++) {
            buffer.push(Math.cos(i * Math.PI * 2.0 / this.pointsPerCircle));
            buffer.push(Math.sin(i * Math.PI * 2.0 / this.pointsPerCircle));
            buffer.push(1.0);
        }
        return buffer;
    }
        
    getColorBuffer(central_pos) {
        var buffer = [];
        for (var i = 0; i < this.pointsPerCircle + 1; i++) {
            buffer.push(this.vColor[0]);
            buffer.push(this.vColor[1]);
            buffer.push(this.vColor[2]);
        }
        return buffer;
    }

    getUVBuffer() {
        return [];
    }
}