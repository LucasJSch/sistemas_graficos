class KeyboardListener {
    // Registers listeners to key events.
    // Each listener must have a execute() method.
    constructor() {
        this.keydown_listeners = {};
        this.keyup_listeners = {};
    }

    registerKeyDownListener(key, listener) {
        this.keydown_listeners[key] = listener;
        console.log(this.keydown_listeners);
    }
    
    registerKeyUpListener(key, listener) {
        this.keyup_listeners[key] = listener;
    }

    initialize() {
        var keydown_listeners = this.keydown_listeners;
        document.addEventListener("keydown", function(e) {
            if (keydown_listeners.hasOwnProperty(e.key)) {
                keydown_listeners[e.key].execute();
            }
        });

        var keyup_listeners = this.keyup_listeners;
        document.addEventListener("keyup", function(e) {
            if (keyup_listeners.hasOwnProperty(e.key)) {
                keyup_listeners[e.key].execute();
            }
        });
    }

}