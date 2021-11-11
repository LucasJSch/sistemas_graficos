class KeyboardListener {
    // Registers listeners to key events.
    constructor() {
        this.keydown_listeners = [];
        this.keyup_listeners = [];
        this.mouse_wheel_listeners = [];
    }

    registerKeyDownListener(listener) {
        this.keydown_listeners.push(listener);
    }
    
    registerKeyUpListener(listener) {
        this.keyup_listeners.push(listener);
    }

    registerMouseWheelListener(listener) {
        this.mouse_wheel_listeners.push(listener);
    }

    initialize() {
        var keydown_listeners = this.keydown_listeners;
        document.addEventListener("keydown", function(e) {
            if (keydown_listeners != null) {
                for (var i = 0; i < keydown_listeners.length; i++) {
                    keydown_listeners[i](e);
                }
            }
        });

        var keyup_listeners = this.keyup_listeners;
        document.addEventListener("keyup", function(e) {
            if (keyup_listeners != null) {
                for (var i = 0; i < keyup_listeners.length; i++) {
                    keyup_listeners[i](e);
                }
            }
        });

        var mousewheel_listeners = this.mouse_wheel_listeners;
        document.addEventListener("wheel", function(e) {
            if (mousewheel_listeners != null) {
                for (var i = 0; i < mousewheel_listeners.length; i++) {
                    mousewheel_listeners[i](e);
                }
            }
        });   
    }

}