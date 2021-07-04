
    function DroneCameraControl(initialPos){

        let MIN_Y=1;

        let FACTOR_ROTACION=0.05;        
        let FACTOR_TRASLACION=0.05;

        let vec3=glMatrix.vec3;  //defino vec3 para no tener que escribir glMatrix.vec3
        let mat4=glMatrix.mat4;

        if (!initialPos) initialPos=[0,0,0];

        let position=vec3.fromValues(initialPos[0],initialPos[1],initialPos[2]);
        let rotation=vec3.create();

        let worldMatrix=mat4.create();

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
        }

        let camState=Object.assign({},camInitialState);

        
        // Eventos de teclado **********************************************

        document.addEventListener("keydown",function(e){
            //console.log(e.key);
                
            /*
                ASDW para rotar en 2 ejes

                Flechas + PgUp/PgDw o HJKUOL para trasladarse en XYZ

            */

            switch ( e.key ) {

                case "ArrowUp":  case "u": // up
                    camState.xVelTarget=-1; break;
                case "ArrowDown": case "j": // down
                    camState.xVelTarget=1; break; 

                case "ArrowLeft": case "h": // left
                    camState.zVelTarget=1;break;
                case "ArrowRight": case "k": // right
                    camState.zVelTarget=-1; break;   

                case "PageUp": case "o": // PgUp
                    camState.yVelTarget=1;break;
                case "PageDown": case "l": // PgDw
                    camState.yVelTarget=-1; break;        
   
                case "a": 
                    camState.yRotVelTarget=FACTOR_ROTACION; break;                
                case "d": 
                    camState.yRotVelTarget=-FACTOR_ROTACION; break;
                case "s":
                    camState.zRotVelTarget=FACTOR_ROTACION;break;                                 
                case "w": 
                    camState.zRotVelTarget=-FACTOR_ROTACION;break;
                    /*
                case "q":
                    camState.xRotVelTarget=FACTOR_ROTACION;break;                                 
                case "e": 
                    camState.xRotVelTarget=-FACTOR_ROTACION;break;                        
                    */
                        
                case "r": 
                    rotation=vec3.create();
                    position=vec3.fromValues(initialPos[0],initialPos[1],initialPos[2]);
                    camState=Object.assign({},camInitialState);
                    break;

                case "t": 
                    rotation=vec3.create();                    
                    camState=Object.assign({},camInitialState);
                    break;                    

            }               

        })

        document.addEventListener("keyup",function(e){

            switch ( e.key ) 
            {
                case "ArrowUp":  case "u": case "ArrowDown": case "j": 
                    camState.xVelTarget=0; break;
                
                case "ArrowLeft": case "h": case "ArrowRight": case "k": 
                    camState.zVelTarget=0; break;  

                case "PageUp": case "o": case "PageDown": case "l":
                    camState.yVelTarget=0;break;
    
  
                case "a": 
                    camState.yRotVelTarget=0; break;
                case "s":
                    camState.zRotVelTarget=0;break;                           
                case "d": 
                    camState.yRotVelTarget=0; break;
                case "w": 
                    camState.zRotVelTarget=0;break;  
            }                 
            
        })
        

        this.update=function(){
            
            camState.xVel+=(camState.xVelTarget-camState.xVel)*FACTOR_TRASLACION;
            camState.yVel+=(camState.yVelTarget-camState.yVel)*FACTOR_TRASLACION;
            camState.zVel+=(camState.zVelTarget-camState.zVel)*FACTOR_TRASLACION;

            camState.xRotVel+=(camState.xRotVelTarget-camState.xRotVel)*FACTOR_TRASLACION;
            camState.yRotVel+=(camState.yRotVelTarget-camState.yRotVel)*FACTOR_TRASLACION;
            camState.zRotVel+=(camState.zRotVelTarget-camState.zRotVel)*FACTOR_TRASLACION;

            let translation=vec3.fromValues(-camState.xVel,camState.yVel,-camState.zVel);            
            

            let rotIncrement=vec3.fromValues(camState.xRotVel,camState.yRotVel,camState.zRotVel);            
            vec3.add(rotation,rotation,rotIncrement);

            rotation[2]=Math.min(Math.PI/3,Math.max(-Math.PI/3,rotation[2]));
            let m2=mat4.create();
            mat4.rotateX(m2,m2,rotation[0]);
            mat4.rotateY(m2,m2,rotation[1]);
            mat4.rotateZ(m2,m2,rotation[2]);

            vec3.transformMat4(translation,translation,m2);
            vec3.add(position,position,translation);

            worldMatrix=mat4.create();
            mat4.translate(worldMatrix,worldMatrix,position);
        
            mat4.multiply(worldMatrix,worldMatrix,m2);
            
        }

        this.getMatrix=function(){

            return worldMatrix;

        }



    }
