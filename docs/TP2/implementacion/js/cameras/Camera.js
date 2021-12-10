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
        
        this.spaceStationCam = new ControllableCamera2([0.0, 0.0, 3.0], [0.0, 0.0, 0.0], [0.0, 0.0, 1.0]);
        // this.spaceStationCam = new GenericCamera(/*initialPos=*/[0.0, 0.0, 3.0],
        //                                          /*targetPosition=*/[0.0, 0.0, 0.0],
        //                                          /*upVector=*/[0.0, 0.0, 1.0],
        //                                          (radius, angle) => [radius * Math.sin(angle), radius * Math.cos(angle), radius]);
        this.capsuleCam = new CapsuleCamera(capsule_controls);
        this.panelsCam = new ControllableCamera2([0.0, 10.0, 0.0], [0.0, 13.0, 0.0], [0.0, 0.0, 1.0]);
        // this.panelsCam = new GenericCamera(/*initialPos=*/[0.0, 10.0, 0.0],
        //                                     /*targetPosition=*/[0.0, 10.0, 0.0],
        //                                     /*upVector=*/[0.0, 0.0, 1.0],
        //                                     (radius, angle) => [radius * Math.cos(angle), radius, radius * Math.sin(angle)]);
        
        this.currentCam = this.kSpaceStation;
        this.capsule_controls = capsule_controls;
    }

    initialize() {
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
            return this.panelsCam.getMatrix();
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
            return this.panelsCam.update();
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