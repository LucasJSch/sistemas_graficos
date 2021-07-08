function initCameras() {

    var orbitalCameraControl = new OrbitalCameraControl();
    var droneCameraControl;

    var keyboardListener = new KeyboardListener();
    droneCameraControl = new DroneCameraControl([0.2, 0.2, 0.2], keyboardListener);
    var listener1 = (function(e) {
        droneCameraControl.keyUpListener(e);
    });
    var listener2 = (function(e) {
        droneCameraControl.keyDownListener(e);
    });
    keyboardListener.registerKeyUpListener(listener1);
    keyboardListener.registerKeyDownListener(listener2);
    keyboardListener.initialize();    

    return [droneCameraControl, orbitalCameraControl];
}
