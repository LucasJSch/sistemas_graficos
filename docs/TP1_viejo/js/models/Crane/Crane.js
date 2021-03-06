class Crane {
        // Draws a crane.
    constructor(glProgram, sceneControls) {
        this.yellowColor = [0.88, 0.8, 0.0275];
        this.grayColor = [0.48627451, 0.48627451, 0.48627451];
        this.loadColor = [0.48627451, 0.52627451, 0.48627451];
        this.metalColor = [0.450980392, 0.56640625, 0.690196078];
        this.firstBase = new Cube(glProgram, this.yellowColor);
        this.firstBase_transf = mat4.create();
        this.secondBase = new Cube(glProgram, this.yellowColor);
        this.secondBase_transf = mat4.create();
        this.cylinderBase = new Cylinder(glProgram, this.metalColor);
        this.cylinderBase_transf = mat4.create();
        this.craneBox = new CraneBox(glProgram, this.yellowColor, this.metalColor);
        this.craneBox_transf = mat4.create();
        this.long = new Cube(glProgram, this.yellowColor);
        this.long_transf = mat4.create();
        this.weight = new Cube(glProgram, this.grayColor);
        this.weight_transf = mat4.create();
        this.screw = new Cylinder(glProgram, this.metalColor);
        this.screw_transf = mat4.create();
        this.craneLoad = new CraneLoad(glProgram, this.grayColor, this.loadColor);
        this.craneLoad_transf = mat4.create();

        // Zero is maximum height.
        this.crane_contraction = 0.0;
        this.craneBox_rotation = 0.0;
        this.long_elevation = 0.0;
        this.load_elevation = 0.0;
        this.applySceneControls(sceneControls);
    }

    draw(transformMatrix) {
        if (transformMatrix == null) {
            transformMatrix = mat4.create();
        }

        this.createTransformationMatrices(transformMatrix);
        this.firstBase.draw(this.firstBase_transf);
        this.secondBase.draw(this.secondBase_transf);
        this.cylinderBase.draw(this.cylinderBase_transf);
        this.craneBox.draw(this.craneBox_transf);
        this.long.draw(this.long_transf);
        this.weight.draw(this.weight_transf);
        this.screw.draw(this.screw_transf);
        this.craneLoad.draw(this.craneLoad_transf);
    }

    applySceneControls(sceneControls) {
        if (sceneControls == null) {
            return;
        }
        for (var i = 0; i < Math.abs(sceneControls.craneLongRotation); i++) {
            if (sceneControls.craneLongRotation > 0) {
                this.elevateCrane();
            } else {
                this.lowerCrane();
            }
        }
        for (var i = 0; i < Math.abs(sceneControls.craneLoadLevel); i++) {
            if (sceneControls.craneLoadLevel > 0) {
                this.elevateLoad();
            } else {
                this.lowerLoad();
            }
        }
        for (var i = 0; i < Math.abs(sceneControls.craneCabinRotation); i++) {
            if (sceneControls.craneCabinRotation > 0) {
                this.rotateCabinPositive();
            } else {
                this.rotateCabinNegative();
            }
        } 
        for (var i = 0; i < Math.abs(sceneControls.craneContraction); i++) {
            if (sceneControls.craneContraction > 0) {
                this.contractHeight();
            } else {
                this.expandHeight();
            }
        } 
    }

    // Expand ABC.
    expandHeight() {
        if (this.crane_contraction < 0) {
            this.crane_contraction += 0.1;
        }
    }

    contractHeight() {
        if (this.crane_contraction > -3.0) {
            this.crane_contraction -= 0.1;
        }
    }

    rotateCabinPositive() {
            this.craneBox_rotation += 0.1;
    }

    rotateCabinNegative() {
            this.craneBox_rotation -= 0.1;
    }

    elevateCrane() {
        if (this.long_elevation < 0.5) {
            this.long_elevation += 0.05;
        }
    }

    lowerCrane() {
        if (this.long_elevation > 0.0) {
            this.long_elevation -= 0.05;
        }
    }

    elevateLoad() {
        this.craneLoad.elevate();
    }

    lowerLoad() {
        this.craneLoad.lower();

    }

    createTransformationMatrices(transformMatrix) {

        var aux = mat4.create();

        // Scaling matrices:
        var firstBase_s = mat4.create();
        var secondBase_s = mat4.create();
        var cylinderBase_s = mat4.create();
        var craneBox_s = mat4.create();
        var long_s = mat4.create();
        var weight_s = mat4.create();
        var screw_s = mat4.create();
        var craneLoad_s = mat4.create();

        // Rotation matrices:
        var firstBase_r = mat4.create();
        var secondBase_r = mat4.create();
        var cylinderBase_r = mat4.create();
        // Cabin rotation.
        var craneBox_r = mat4.create();
        var long_r = mat4.create();
        // Crane elevation.
        var long_elevation_r = mat4.create();
        var weight_r = mat4.create();
        var screw_r = mat4.create();
        var craneLoad_r = mat4.create();

        // Translation matrices:
        var firstBase_t = mat4.create();
        var secondBase_t = mat4.create();
        var cylinderBase_t = mat4.create();
        var craneBox_t = mat4.create();
        var long_t1 = mat4.create();
        var long_t2 = mat4.create();
        var weight_t = mat4.create();
        var screw_t = mat4.create();
        var craneLoad_t = mat4.create();

        // Scaling.
        mat4.fromScaling(firstBase_s,  [1.25, 1.25, 5.0]);
        mat4.scale(secondBase_s, firstBase_s, [0.8, 0.8, 0.8]);
        mat4.scale(cylinderBase_s, secondBase_s, [0.4, 0.4, 0.8]);
        mat4.fromScaling(craneBox_s, [1.0, 1.2, 1.0]);
        mat4.fromScaling(long_s, [0.35, 15.0, 0.35]);
        mat4.fromScaling(weight_s, [1.0, 1.0, 1.0]);
        mat4.fromScaling(screw_s, [0.1, 0.1, 0.4]);
        mat4.fromScaling(craneLoad_s, [1.0, 1.0, 1.0]);

        // Rotations.
        mat4.fromRotation(screw_r, Math.PI/2.0, [0.0, 1.0, 0.0]);

        // Translations.
        var second_base_contraction = 0.0;
        var cylinder_base_contraction = 0.0;
        if (this.crane_contraction < 0) {
            if (this.crane_contraction < -1.5) {
                cylinder_base_contraction = this.crane_contraction;
                second_base_contraction = this.crane_contraction + 1.5;
            } else {
                cylinder_base_contraction = this.crane_contraction;
                second_base_contraction = 0.0;               
            }
        }
        mat4.fromTranslation(secondBase_t, [0.0, 0.0, 4.9 + second_base_contraction]);
        mat4.fromTranslation(cylinderBase_t, [0.0, 0.0, 4.0 + cylinder_base_contraction]);
        mat4.mul(cylinderBase_t, secondBase_t, cylinderBase_t);
        mat4.fromTranslation(craneBox_t, [0.0, 0.0, 3.0]);
        mat4.mul(craneBox_t, cylinderBase_t, craneBox_t);
        mat4.fromTranslation(long_t1, [0.0, 5.0, 0.0]);
        mat4.fromTranslation(long_t2, [0.0, 0.0, 1.3]);
        mat4.mul(long_t2, craneBox_t, long_t2);
        mat4.fromTranslation(weight_t, [0.0, -8.0, -0.3]);
        mat4.mul(weight_t, long_t1, weight_t);
        mat4.mul(weight_t, long_t2, weight_t);
        mat4.fromTranslation(screw_t, [-0.2, 7.0, 0.2]);
        mat4.mul(screw_t, long_t1, screw_t);
        mat4.mul(screw_t, long_t2, screw_t);
        mat4.fromTranslation(craneLoad_t, [0.2, 0.0, -3.0]);
        mat4.mul(craneLoad_t, screw_t, craneLoad_t);

        // Cabin rotation transform.
        mat4.fromRotation(craneBox_r, this.craneBox_rotation, [0.0, 0.0, 1.0]);

        // Crane elevation transform.
        mat4.fromRotation(long_elevation_r, this.long_elevation, [1.0, 0.0, 0.0]);

        // Compute final results:
        this.firstBase_transf = firstBase_s;

        mat4.mul(this.secondBase_transf, secondBase_t, secondBase_r);
        mat4.mul(this.secondBase_transf, this.secondBase_transf, secondBase_s);

        mat4.mul(this.cylinderBase_transf, cylinderBase_t, cylinderBase_r);
        mat4.mul(this.cylinderBase_transf, this.cylinderBase_transf, cylinderBase_s);

        mat4.mul(this.craneBox_transf, craneBox_t, craneBox_r);
        mat4.mul(this.craneBox_transf, this.craneBox_transf, craneBox_s);

        mat4.mul(this.long_transf, long_r, long_s);
        mat4.mul(this.long_transf, long_t1, this.long_transf);
        mat4.mul(this.long_transf, long_elevation_r, this.long_transf);
        mat4.mul(this.long_transf, long_t2, this.long_transf);
        mat4.mul(this.long_transf, craneBox_r, this.long_transf);

        mat4.fromTranslation(aux, [0.0, -3.0, -0.3]);
        mat4.mul(this.weight_transf, this.weight_transf, aux);
        mat4.mul(this.weight_transf, long_elevation_r, this.weight_transf);
        mat4.invert(aux, aux);
        mat4.mul(this.weight_transf, aux, this.weight_transf);
        mat4.mul(this.weight_transf, weight_s, this.weight_transf);
        mat4.mul(this.weight_transf, weight_r, this.weight_transf);
        mat4.mul(this.weight_transf, weight_t, this.weight_transf);
        mat4.mul(this.weight_transf, craneBox_r, this.weight_transf);

        mat4.mul(this.screw_transf, screw_s, this.screw_transf);
        mat4.mul(this.screw_transf, screw_r, this.screw_transf);
        mat4.mul(this.screw_transf, screw_t, this.screw_transf);
        mat4.fromTranslation(aux, [0.0, 0.0, -13.4 - second_base_contraction - cylinder_base_contraction]);
        mat4.mul(this.screw_transf, aux, this.screw_transf);
        mat4.mul(this.screw_transf, long_elevation_r, this.screw_transf);
        mat4.invert(aux, aux);
        mat4.mul(this.screw_transf, aux, this.screw_transf);
        mat4.mul(this.screw_transf, craneBox_r, this.screw_transf);

        mat4.mul(this.craneLoad_transf, craneLoad_s, this.craneLoad_transf);
        mat4.mul(this.craneLoad_transf, craneBox_r, this.craneLoad_transf);
        mat4.mul(this.craneLoad_transf, craneLoad_t, this.craneLoad_transf);
        mat4.fromTranslation(aux, [0.0, 0.0, -13.4 - second_base_contraction - cylinder_base_contraction]);
        mat4.mul(this.craneLoad_transf, aux, this.craneLoad_transf);
        mat4.fromTranslation(aux, [0.0, -12.0, 0.0]);
        mat4.mul(this.craneLoad_transf, aux, this.craneLoad_transf);
        mat4.invert(aux, long_elevation_r);
        mat4.mul(this.craneLoad_transf, aux, this.craneLoad_transf);
        mat4.fromTranslation(aux, [0.0, 12.0, 0.0]);
        mat4.mul(this.craneLoad_transf, aux, this.craneLoad_transf);     
        mat4.mul(this.craneLoad_transf, long_elevation_r, this.craneLoad_transf);
        mat4.fromTranslation(aux, [0.0, 0.0, -13.4 - second_base_contraction - cylinder_base_contraction]);
        mat4.invert(aux, aux);
        mat4.mul(this.craneLoad_transf, aux, this.craneLoad_transf);
        mat4.mul(this.craneLoad_transf, craneBox_r, this.craneLoad_transf);
        // Another rotation to maintain the load perpendicular to the ground.
        // Translate to the origin + rotation inverse of long_elevation_r
        // mat4.fromTranslation(aux , [0.0, -12.0, -13.4 - second_base_contraction - cylinder_base_contraction]);
        // mat4.mul(this.craneLoad_transf, aux, this.craneLoad_transf);
        // mat4.invert(aux, long_elevation_r);
        // mat4.mul(this.craneLoad_transf, aux, this.craneLoad_transf);
        // mat4.fromTranslation(aux , [0.0, 12.0, 13.4 + second_base_contraction + cylinder_base_contraction]);
        // mat4.mul(this.craneLoad_transf, aux, this.craneLoad_transf);


        mat4.mul(this.firstBase_transf, transformMatrix, this.firstBase_transf);
        mat4.mul(this.secondBase_transf, transformMatrix, this.secondBase_transf);
        mat4.mul(this.cylinderBase_transf, transformMatrix, this.cylinderBase_transf);
        mat4.mul(this.craneBox_transf, transformMatrix, this.craneBox_transf);
        mat4.mul(this.long_transf, transformMatrix, this.long_transf);
        mat4.mul(this.weight_transf, transformMatrix, this.weight_transf);
        mat4.mul(this.screw_transf, transformMatrix, this.screw_transf);
        mat4.mul(this.craneLoad_transf, transformMatrix, this.craneLoad_transf);

        global["craneBoxTransformation"] = this.craneBox_transf;
    }
}