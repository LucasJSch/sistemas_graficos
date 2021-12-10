class Nucleus {
    // Draws a the nucleus of the space station
    constructor(shader) {
        this.shader = shader;
        this.cyl_length_1 = 3.0;
        this.bezier_points_1 = [[0.0, 0.0, 1.0], [1.0, 2.0, 1.0], [2.0, 2.0, 1.0], [3.0, 0.0, 1.0]];
        this.cyl_length_2 = 5.0;
        this.bezier_points_2 = [[0.0, 0.0, 1.0], [0.0, 0.0, 1.0], [1.0, 1.0, 1.0], [1.0, 1.0, 1.0],
                                [4.0, 1.0, 1.0], [4.0, 1.0, 1.0], [5.0, 0.0, 1.0], [5.0, 0.0, 1.0]];

        this.utils = new Utils();
    }

    draw(transformMatrix) {
        if (transformMatrix == null) {
            transformMatrix = mat4.create();
        }

        
        var cyl_1 = new NucleusCylinder(this.shader, this.bezier_points_1, this.cyl_length_1);
        var cyl_2 = new NucleusCylinder(this.shader, this.bezier_points_2, this.cyl_length_2);
        var cyl_3 = new NucleusCylinder(this.shader, this.bezier_points_2, this.cyl_length_2);
        
        var cyl_2_t = mat4.create();
        var cyl_3_t = mat4.create();
        var aux = mat4.create();

        mat4.fromTranslation(cyl_2_t, [5.0, 0.0, 0.0]);
        mat4.fromTranslation(cyl_3_t, [12.0, 0.0, 0.0]);
        mat4.mul(cyl_2_t, transformMatrix, cyl_2_t);
        mat4.mul(cyl_3_t, transformMatrix, cyl_3_t);
        
        var cube_12 = new NucleusCube(this.shader);
        var cube_23 = new NucleusCube(this.shader);
        
        var cube_12_t = mat4.create();
        var cube_23_t = mat4.create();
        
        mat4.fromScaling(aux, [1.0, 1.0, 2.0]);
        mat4.fromRotation(cube_12_t, Math.PI/2.0, [0.0, 1.0, 0.0]);
        mat4.mul(aux, cube_12_t, aux);
        mat4.fromTranslation(cube_12_t, [3.0, -0.5, 0.5]);
        mat4.fromTranslation(cube_23_t, [10.0, -0.5, 0.5]);
        mat4.mul(cube_12_t, cube_12_t, aux);
        mat4.mul(cube_23_t, cube_23_t, aux);
        mat4.mul(cube_12_t, transformMatrix, cube_12_t);
        mat4.mul(cube_23_t, transformMatrix, cube_23_t);

        cyl_1.draw(transformMatrix);
        cyl_2.draw(cyl_2_t);
        cyl_3.draw(cyl_3_t);
        cube_12.draw(cube_12_t);
        cube_23.draw(cube_23_t);
    }
}
