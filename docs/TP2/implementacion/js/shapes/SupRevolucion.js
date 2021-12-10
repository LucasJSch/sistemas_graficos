class SupRevolucion {
    // Construye una sup. de revolucion usando un concatenador de puntos en lugar de un generador de superficie
    // shapeGen sirve para decir como rotar los ptos
    // curveGen define la curva a dibujar
    // PRECONDICION:
    //      - curveGen tiene que empezar en [0.0, 0.0, 0.0]
    constructor(shader, levels, shapeGen, curveGen, ptos_longitudinal=100, ptos_rev=100) {
        this.shader = shader;
        this.levels = levels;
        this.n_cols = null;
        this.shapeGen = shapeGen;
        this.curveGen = curveGen;
        this.ptos_longitudinal = ptos_longitudinal;
        this.ptos_rev = ptos_rev;
        this.position_buffer = [];
        this.normal_buffer = [];
        this.color_buffer = [];

        this.utils = new Utils();
    }

    draw(transformMatrix) {
        if (transformMatrix == null) {
            transformMatrix = mat4.create();
        }

        this.generateBuffers();


        var grid = new Grid(this.shader, this.position_buffer, this.normal_buffer, this.color_buffer, this.levels, this.n_cols);
        grid.draw();
    }

    generateBuffers(position, normal, transformMatrix) {
        // Generamos el set de ptos sin trasladar ni rotar.
        var ptos_base = [];
        for (var j = 0; j < ptos_rev; j++) {
            ptos_base.push(this.curveGen.getPoint(1.0 / j));
        }

        // Generamos copias del set de ptos trasladados y rotados para generar la superficie.
        for (var i = 0; i < ptos_rev; i++) {
        }
    }
}