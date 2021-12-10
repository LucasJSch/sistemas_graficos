
function ControllableCamera2(cameraPos, targetPos, upVec){
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


    var camera_position = cameraPos;
    var viewMatrix = mat4.create();
    let targetPosition = targetPos;
    let upVector = upVec;


    // seteo handlers del raton
    document.addEventListener("mousemove", function(e) {
        MOUSE.x = e.clientX || e.pageX;
        MOUSE.y = e.clientY || e.pageY
    });

    document.addEventListener("mousedown", function(e) {
        PREV_MOUSE.x = MOUSE.x;
        PREV_MOUSE.y = MOUSE.y;
        IS_MOUSE_DOWN = true;
    });

    document.addEventListener("mouseup", function(e) {
        IS_MOUSE_DOWN = false;
    });

    document.addEventListener("mouseover", function(e) {
        if (e.relatedTarget == null) {
            if (IS_MOUSE_DOWN && !e.button) {
                IS_MOUSE_DOWN = false;
            }
        }
    });

    document.addEventListener("wheel", function(e) {
        var mi_delta = window.chrome ? 400 : 12;
        WHEEL_SCROLL += e.deltaY / mi_delta;
        WHEEL_SCROLL = Math.max(0.01, Math.min(15, WHEEL_SCROLL));
    });

    this.getPos = function () {
        return {
            x: RADIO * Math.sin(ALFA) * Math.sin(BETA),
            y: RADIO * Math.cos(BETA),
            z: RADIO * Math.cos(ALFA) * Math.sin(BETA),
            scroll: WHEEL_SCROLL
        }
    };

    this.getMatrix = function() {
        var posObserver = this.getPos();
        var scroll = posObserver.scroll;
        var matrizVista = mat4.create();

        // var x = camera_position[0] + scroll * posObserver.x;
        // var y = camera_position[1] + scroll * posObserver.y;
        // var z = camera_position[2] + scroll * posObserver.z
        // var ojo = vec3.fromValues(x, y, z);
        var ojo = vec3.fromValues(camera_position[0] + scroll * posObserver.x, camera_position[1] + scroll * posObserver.z, camera_position[2] + scroll * posObserver.y);


        mat4.lookAt(matrizVista,
            ojo,
            targetPos,
            vec3.fromValues(0, 0, 1)
        );

        return matrizVista;
    };

    this.update = function () {

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
