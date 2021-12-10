class SceneControls {
    constructor(initialPos) {

        this.MIN_Y=1;
        this.initialPos = [0.0, -10.0, 0.0];
        this.initialRot = [Math.PI, 0.0, 0.0];

        this.DELTA_TRASLACION=0.5;        // velocidad de traslacion 
        this.DELTA_ROTACION=0.02;         // velocidad de rotacion
        this.FACTOR_INERCIA=0.05;

        this.position = vec3.fromValues(this.initialPos[0], this.initialPos[1], this.initialPos[2]);

        this.rotationMatrix=mat4.create();	

        let camInitialState={
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

        this.camState=Object.assign({}, camInitialState);
    }

    keyDownListener(e) {
        switch ( e.key ) {

            case "a":
            case "A":
                this.camState.xVelTarget=-this.DELTA_TRASLACION; break;
            case "d":
            case "D":
                this.camState.xVelTarget=this.DELTA_TRASLACION; break; 

            case "s":
            case "S":
                this.camState.zVelTarget=this.DELTA_TRASLACION;break;
            case "w": 
            case "W": 
                this.camState.zVelTarget=-this.DELTA_TRASLACION; break;   

            case "q":
            case "Q":
                this.camState.yVelTarget=this.DELTA_TRASLACION;break;
            case "e":
            case "E":
                this.camState.yVelTarget=-this.DELTA_TRASLACION; break;        


            case "j": 
            case "J": 
                this.camState.zRotVelTarget=this.DELTA_ROTACION;break;                                 
            case "l": 
            case "L": 
                this.camState.zRotVelTarget=-this.DELTA_ROTACION;break;


            case "i": 
            case "I": 
                this.camState.xRotVelTarget=this.DELTA_ROTACION; break;                
            case "k": 
            case "K": 
                this.camState.xRotVelTarget=-this.DELTA_ROTACION; break;         

        
                    
            case "r": 
                this.position=vec3.fromValues(initialPos[0],initialPos[1],initialPos[2]);
                this.camState=Object.assign({},camInitialState);
                this.rotationMatrix=mat4.create();
                break;

            case "t": 
                this.camState=Object.assign({},camInitialState);
                break;                    

        }               

    }

    
    keyUpListener(e) {

        switch ( e.key ) 
        {
            case "a":
            case "A":
            case "d":
            case "D":
                this.camState.xVelTarget=0; break;
            
            case "s":
            case "S":
            case "w":
            case "W":
                this.camState.zVelTarget=0; break;  

            case "q":
            case "Q":
            case "e":
            case "E":
                this.camState.yVelTarget=0;break;


            case "i": 
            case "I": 
            case "k": 
            case "K": 
                this.camState.xRotVelTarget=0; break;
                
            case "j": 
            case "J": 
            case "l": 
            case "L": 
                this.camState.zRotVelTarget=0;break; 
        
      
        }                 
        
    }
    

    update(){
        
        this.camState.xVel+=(this.camState.xVelTarget-this.camState.xVel)*this.FACTOR_INERCIA;
        this.camState.yVel+=(this.camState.yVelTarget-this.camState.yVel)*this.FACTOR_INERCIA;
        this.camState.zVel+=(this.camState.zVelTarget-this.camState.zVel)*this.FACTOR_INERCIA;

        this.camState.xRotVel+=(this.camState.xRotVelTarget-this.camState.xRotVel)*this.FACTOR_INERCIA;
        this.camState.yRotVel+=(this.camState.yRotVelTarget-this.camState.yRotVel)*this.FACTOR_INERCIA;
        this.camState.zRotVel+=(this.camState.zRotVelTarget-this.camState.zRotVel)*this.FACTOR_INERCIA;

        let translation=vec3.fromValues(-this.camState.xVel,this.camState.yVel,-this.camState.zVel);                        
        

        if (Math.abs(this.camState.xRotVel)>0) {		
            // este metodo aplica una rotacion en el eje AXIS en el espacio del objeto o respecto del eje "local", NO el eje de mundo
            mat4.rotate(this.rotationMatrix,this.rotationMatrix,this.camState.xRotVel,vec3.fromValues(1,0,0));                
        }

        if (Math.abs(this.camState.yRotVel)>0) {
            mat4.rotate(this.rotationMatrix,this.rotationMatrix,this.camState.yRotVel,vec3.fromValues(0,1,0));                
        }
        
        if (Math.abs(this.camState.zRotVel)>0) {
            mat4.rotate(this.rotationMatrix,this.rotationMatrix,this.camState.zRotVel,vec3.fromValues(0,0,1));                
        }
        

        vec3.transformMat4(translation,translation,this.rotationMatrix);
        vec3.add(this.position,this.position,translation);

        this.worldMatrix=mat4.create();
        mat4.translate(this.worldMatrix,this.worldMatrix,this.position);        
        mat4.multiply(this.worldMatrix,this.worldMatrix,this.rotationMatrix);
        
        
    }


    getViewMatrix(){
        let m=mat4.clone(this.worldMatrix);            
        mat4.invert(m,m);
        return m;
    }

    getMatrix(){
        return this.worldMatrix;
    }
}