class CamaraInteractuableArrastre extends Camara {

    constructor() {
        super();
        var touchable = 'ontouchstart' in window
        this.control = touchable ? new ControlJoystick() : new ControlRaton();
    }

    generarVista(posHeli) {

        var posObserver = this.control.obtener_posicion();
        var scroll = posObserver.scroll;

        var matrizVista = mat4.create();

        var ojo = vec3.fromValues(posHeli.x + scroll * posObserver.x, posHeli.y + scroll * posObserver.y, posHeli.z + scroll * posObserver.z);
        var centro = vec3.fromValues(posHeli.x, posHeli.y, posHeli.z);

        mat4.lookAt(matrizVista,
            ojo,
            centro,
            vec3.fromValues(0, 1, 0)
        );

        return matrizVista;
    }

    actualizar() {
        this.control.actualizar();
    }
}

function ControlRaton() {

    var MOUSE = {
        x: 0,
        y: 0
    };
    var PREV_MOUSE = {
        x: 0,
        y: 0
    };

    var WHEEL_SCROLL = 1;

    var IS_MOUSE_DOWN = false;
    var ALFA = Math.PI / 4;
    var BETA = Math.PI / 2;

    const FACTOR_VELOCIDAD = 0.01;
    const RADIO = 20;


    // seteo handlers del raton
    $("body").mousemove(function (e) {
        MOUSE.x = e.clientX || e.pageX;
        MOUSE.y = e.clientY || e.pageY
    });

    $('body').mousedown(function (event) {
        PREV_MOUSE.x = MOUSE.x;
        PREV_MOUSE.y = MOUSE.y;
        IS_MOUSE_DOWN = true;
    });

    $('body').mouseup(function (event) {
        IS_MOUSE_DOWN = false;
    });

    document.documentElement.addEventListener('mouseover', function (e) {
        if (e.relatedTarget == null) {
            if (IS_MOUSE_DOWN && !e.button) {
                IS_MOUSE_DOWN = false;
            }
        }
    });

    $('body').on("wheel", function (event) {
        var mi_delta = window.chrome ? 400 : 12;
        WHEEL_SCROLL += event.originalEvent.deltaY / mi_delta;
        WHEEL_SCROLL = Math.max(0.01, Math.min(15, WHEEL_SCROLL));
    });

    this.obtener_posicion = function () {
        return {
            x: RADIO * Math.sin(ALFA) * Math.sin(BETA),
            y: RADIO * Math.cos(BETA),
            z: RADIO * Math.cos(ALFA) * Math.sin(BETA),
            scroll: WHEEL_SCROLL
        }
    };

    this.actualizar = function () {

        if (!IS_MOUSE_DOWN) {
            return;
        }

        var deltaX = 0;
        var deltaY = 0;

        if (PREV_MOUSE.x) {
            deltaX = MOUSE.x - PREV_MOUSE.x;
        }
        if (PREV_MOUSE.y) {
            deltaY = MOUSE.y - PREV_MOUSE.y;
        }

        PREV_MOUSE.x = MOUSE.x;
        PREV_MOUSE.y = MOUSE.y;

        ALFA = ALFA + deltaX * FACTOR_VELOCIDAD;
        BETA = BETA + deltaY * FACTOR_VELOCIDAD;

        if (BETA <= 0) {
            BETA = 0.001;
        }
        if (BETA > Math.PI) {
            BETA = Math.PI - 0.001;
        }

    }

}