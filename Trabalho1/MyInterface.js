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
     * Adds a tickbox to toggle the axis.
     */
    addAxisCheckBox() {
        this.gui.add(this.scene, "axisDisplay").name('Axis');
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
    /**
     * Adds a folder containing the IDs of the views passed as parameter.
     * @param {array} cameras
     */
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
    /**
     * initializes key data
     */
    initKeys() {
		this.scene.gui = this;
		this.processKeyboard = function(){};
        this.activeKeys = {};
        this.releasedKeys = {};
	};
    /**
     * when key is pressed, sets it as true in the activeKyes array
     * @param {Event} event 
     */
	processKeyDown(event) {
		this.activeKeys[event.code]=true;
	};
    /**
     * when key is let go, sets it as false in the activeKyes array and true in the releasedKeys array
     * @param {Event} event 
     */
	processKeyUp(event) {
        this.releasedKeys[event.code] = true;
        this.activeKeys[event.code]=false;
	};
    /**
     * Checks if key was released
     * @param {Event} keyCode 
     */
    wasKeyReleased(keyCode) {
        return this.releasedKeys[keyCode] || false;
    };
}