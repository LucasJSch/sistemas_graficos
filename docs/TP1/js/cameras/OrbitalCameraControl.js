
function OrbitalCameraControl(initialPos){

    if (!initialPos) {
        initialPos=[0.0, 0.0, 0.0];
    }

    var alfa = 0;
    var beta = Math.PI/2;
    var previousClientX = 0;
    var previousClientY = 0;
    var radius = 10.0;
    var factorVelocidad = 0.01;
    var isMouseDown = false;
    var viewMatrix = mat4.create();
    // The target that the camera is pointing to.
    let targetPosition = [0.0, 0.0, 0.0];
    // Up vector of the camera.
    let upVector = [0.0, 0.0, 1.0];

    let init_camera_pos = [radius , radius , radius];
    var cameraPosition = init_camera_pos;
    var mouse = {x: 0, y: 0};

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
    document.addEventListener("wheel", function(e) {
        if (e.key == "r") {
            cameraPosition = init_camera_pos;
            isMouseDown = true;
        }
    });
    document.addEventListener("keydown", function(e) {
        if (e.key == "r") {
            cameraPosition = init_camera_pos;
            isMouseDown = false;
        }
    });

    this.update = function() {
        if (isMouseDown) {
            var deltaX=0;
            var deltaY=0;

            if (previousClientX) {
                deltaX = mouse.x - previousClientX;
            }
            if (previousClientY) {
                deltaY = mouse.y - previousClientY;
            }

            previousClientX = mouse.x;
            previousClientY = mouse.y;

            alfa = alfa + deltaX * factorVelocidad;
            beta = beta + deltaY * factorVelocidad;

            if (beta < 0) {
                beta = 0;
            }
            if (beta > Math.PI) {
                beta = Math.PI;
            }

            cameraPosition = [radius * Math.sin(alfa) * Math.sin(beta), radius * Math.cos(beta), radius * Math.cos(alfa) * Math.sin(beta)];
        }
    }

    this.getMatrix = function(){
        mat4.lookAt(viewMatrix, cameraPosition, targetPosition, upVector);
        return viewMatrix;
    }
}
