class CraneOperatorCamera {
    constructor() {
        this.craneBoxTransformation = mat4.create();
    }

    update() {
        if (global["craneBoxTransformation"] == null || global["craneBoxTransformation"] == []) {
            this.craneBoxTransformation = mat4.create();
        }
        this.craneBoxTransformation = global["craneBoxTransformation"];
    }

    getMatrix() {
        var t1 = mat4.create();
        mat4.fromTranslation(t1, [0.0, 3.0, -1.0]);
        var t2 = mat4.create();
        mat4.fromRotation(t2, Math.PI/2.0 ,[1.0, 0.0, 0.0]);
        let m = mat4.clone(this.craneBoxTransformation);            
        mat4.mul(m, m, t2);
        mat4.mul(m, m, t1);
        mat4.fromTranslation(t1, [0.0, 0.0, -2.0]);
        mat4.mul(m, t1, m);
        mat4.invert(m, m);
        return m;
    }
}