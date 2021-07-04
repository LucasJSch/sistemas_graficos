
function OrbitalCameraControl(initialPos){

    if (!initialPos) {
        initialPos=[0.0, 0.0, 0.0];
    }

    var cameraPosition = vec3.create();
    var mouse = {x: 0, y: 0};

    var alfa = 0;
    var beta = Math.PI/2;
    var previousClientX = 0;
    var previousClientY = 0;
    var radio = 0.1;
    var factorVelocidad = 0.0001;
    var isMouseDown = false;

    document.addEventListener("mousemove",function(e) {
        mouse.x = e.clientX || e.pageX; 
	    mouse.y = e.clientY || e.pageY;
    });

    document.addEventListener("mousedown",function(e) {
        isMouseDown = true;
    });

    document.addEventListener("mouseup",function(e) {
        isMouseDown = false;
    });

    // Reset camera.
    document.addEventListener("keydown",function(e) {
        if (e.key == "r") {
            cameraPosition = vec3.create();
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

            cameraPosition = [radio * Math.sin(alfa) * Math.sin(beta), radio * Math.cos(beta), radio * Math.cos(alfa) * Math.sin(beta)];
        }
    }

    this.getMatrix = function(){
        worldMatrix = mat4.create();
        mat4.lookAt(worldMatrix, cameraPosition, [0.0, 0.0, 0.0], [0.0, 0.0, 0.0]);
        return worldMatrix;
    }
}
