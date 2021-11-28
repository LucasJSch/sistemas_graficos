class Camera {
    constructor(capsule_controls) {
        this.kSpaceStation = "estacion_espacial";
        this.kSolarPanel = "paneles_solares";
        this.kCapsule = "capsula";
        this.initialSpaceStationCamPos = [40.0, 0.0, 0.0];
        this.initialSpaceStationCamRot = [Math.PI/2.0, Math.PI/2.0, 0.0];
        this.initialSolarPanelCamPos = [40.0, 40.0, 40.0];
        this.initialCapsuleCamPos = [40.0, 40.0, 40.0];

        this.keyboardListener = new KeyboardListener();
        
        this.spaceStationCam = new SpaceStationCamera(this.initialSpaceStationCamPos, this.initialSpaceStationCamRot);
        this.capsuleCam = new CapsuleCamera(capsule_controls);
        this.genericCam = new GenericCamera();
        
        this.currentCam = this.kSpaceStation;
        this.capsule_controls = capsule_controls;
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

        // Register scene controls key events listeners.
        var capsule_controls = this.capsule_controls;
        var listener_scene_controls_up = (function(e) {
            capsule_controls.keyUpListener(e);
        });
        var listener_scene_controls_down = (function(e) {
            capsule_controls.keyDownListener(e);
        });
        this.keyboardListener.registerKeyUpListener(listener_scene_controls_up);
        this.keyboardListener.registerKeyDownListener(listener_scene_controls_down);

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
            return this.genericCam.getMatrix();
        }
        if (this.currentCam == this.kCapsule) {
            return this.capsuleCam.getMatrix();
        }
    }

    update() {
        this.capsule_controls.update();
        if (this.currentCam == this.kSpaceStation) {
            return this.spaceStationCam.update();
        }
        if (this.currentCam == this.kSolarPanel) {
            return this.genericCam.update();
        }
        if (this.currentCam == this.kCapsule) {
            return this.capsuleCam.update();
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