/**
* MyInterface class, creating a GUI interface.
*/
class MyInterface extends CGFinterface {
    /**
     * @constructor
     */
    constructor() {
        super();
    }

    /**
     * Initializes the interface.
     * @param {CGFapplication} application
     */
    init(application) {
        super.init(application);
        // init GUI. For more information on the methods, check:
        //  http://workshop.chromeexperiments.com/examples/gui

        this.gui = new dat.GUI();

        // add a group of controls (and open/expand by defult)

        this.initKeys();

        return true;
    }

    /**
     * Adds a folder containing the IDs of the lights passed as parameter.
     * @param {array} lights
     */
    addLightsGroup(lights) {

        var group = this.gui.addFolder("Lights");
        group.open();

        for (var key in lights) {
            if (lights.hasOwnProperty(key)) {
                this.scene.lightValues[key] = lights[key][2];
                group.add(this.scene.lightValues, key).name(lights[key][1]);
            }
        }
    }

    addViewsGroup(cameras) {
        var group = this.gui.addFolder("Views");
        group.open();   

        const cameraIds = Object.keys(cameras);
        this.currentCamera = this.scene.graph.default;

        let scene = this.scene;
        let inter = this;

        group.add(this, 'currentCamera', cameraIds).name('Camera').onChange(function(val){
            scene.camera = cameras[val];
            inter.setActiveCamera(cameras[val]);
        });
    }

    initKeys() {
		this.scene.gui = this;
		this.processKeyboard = function(){};
        this.activeKeys = {};
        this.releasedKeys = {};
	};

	processKeyDown(event) {
		this.activeKeys[event.code]=true;
	};

	processKeyUp(event) {
        this.releasedKeys[event.code] = true;
        this.activeKeys[event.code]=false;
	};

	isKeyPressed(keyCode) {
		return this.activeKeys[keyCode] || false;
    };

    wasKeyReleased(keyCode) {
        return this.releasedKeys[keyCode] || false;
    };
    
}