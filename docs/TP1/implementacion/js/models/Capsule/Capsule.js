class Capsule {
    // Draws the capsule.
    constructor(glProgram) {
        this.glProgram = glProgram;
        this.color = [0.823529412, 0.662745098, 0.53333333];
        this.shapeGen = new CapsuleSG(this.color);
        this.vCentralTopPos = [0.0, 0.0, 5.0];
        this.vCentralBottomPos = [0.0, 0.0, 0.0];
        this.aleron = new CapsuleAleron(glProgram);
        this.sides = null;
        this.bottom = null;
        this.top = null;
    }

    draw(transformMatrix) {
        if (transformMatrix == null) {
            transformMatrix = mat4.create();
        }

        this.sides = new Extrusion(this.glProgram, /*levels=*/12, this.vCentralBottomPos, this.vCentralTopPos, this.shapeGen);
        this.top = new Cylinder(this.glProgram, this.color);
        this.bottom = new Cylinder(this.glProgram, this.color);

        var bottom_t = mat4.create();
        mat4.fromScaling(bottom_t, [0.5, 0.5, 0.02]);
        mat4.multiply(bottom_t, transformMatrix, bottom_t);
        
        var top_t = mat4.create();
        var aux = mat4.create();
        mat4.fromTranslation(top_t, [0.0, 0.0, 4.98]);
        mat4.multiply(top_t, top_t, mat4.fromScaling(aux, [0.4, 0.4, 0.02]));
        mat4.multiply(top_t, transformMatrix, top_t);

        this.sides.draw(transformMatrix);
        this.top.draw(top_t);
        this.bottom.draw(bottom_t);
        this.aleron.draw(transformMatrix);
    }
}

// Shape generator
class CapsuleSG {
    constructor(color) {
        this.pointsPerCircle = 48;
        this.vRadius = [0.5, 2.0, 1.9, 1.85, 1.8, 1.75, 1.7, 1.65, 1.6, 1.5, 1.0, 0.4];
        this.levelCounter = 0;
        this.vColor = color;
    }
    
    getPosBuffer(central_pos) {
        var x_0 = central_pos[0];
        var y_0 =  central_pos[1];
        var z_0 = central_pos[2];
        
        var buffer = [];
        var radius = this.vRadius[this.levelCounter];
        this.levelCounter += 1;
        if (this.levelCounter >= this.vRadius.length) {
            this.levelCounter = 0;
        }
        for (var i = 0; i < this.pointsPerCircle; i++) {
            buffer.push(x_0 + radius*Math.cos(i * 2.0 * Math.PI / this.pointsPerCircle));
            buffer.push(y_0 + radius*Math.sin(i * 2.0 * Math.PI / this.pointsPerCircle));
            buffer.push(z_0);
        }
        // We need to connect the shape's end and beginning.
        // Because of this we iterate in the other functions until pointsPerCircle + 1.
        buffer.push(x_0 + radius*Math.cos(0));
        buffer.push(y_0 + radius*Math.sin(0));
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

class CapsuleAleron {
    // Aleron de la capsula.
    constructor(glProgram) {
        this.glProgram = glProgram;
        this.color = [0.01, 0.01, 0.01];
        this.shapeGen = new CapsuleSG(this.color);
        this.vCentralTopPos = [0.0, 0.0, 0.0];
        this.vCentralBottomPos = [0.0, 0.0, -1.0];
        this.sides = null;
    }

    draw(transformMatrix) {
        if (transformMatrix == null) {
            transformMatrix = mat4.create();
        }

        this.sides = new Extrusion(this.glProgram, /*levels=*/12, this.vCentralBottomPos, this.vCentralTopPos, this.shapeGen);
        
        var sides_t = mat4.create();
        mat4.fromScaling(sides_t, [0.55, 0.55, 2.0]);
        mat4.multiply(sides_t, transformMatrix, sides_t);

        this.sides.draw(sides_t);
    }
}