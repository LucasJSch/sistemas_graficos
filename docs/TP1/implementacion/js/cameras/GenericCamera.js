
function GenericCamera(initialPos, targetPos, upV, camPosLambda){
    if (!initialPos) {
        initialPos = [0.0, 0.0, 3.0];
    }
    var alfa = 0;
    var beta = Math.PI/2;
    var previousClientX = 0;
    var previousClientY = 0;
    var radius = 40.0;
    var factorVelocidad = 0.01;
    var isMouseDown = false;
    var viewMatrix = mat4.create();
    // The target that the camera is pointing to.
    let targetPosition = targetPos;
    // Up vector of the camera.
    let upVector = upV;

    let init_camera_pos = initialPos;
    var cameraPosition = init_camera_pos;
    var mouse = {x: 0, y: 0};
    var time = 0.0;

    document.addEventListener("mousemove", function(e) {
        mouse.x = e.clientX || e.pageX; 
	    mouse.y = e.clientY || e.pageY;
    });

    document.addEventListener("mousedown", function(e) {
        isMouseDown = true;
    });

    document.addEventListener("mouseup", function(e) {
        isMouseDown = false;
    });

    // Reset camera.
    document.addEventListener("keydown", function(e) {
        if (e.key == "r") {
            cameraPosition = init_camera_pos;
            isMouseDown = true;
        }
    });

    document.addEventListener("keyup", function(e) {
        if (e.key == "r") {
            cameraPosition = init_camera_pos;
            isMouseDown = false;
        }
    });

    document.addEventListener("wheel", function(e) {
        let deltaY = e.deltaY;
        if (deltaY != 0) {
            // Wheel up.
            if (deltaY < 0) {
                radius += 1.0;
            }

            // Wheel down.
            if (deltaY > 0) {
                radius -= 1.0;
            }
        }
    });

    this.update = function() {
        time += 0.02;
        // var deltaX=0;
        // var deltaY=0;

        // if (previousClientX) {
        //     deltaX = mouse.x - previousClientX;
        // }
        // if (previousClientY) {
        //     // deltaY = mouse.y - previousClientY;
        // }

        // previousClientX = mouse.x;
        // previousClientY = mouse.y;

        angle = time;

        // if (beta < 0) {
        //     beta = 0;
        // }
        // if (beta > Math.PI) {
        //     beta = Math.PI;
        // }

        // cameraPosition = [radius * Math.sin(alfa), radius * Math.cos(alfa), radius];
        cameraPosition = camPosLambda(radius, angle);
    }

    this.getMatrix = function(){
        mat4.lookAt(viewMatrix, cameraPosition, targetPosition, upVector);
        return viewMatrix;
    }
}
