function initCameras() {

    var orbitalCameraControl = new OrbitalCameraControl();

    var keyboardListener = new KeyboardListener();
    droneCameraControl = new DroneCameraControl([0.2, 0.2, 0.2], keyboardListener);
    var listener_drone_up = (function(e) {
        droneCameraControl.keyUpListener(e);
    });
    var listener_drone_down = (function(e) {
        droneCameraControl.keyDownListener(e);
    });
    
    // var listener_cameras_change = (function(e) {
    //     if (e.key == "1") {

    //     }
    // });

    keyboardListener.registerKeyUpListener(listener_drone_up);
    keyboardListener.registerKeyDownListener(listener_drone_down);
    keyboardListener.initialize();    

    return [droneCameraControl, orbitalCameraControl];
}
