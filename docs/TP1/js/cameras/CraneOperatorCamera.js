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
        mat4.fromTranslation(t1, [0.0, -1.0, 0.0]);
        var t2 = mat4.create();
        // mat4.fromRotation(t1, Math.PI ,[0.0, 1.0, 0.0]);
        let m = mat4.clone(this.craneBoxTransformation);            
        mat4.mul(m, m, t2);
        mat4.mul(m, m, t1);
        mat4.invert(m, m);
        return m;
    }
}