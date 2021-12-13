class CraneColumn {
    constructor(shader) {
        this.shader = shader;
        this.color = [0.392156863, 0.294117647, 0.31372549];
        
        this.left_column = new Cube(shader, this.color);
        this.right_column = new Cube(shader, this.color);
        this.cyl = new Cylinder(this.shader, this.color, /*pointsPerCircle=*/8);

        this.cylinders_t = [];
        this.length = 26.2;
        this.left_t;
        this.right_t;
        this.computeCommonTransformations();
        this.generateIntermediateCylindersTransforms();
    }

    computeCommonTransformations() {
        var aux_t = mat4.create();
        var left_t = mat4.create();
        mat4.fromScaling(left_t, [0.1, 0.1, this.length / 5.0]);
        mat4.fromTranslation(aux_t, [0.2, 0.0, 0.0]);
        mat4.mul(left_t, aux_t, left_t);

        var right_t = mat4.create();
        mat4.fromScaling(right_t, [0.1, 0.1, this.length / 5.0]);
        mat4.fromTranslation(aux_t, [-0.2, 0.0, 0.0]);
        mat4.mul(right_t, aux_t, right_t);

        this.left_t = left_t;
        this.right_t = right_t;
    }

    draw(transformMatrix) {
        if (transformMatrix == null) {
            transformMatrix = mat4.create();
        }

        mat4.mul(this.left_t, transformMatrix, this.left_t);
        mat4.mul(this.right_t, transformMatrix, this.right_t);
        
        for (var t of this.cylinders_t) {
            mat4.mul(t, transformMatrix, t);
            this.cyl.draw(t);
        }

        this.left_column.draw(this.left_t);
        this.right_column.draw(this.right_t);
    }

    generateIntermediateCylindersTransforms() {
        const z_translation_per_unit = 0.4;
        const n_cyls = Math.floor(this.length / (z_translation_per_unit * 5.0));
        var common_t_1 = mat4.create();
        var common_t_2 = mat4.create();

        var initial_scaling = mat4.create();
        mat4.fromScaling(initial_scaling, [0.02, 0.02, 0.6]);
        var rotation_1 = mat4.create();
        mat4.fromRotation(rotation_1, Math.PI / 4.0, [0.0, 1.0, 0.0]);
        mat4.mul(rotation_1, rotation_1, initial_scaling);
        var translation_1 = mat4.create();
        mat4.fromTranslation(translation_1, [-0.2, 0.0, 0.1]);
        mat4.mul(common_t_1, translation_1, rotation_1);

        var rotation_2 = mat4.create();
        mat4.fromRotation(rotation_2, Math.PI / 4.0, [0.0, -1.0, 0.0]);
        mat4.mul(rotation_2, rotation_2, initial_scaling);
        var translation_2 = mat4.create();
        mat4.fromTranslation(translation_2, [0.2, 0.0, 0.1]);
        mat4.mul(common_t_2, translation_2, rotation_2);

        var left = true;        
        for (var i = 0.0; i < n_cyls; i++) {
            var t = mat4.create();
            if (left) {
                left = false;
                mat4.fromTranslation(t, [0.0, 0.0, i * z_translation_per_unit]);
                mat4.mul(t, t, common_t_1);
            } else {
                left = true;
                mat4.fromTranslation(t, [0.0, 0.0, i * z_translation_per_unit]);
                mat4.mul(t, t, common_t_2);
            }
            this.cylinders_t.push(t);
        }

    }
}
