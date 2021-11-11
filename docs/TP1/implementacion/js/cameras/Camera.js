class Camera {
    constructor() {
        this.kSpaceStation = "estacion_espacial";
        this.kSolarPanel = "paneles_solares";
        this.kCapsule = "capsula";
        this.initialSpaceStationCamPos = [40.0, 40.0, 20.0];
        this.initialSolarPanelCamPos = [40.0, 40.0, 40.0];
        this.initialCapsuleCamPos = [40.0, 40.0, 40.0];

        this.keyboardListener = new KeyboardListener();
        
        this.spaceStationCam = new SpaceStationCam(this.initialSpaceStationCamPos);
        this.solarPanelCam = new DroneCameraControl(this.initialDroneCamPos);
        this.capsuleCam = new CraneOperatorCamera(this.initialCapsuleCamPos);
        
        this.currentCam = this.kSpaceStation;
    }

    initialize() {
        // Register cameras for keyboard events.
        var drone_cam = this.spaceStationCam;
        var listener_drone_up = (function(e) {
            drone_cam.keyUpListener(e);
        });
        var listener_drone_down = (function(e) {
            drone_cam.keyDownListener(e);
        });
        this.keyboardListener.registerKeyUpListener(listener_drone_up);
        this.keyboardListener.registerKeyDownListener(listener_drone_down);

        var orbital_cam = this.solarPanelCam;
        var listener_orbital_up = (function(e) {
            orbital_cam.keyUpListener(e);
        });
        var listener_orbital_down = (function(e) {
            orbital_cam.keyDownListener(e);
        });
        this.keyboardListener.registerKeyUpListener(listener_orbital_up);
        this.keyboardListener.registerKeyDownListener(listener_orbital_down);

        
        // Register this class' logic for choosing cameras.

        var t = this;
        var listener_camera_down = (function(e) {
            t.chooseCamera(e);
        });
        this.keyboardListener.registerKeyDownListener(listener_camera_down)

        this.keyboardListener.initialize();  
    }

    getMatrix() {
        if (this.currentCam == this.kSpaceStation) {
            return this.orbitalCam.getMatrix();
        }
        if (this.currentCam == this.kSolarPanel) {
            return this.droneCam.getMatrix();
        }
        if (this.currentCam == this.kCapsule) {
            return this.craneCam.getMatrix();
        }
    }

    update() {
        if (this.currentCam == this.kSpaceStation) {
            return this.orbitalCam.update();
        }
        if (this.currentCam == this.kSolarPanel) {
            return this.droneCam.update();
        }
        if (this.currentCam == this.kCapsule) {
            return this.craneCam.update();
        }
    }

    chooseCamera(e) {
        if (e.key == "1") {
            this.currentCam = this.kSpaceStation;
        } else if (e.key == "2") {
            this.currentCam = this.kSolarPanel;
        } else if (e.key == "3") {
            this.currentCam = this.kCapsule;
        }
    }
}