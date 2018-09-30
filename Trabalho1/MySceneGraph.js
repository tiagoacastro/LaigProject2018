var DEGREE_TO_RAD = Math.PI / 180;

// Order of the groups in the XML document.
var SCENE_INDEX = 0
var VIEWS_INDEX = 1;
var AMBIENT_INDEX = 2;
var LIGHTS_INDEX = 3;
var TEXTURES_INDEX = 4;
var MATERIALS_INDEX = 5;
var TRANSFORMATIONS_INDEX = 6;
var PRIMITIVES_INDEX = 7;
var COMPONENTS_INDEX = 8;

/**
 * MySceneGraph class, representing the scene graph.
 */
class MySceneGraph {
    /**
     * @constructor
     */
    constructor(filename, scene) {
        this.loadedOk = null;

        // Establish bidirectional references between scene and graph.
        this.scene = scene;
        scene.graph = this;

        this.nodes = [];

        this.idRoot = null;                    // The id of the root element.

        this.axisCoords = [];
        this.axisCoords['x'] = [1, 0, 0];
        this.axisCoords['y'] = [0, 1, 0];
        this.axisCoords['z'] = [0, 0, 1];

        // File reading 
        this.reader = new CGFXMLreader();

        /*
         * Read the contents of the xml file, and refer to this class for loading and error handlers.
         * After the file is read, the reader calls onXMLReady on this object.
         * If any error occurs, the reader calls onXMLError on this object, with an error message
         */

        this.reader.open('scenes/' + filename, this);
    }


    /*
     * Callback to be executed after successful reading
     */
    onXMLReady() {
        this.log("XML Loading finished.");
        var rootElement = this.reader.xmlDoc.documentElement;

        // Here should go the calls for different functions to parse the various blocks
        var error = this.parseXMLFile(rootElement);

        if (error != null) {
            this.onXMLError(error);
            return;
        }

        this.loadedOk = true;

        // As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
        this.scene.onGraphLoaded();
    }

    /**
     * Parses the XML file, processing each block.
     * @param {XML root element} rootElement
     */
    parseXMLFile(rootElement) {
        if (rootElement.nodeName != "yas")
            return "root tag <yas> missing";

        var nodes = rootElement.children;

        // Reads the names of the nodes to an auxiliary buffer.
        var nodeNames = [];

        for (var i = 0; i < nodes.length; i++) {
            nodeNames.push(nodes[i].nodeName);
        }

        var error;

        // Processes each node, verifying errors.

        // <scene>
        var index;
        if ((index = nodeNames.indexOf("scene")) == -1)
            return "tag <scene> missing";
        else {
            if (index != SCENE_INDEX)
                this.onXMLMinorError("tag <scene> out of order");

            //Parse scene block
            if ((error = this.parseScene(nodes[index])) != null)
                return error;
        }

        // <views>
        var index;
        if ((index = nodeNames.indexOf("views")) == -1)
            return "tag <views> missing";
        else {
            if (index != VIEWS_INDEX)
                this.onXMLMinorError("tag <views> out of order");

            //Parse views block
            if ((error = this.parseViews(nodes[index])) != null)
                return error;
        }

        // <ambient>
        var index;
        if ((index = nodeNames.indexOf("ambient")) == -1)
            return "tag <ambient> missing";
        else {
            if (index != AMBIENT_INDEX)
                this.onXMLMinorError("tag <ambient> out of order");

            //Parse ambient block
            if ((error = this.parseAmbient(nodes[index])) != null)
                return error;
        }

        // <lights>
        if ((index = nodeNames.indexOf("lights")) == -1)
            return "tag <lights> missing";
        else {
            if (index != LIGHTS_INDEX)
                this.onXMLMinorError("tag <lights> out of order");

            //Parse lights block
            if ((error = this.parseLights(nodes[index])) != null)
                return error;
        }

        // <textures>
        if ((index = nodeNames.indexOf("textures")) == -1)
            return "tag <textures> missing";
        else {
            if (index != TEXTURES_INDEX)
                this.onXMLMinorError("tag <textures> out of order");

            //Parse textures block
            if ((error = this.parseTextures(nodes[index])) != null)
                return error;
        }

        // <materials>
        if ((index = nodeNames.indexOf("materials")) == -1)
            return "tag <materials> missing";
        else {
            if (index != MATERIALS_INDEX)
                this.onXMLMinorError("tag <materials> out of order");

            //Parse materials block
            if ((error = this.parseMaterials(nodes[index])) != null)
                return error;
        }

        // <transformations>
        if ((index = nodeNames.indexOf("transformations")) == -1)
            return "tag <transformations> missing";
        else {
            if (index != TRANSFORMATIONS_INDEX)
                this.onXMLMinorError("tag <transformations> out of order");

            //Parse transformations block
            if ((error = this.parseTransformations(nodes[index])) != null)
                return error;
        }

        // <primitives>
        if ((index = nodeNames.indexOf("primitives")) == -1)
            return "tag <primitives> missing";
        else {
            if (index != PRIMITIVES_INDEX)
                this.onXMLMinorError("tag <primitives> out of order");

            //Parse primitives block
            if ((error = this.parsePrimitives(nodes[index])) != null)
                return error;
        }

        // <components>
        if ((index = nodeNames.indexOf("components")) == -1)
            return "tag <components> missing";
        else {
            if (index != COMPONENTS_INDEX)
                this.onXMLMinorError("tag <components> out of order");

            //Parse components block
            if ((error = this.parseComponents(nodes[index])) != null)
                return error;
        }

        console.log(this);
    }

    /**
     * Parses the <scene> block.
     */
    parseScene(sceneNode) {
        this.root = this.reader.getString(sceneNode, 'root');
        this.axis_length = this.reader.getFloat(sceneNode, 'axis_length'); 
        
        if (!(this.root != null && !isNaN(this.root))) {
            this.root = 1;
            this.onXMLMinorError("unable to parse value for root plane; assuming 'root = 1'");
        }
        if (!(this.axis_length != null && !isNaN(this.axis_length))) {
            this.axis_length = 1;
            this.onXMLMinorError("unable to parse value for axis_length plane; assuming 'axis_length = 1'");
        }

        this.log("Parsed scene");
        return null;
    }

    /**
     * Parses the <ambient> block.
     */
    parseAmbient(ambientNode) {
        var children = ambientNode.children;
        var nodeNames = [];
        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        var indexAmbient = nodeNames.indexOf("ambient");
        this.ambientR = 2;
        this.ambientG = 2;
        this.ambientB = 2;
        this.ambientA = 1;
        if (indexAmbient == -1) {
            this.onXMLMinorError("ambient planes missing; assuming 'r = 2' and 'g = 2' and 'b = 2' and 'a = 1'");
        }
        else {
            this.ambientR = this.reader.getFloat(children[indexAmbient], 'r');
            this.ambientG = this.reader.getFloat(children[indexAmbient], 'g');
            this.ambientB = this.reader.getFloat(children[indexAmbient], 'b');
            this.ambientA = this.reader.getFloat(children[indexAmbient], 'a');

            if (!(this.ambientR != null && !isNaN(this.ambientR))) {
                this.ambientR = 2;
                this.onXMLMinorError("unable to parse value for r plane; assuming 'r = 2'");
            }
            if (!(this.ambientG != null && !isNaN(this.ambientG))) {
                this.ambientG = 2;
                this.onXMLMinorError("unable to parse value for g plane; assuming 'g = 2'");
            }
            if (!(this.ambientB != null && !isNaN(this.ambientB))) {
                this.ambientB = 2;
                this.onXMLMinorError("unable to parse value for b plane; assuming 'b = 2'");
            }
            if (!(this.ambientA != null && !isNaN(this.ambientA))) {
                this.ambientA = 1;
                this.onXMLMinorError("unable to parse value for a plane; assuming 'a = 1'");
            }
        }

        var indexBackground = nodeNames.indexOf("background");
        this.backgroundR = 2;
        this.backgroundG = 2;
        this.backgroundB = 2;
        this.backgroundA = 1;
        if (indexBackground == -1) {
            this.onXMLMinorError("background planes missing; assuming 'r = 2' and 'g = 2' and 'b = 2' and 'a = 1'");
        }
        else {
            this.backgroundR = this.reader.getFloat(children[indexBackground], 'r');
            this.backgroundG = this.reader.getFloat(children[indexBackground], 'g');
            this.backgroundB = this.reader.getFloat(children[indexBackground], 'b');
            this.backgroundA = this.reader.getFloat(children[indexBackground], 'a');

            if (!(this.backgroundR != null && !isNaN(this.backgroundR))) {
                this.backgroundR = 2;
                this.onXMLMinorError("unable to parse value for r plane; assuming 'r = 2'");
            }
            if (!(this.backgroundG != null && !isNaN(this.backgroundG))) {
                this.backgroundG = 2;
                this.onXMLMinorError("unable to parse value for g plane; assuming 'g = 2'");
            }
            if (!(this.backgroundB != null && !isNaN(this.backgroundB))) {
                this.backgroundB = 2;
                this.onXMLMinorError("unable to parse value for b plane; assuming 'b = 2'");
            }
            if (!(this.backgroundA != null && !isNaN(this.backgroundA))) {
                this.backgroundA = 1;
                this.onXMLMinorError("unable to parse value for a plane; assuming 'a = 1'");
            }
        }     

        this.log("Parsed scene");
        return null;
    }

    /**
     * Parses the <primitives> block.
     */
    parsePrimitives(primitivesNode) {
        var children = primitivesNode.children;
        var nodeNames = [];
        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName); 
        


        this.log("Parsed primitives");

        return null;
    }

    /*
     * Callback to be executed on any read error, showing an error on the console.
     * @param {string} message
     */
    onXMLError(message) {
        console.error("XML Loading Error: " + message);
        this.loadedOk = false;
    }

    /**
     * Callback to be executed on any minor error, showing a warning on the console.
     * @param {string} message
     */
    onXMLMinorErro(message) {
        console.warn("Warning: " + message);
    }


    /**
     * Callback to be executed on any message.
     * @param {string} message
     */
    log(message) {
        console.log("   " + message);
    }

    /**
     * Displays the scene, processing each node, starting in the root node.
     */
    displayScene() {
        // entry point for graph rendering
        //TODO: Render loop starting at root of graph
    }
}