class Camera {
    constructor() {
        this.kOrbital = "orbital";
        this.kDrone = "drone";
        this.keyboardListener = new KeyboardListener();
        this.initialOrbitalCamPos = [40.0, 40.0, 20.0];
        this.orbitalCam = new OrbitalCameraControl(this.initialOrbitalCamPos);
        this.initialDroneCamPos = [40.0, 40.0, 40.0];
        this.droneCam = new DroneCameraControl(this.initialDroneCamPos);
        this.currentCam = this.kOrbital;
    }

    initialize() {
        // Register cameras for keyboard events.
        var drone_cam = this.droneCam;
        var listener_drone_up = (function(e) {
            drone_cam.keyUpListener(e);
        });
        var listener_drone_down = (function(e) {
            drone_cam.keyDownListener(e);
        });
        this.keyboardListener.registerKeyUpListener(listener_drone_up);
        this.keyboardListener.registerKeyDownListener(listener_drone_down);

        var orbital_cam = this.droneCam;
        var listener_orbital_up = (function(e) {
            orbital_cam.keyUpListener(e);
        });
        var listener_orbital_down = (function(e) {
            orbital_cam.keyDownListener(e);
        });
        this.keyboardListener.registerKeyUpListener(listener_drone_up);
        this.keyboardListener.registerKeyDownListener(listener_drone_down);

        
        // Register this class' logic for choosing cameras.

        var t = this;
        var listener_camera_down = (function(e) {
            t.chooseCamera(e);
        });
        this.keyboardListener.registerKeyDownListener(listener_camera_down)

        this.keyboardListener.initialize();  
    }

    getMatrix() {
        if (this.currentCam == this.kOrbital) {
            return this.orbitalCam.getMatrix();
        }
        if (this.currentCam == this.kDrone) {
            return this.droneCam.getMatrix();
        }
    }

    update() {
        if (this.currentCam == this.kOrbital) {
            return this.orbitalCam.update();
        }
        if (this.currentCam == this.kDrone) {
            return this.droneCam.update();
        }
    }

    chooseCamera(e) {
        if (e.key == "1") {
            this.currentCam = this.kOrbital;
        } else if (e.key == "2") {
            this.currentCam = this.kDrone;
        }
    }
}