class Camera {
    constructor() {
        this.kOrbital = "orbital";
        this.kDrone = "drone";
        this.kCraneOperator = "crane";
        this.initialOrbitalCamPos = [40.0, 40.0, 20.0];
        this.orbitalCam = new OrbitalCameraControl(this.initialOrbitalCamPos);
        this.initialDroneCamPos = [40.0, 40.0, 40.0];
        this.droneCam = new DroneCameraControl(this.initialDroneCamPos);
        this.craneCam = new CraneOperatorCamera();
        this.currentCam = this.kOrbital;
    }

    initialize() {
    }

    getMatrix() {
        if (this.currentCam == this.kOrbital) {
            return this.orbitalCam.getMatrix();
        }
        if (this.currentCam == this.kDrone) {
            return this.droneCam.getMatrix();
        }
        if (this.currentCam == this.kCraneOperator) {
            return this.craneCam.getMatrix();
        }
    }

    update() {
        if (this.currentCam == this.kOrbital) {
            return this.orbitalCam.update();
        }
        if (this.currentCam == this.kDrone) {
            return this.droneCam.update();
        }
        if (this.currentCam == this.kCraneOperator) {
            return this.craneCam.update();
        }
    }

    chooseCamera(e) {
        if (e.key == "1") {
            this.currentCam = this.kOrbital;
        } else if (e.key == "2") {
            this.currentCam = this.kDrone;
        } else if (e.key == "3") {
            this.currentCam = this.kCraneOperator;
        }
    }
}