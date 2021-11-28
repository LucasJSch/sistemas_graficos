
class CapsuleCamera {
    constructor(capsule_controls){
        this.capsule_controls = capsule_controls;
    }
    
    update() {
    }
    
    getMatrix() {
        var worldMatrix = mat4.clone(this.capsule_controls.getMatrix());
        var aux = mat4.create();

        mat4.fromTranslation(aux, [0.0, 6.0, -2.0]);
        mat4.mul(worldMatrix, worldMatrix, aux);

        mat4.fromRotation(aux, -Math.PI/2.0 ,[1.0, 0.0, 0.0]);
        mat4.mul(worldMatrix, worldMatrix, aux);
        
        let m = mat4.clone(worldMatrix);            
        mat4.invert(m, m);
        return m;
    }
}