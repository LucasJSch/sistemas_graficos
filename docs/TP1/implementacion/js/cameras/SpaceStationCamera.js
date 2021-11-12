
class SpaceStationCamera {
    constructor(initialPos, initialRot){
        this.rotationFactor = 0.02;
        this.translationFactor = 0.5;
        this.initialPos = initialPos;
        this.initialRot = initialRot;
        this.position = initialPos;
        this.rotation = initialRot;
        this.worldMatrix = mat4.create();
        this.camInitialState = {
            zVel:0,
            zVelTarget:0,
                
            yRotVelTarget:0.0,
            yRotVel:0.0,
        };
        this.camState = Object.assign({}, this.camInitialState);
    }
    
    update() {
        this.camState.zVel+=(this.camState.zVelTarget-this.camState.zVel)*this.translationFactor;
        this.camState.yRotVel+=(this.camState.yRotVelTarget-this.camState.yRotVel)*this.translationFactor;
    
        let translation=vec3.fromValues(0.0, 0.0,-this.camState.zVel);            
                
        let rotIncrement=vec3.fromValues(0.0, this.camState.yRotVel, 0.0);            
        vec3.add(this.rotation, this.rotation, rotIncrement);
    
        this.rotation[2] = Math.min(Math.PI/3, Math.max(-Math.PI/3, this.rotation[2]));
        let m2 = mat4.create();
        mat4.rotateX(m2, m2, this.rotation[0]);
        mat4.rotateY(m2, m2, this.rotation[1]);
        mat4.rotateZ(m2, m2, this.rotation[2]);
    
        vec3.transformMat4(translation, translation, m2);
        vec3.add(this.position, this.position, translation);
    
        this.worldMatrix = mat4.create();
        mat4.translate(this.worldMatrix, this.worldMatrix, this.position);
        
        mat4.multiply(this.worldMatrix, this.worldMatrix, m2);
    }
    
    getMatrix() {
        // this.worldMatrix = this.applyInitialConditions(this.worldMatrix);
        let m = mat4.clone(this.worldMatrix);            
        mat4.invert(m, m);
        return m;
    }

    applyInitialConditions(matrix) {
        var position = vec3.create();
        var rotation = this.initialRot;
        var translation = this.initialPos;
        rotation[2] = Math.min(Math.PI/3, Math.max(-Math.PI/3, rotation[2]));
        let m2 = mat4.create();
        mat4.rotateX(m2, m2, rotation[0]);
        mat4.rotateY(m2, m2, rotation[1]);
        mat4.rotateZ(m2, m2, rotation[2]);
        vec3.transformMat4(translation, translation, m2);
        vec3.add(position, position, translation);

        mat4.translate(matrix, matrix, position);
        return mat4.mul(matrix, matrix, m2);
    }
    
    keyUpListener(e) {
        switch (e.key) {
            case "z":
            case "Z":
                this.camState.yRotVelTarget=0.0;
                break;
            case "x":
            case "Z":
                this.camState.yRotVelTarget=0.0;
                break; 
        }
    }
    
    keyDownListener(e) {
        switch (e.key) {
            case "z":
            case "Z":
                this.camState.yRotVelTarget=this.rotationFactor;
                break;
            case "x":
            case "Z":
                this.camState.yRotVelTarget=-this.rotationFactor;
                break; 
        }
    }

    mouseWheelListener(e) {
        let deltaY = e.deltaY;
        if (deltaY != 0) {
            // Wheel up.
            if (deltaY < 0) {
                this.camState.zVel=this.translationFactor;
            }

            // Wheel down.
            if (deltaY > 0) {
                this.camState.zVel=-this.translationFactor;
            }
        }
    }
}