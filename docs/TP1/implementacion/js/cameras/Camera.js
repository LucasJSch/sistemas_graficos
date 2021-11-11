class Camera {
    constructor() {
        this.kSpaceStation = "estacion_espacial";
        this.kSolarPanel = "paneles_solares";
        this.kCapsule = "capsula";
        this.initialSpaceStationCamPos = [40.0, 0.0, 0.0];
        this.initialSpaceStationCamRot = [Math.PI/2.0, Math.PI/2.0, 0.0];
        this.initialSolarPanelCamPos = [40.0, 40.0, 40.0];
        this.initialCapsuleCamPos = [40.0, 40.0, 40.0];

        this.keyboardListener = new KeyboardListener();
        
        this.spaceStationCam = new SpaceStationCamera(this.initialSpaceStationCamPos, this.initialSpaceStationCamRot);
        // this.solarPanelCam = new DroneCameraControl(this.initialDroneCamPos);
        // this.capsuleCam = new CraneOperatorCamera(this.initialCapsuleCamPos);
        
        this.currentCam = this.kSpaceStation;
    }

    initialize() {
        // Register cameras for keyboard events.
        var space_station_cam = this.spaceStationCam;
        var listener_space_station_up = (function(e) {
            space_station_cam.keyUpListener(e);
        });
        var listener_space_station_down = (function(e) {
            space_station_cam.keyDownListener(e);
        });
        var listener_space_station_wheel = (function(e) {
            space_station_cam.mouseWheelListener(e);
        });
        this.keyboardListener.registerKeyUpListener(listener_space_station_up);
        this.keyboardListener.registerKeyDownListener(listener_space_station_down);
        this.keyboardListener.registerMouseWheelListener(listener_space_station_wheel);

        // TODO: Same with Panels and Capsule.

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
            return this.spaceStationCam.getMatrix();
        }
        if (this.currentCam == this.kSolarPanel) {
            // return this.droneCam.getMatrix();
        }
        if (this.currentCam == this.kCapsule) {
            // return this.craneCam.getMatrix();
        }
    }

    update() {
        if (this.currentCam == this.kSpaceStation) {
            return this.spaceStationCam.update();
        }
        if (this.currentCam == this.kSolarPanel) {
            // return this.droneCam.update();
        }
        if (this.currentCam == this.kCapsule) {
            // return this.craneCam.update();
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