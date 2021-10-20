class DroneCameraControl {
    constructor(initialPos){
        if (!initialPos) {
            this.initialPos = [0, 0, 0];
        } else{
            this.initialPos = initialPos;
        }
        this.rotationFactor = 0.02;
        this.translationFactor = 0.02;
        this.inertiaFactor = 0.05;
        this.position = vec3.fromValues(initialPos[0], initialPos[1], initialPos[2]);
        this.rotation = vec3.create();
        this.worldMatrix = mat4.create();
        this.camInitialState = {
            xVel:0,
            zVel:0,
            yVel:0,
            xVelTarget:0,
            zVelTarget:0,
            yVelTarget:0,
            
            yRotVelTarget:0,
            yRotVel:0,
            zRotVelTarget:0,
            zRotVel:0,
            xRotVelTarget:0,
            xRotVel:0,
            
            rightAxisMode:"move"
        };
        this.camState = Object.assign({}, this.camInitialState);
    }

    update() {
        this.camState.xVel+=(this.camState.xVelTarget-this.camState.xVel)*this.translationFactor;
        this.camState.yVel+=(this.camState.yVelTarget-this.camState.yVel)*this.translationFactor;
        this.camState.zVel+=(this.camState.zVelTarget-this.camState.zVel)*this.translationFactor;

        this.camState.xRotVel+=(this.camState.xRotVelTarget-this.camState.xRotVel)*this.translationFactor;
        this.camState.yRotVel+=(this.camState.yRotVelTarget-this.camState.yRotVel)*this.translationFactor;
        this.camState.zRotVel+=(this.camState.zRotVelTarget-this.camState.zRotVel)*this.translationFactor;

        let translation=vec3.fromValues(-this.camState.xVel, this.camState.yVel,-this.camState.zVel);            
            
        let rotIncrement=vec3.fromValues(this.camState.xRotVel, this.camState.yRotVel, this.camState.zRotVel);            
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
        let m = mat4.clone(this.worldMatrix);            
        mat4.invert(m, m);
        return m;
    }

    keyUpListener(e) {
        switch (e.key) {
            case "ArrowUp":
            case "ArrowDown":
                this.camState.zVelTarget=0;
                break;
            
            case "ArrowLeft":
            case "ArrowRight":
                this.camState.xVelTarget=0;
                break;  

            case "PageUp":
            case "PageDown":
                this.camState.yVelTarget=0;
                break;

            case "a": 
                this.camState.yRotVelTarget=0;
                break;
            case "s":
                this.camState.yVelTarget=0;
                break;                           
            case "d": 
                this.camState.yRotVelTarget=0;
                break;
            case "w": 
                this.camState.yVelTarget=0;
                break;  
        } 
    }

    keyDownListener(e) {
        switch (e.key) {
            case "ArrowUp":
                this.camState.zVelTarget=this.translationFactor;
                break;
            case "ArrowDown":
                this.camState.zVelTarget=-this.translationFactor;
                break; 
            case "ArrowLeft": 
                this.camState.xVelTarget=this.translationFactor;
                break;
            case "ArrowRight":
                this.camState.xVelTarget=-this.translationFactor;
                break;   

            case "PageUp":
                this.camState.yVelTarget=1;
                break;
            case "PageDown":
                this.camState.yVelTarget=-1;
                break;        

            case "a": 
                this.camState.yRotVelTarget=this.rotationFactor;
                break;                
            case "d": 
                this.camState.yRotVelTarget=-this.rotationFactor;
                break;
            case "s":
                this.camState.yVelTarget=-this.translationFactor;
                break;                                 
            case "w": 
               this.camState.yVelTarget=this.translationFactor;
                break;
            case "r": 
                this.rotation=vec3.create();
                this.position=vec3.fromValues(this.initialPos[0], this.initialPos[1], this.initialPos[2]);
                this.camState=Object.assign({}, this.camInitialState);
                break;
            case "t": 
                this.rotation=vec3.create();                    
                this.camState=Object.assign({}, this.camInitialState);
                break;                    

        }   
    }
}