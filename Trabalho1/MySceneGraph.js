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
        
    }

    /**
     * Parses the <scene> block.
     * @param {scene block element} sceneNode
     */
    parseScene(sceneNode) {
        this.root = this.reader.getString(sceneNode, 'root');
        this.axis_length = this.reader.getFloat(sceneNode, 'axis_length'); 
        
        if (this.root == null) {
            this.root = "unique_scene";
            this.onXMLMinorError("unable to parse value for root plane; assuming 'root = 'unique_scene''");
        }

        if (!(this.axis_length != null && !isNaN(this.axis_length))) {
            this.axis_length = 1;
            this.onXMLMinorError("unable to parse value for axis_length plane; assuming 'axis_length = 1'");
        }
        if(this.axis_length <= 0) {
            this.axis_length = 1;
            this.onXMLMinorError("axis_length must be higher than 0; assuming 'axis_length = 1'");
        }

        this.log("Parsed scene");

        return null;
    }

    /**
     * Parses the <ambient> block.
     * @param {ambient block element} ambientNode
     */
    parseAmbient(ambientNode) {

        var children = ambientNode.children;
        var nodeNames = [];
        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        var indexAmbient = nodeNames.indexOf("ambient");
        this.ambient = [0, 0, 0, 1];
        if (indexAmbient == -1) {
            this.onXMLError("ambient planes missing; assuming 'r = 0' and 'g = 0' and 'b = 0' and 'a = 1'");
        }
        else {
            this.ambient[0] = this.reader.getFloat(children[indexAmbient], 'r');
            this.ambient[1] = this.reader.getFloat(children[indexAmbient], 'g');
            this.ambient[2] = this.reader.getFloat(children[indexAmbient], 'b');
            this.ambient[3] = this.reader.getFloat(children[indexAmbient], 'a');

            if (!(this.ambient[0] != null && !isNaN(this.ambient[0]))) {
                this.ambient[0] = 0;
                this.onXMLMinorError("unable to parse value for r plane; assuming 'r = 0'");
            }
            if (this.ambient[0] < 0 || this.ambient[0] > 255){
                this.ambient[0] = 0;
                this.onXMLMinorError("r must be between 0 and 255");
            }

            if (!(this.ambient[1] != null && !isNaN(this.ambient[1]))) {
                this.ambient[1] = 0;
                this.onXMLMinorError("unable to parse value for g plane; assuming 'g = 0'");
            }
            if (this.ambient[1] < 0 || this.ambient[1] > 255){
                this.ambient[1] = 0;
                this.onXMLMinorError("g must be between 0 and 255");
            }

            if (!(this.ambient[2] != null && !isNaN(this.ambient[2]))) {
                this.ambient[2] = 0;
                this.onXMLMinorError("unable to parse value for b plane; assuming 'b = 0'");
            }
            if (this.ambient[2] < 0 || this.ambient[2] > 255){
                this.ambient[2] = 0;
                this.onXMLMinorError("b must be between 0 and 255");
            }

            if (!(this.ambient[3] != null && !isNaN(this.ambient[3]))) {
                this.ambient[3] = 1;
                this.onXMLMinorError("unable to parse value for a plane; assuming 'a = 1'");
            }
            if (this.ambient[3] < 0 || this.ambient[3] > 255){
                this.ambient[3] = 0;
                this.onXMLMinorError("a must be between 0 and 255");
            }
        }

        var indexBackground = nodeNames.indexOf("background");
        this.background = [0, 0, 0, 1];
        if (indexBackground == -1) {
            this.onXMLError("background planes missing; assuming 'r = 0' and 'g = 0' and 'b = 0' and 'a = 1'");
        }
        else {
            this.background[0] = this.reader.getFloat(children[indexBackground], 'r');
            this.background[1] = this.reader.getFloat(children[indexBackground], 'g');
            this.background[2] = this.reader.getFloat(children[indexBackground], 'b');
            this.background[3] = this.reader.getFloat(children[indexBackground], 'a');

            if (!(this.background[0] != null && !isNaN(this.background[0]))) {
                this.background[0] = 0;
                this.onXMLMinorError("unable to parse value for r plane; assuming 'r = 2'");
            }
            if (this.background[0] < 0 || this.background[0] > 255){
                this.background[0] = 0;
                this.onXMLMinorError("r must be between 0 and 255");
            }

            if (!(this.background[1] != null && !isNaN(this.background[1]))) {
                this.background[1] = 0;
                this.onXMLMinorError("unable to parse value for g plane; assuming 'g = 2'");
            }
            if (this.background[1] < 0 || this.background[1] > 255){
                this.background[1] = 0;
                this.onXMLMinorError("g must be between 0 and 255");
            }

            if (!(this.background[2] != null && !isNaN(this.background[2]))) {
                this.background[2] = 0;
                this.onXMLMinorError("unable to parse value for b plane; assuming 'b = 2'");
            }
            if (this.background[2] < 0 || this.background[2] > 255){
                this.background[2] = 0;
                this.onXMLMinorError("b must be between 0 and 255");
            }

            if (!(this.background[3] != null && !isNaN(this.background[3]))) {
                this.background[3] = 1;
                this.onXMLMinorError("unable to parse value for a plane; assuming 'a = 1'");
            }
            if (this.background[3] < 0 || this.background[3] > 255){
                this.background[3] = 0;
                this.onXMLMinorError("a must be between 0 and 255");
            }
        }     

        this.log("Parsed ambient");
        return null;
    }

    parseLights(lightsNode) {

        this.lights = [];
        var numLights = 0;

        var children = lightsNode.children;

        //Should have at least one light (omni or spot)
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "omni" && children[i].nodeName != "spot") {
                this.onXMLMinorError("unknown tag <" + children.nodeName + ">");
                continue;
            }

            //omni
            if (children[i].nodeName == "omni") {
                
                var omniLight =  new MyOmniLight();

                omniLight = this.parseOmniLight(children[i]);
                
                this.lights.push(omniLight);
                numLights++;
            }

            //spot
            if (children[i].nodeName == "spot") {
                
                var spotLight =  new MySpotLight();

                spotLight = this.parseSpotLight(children[i]);
             
                this.lights.push(spotLight);
                numLights++;
            }

        }

        this.log("Parsed lights");

        return null;
        
    }

    parseOmniLight(omni) {
        
        var omniAux = new MyOmniLight();

        var aux = this.reader.getFloat(omni, 'enabled');
        if (!(aux != null && !isNaN(aux) && (aux == 0 || aux == 1))) {
            this.onXMLMinorError("unable to parse value component of the 'enable light' field for ID = " + lightId + "; assuming 'value = 1'")
        }

        var lightId = this.reader.getString(omni, 'id');
        if (lightId == null) {
            return "no ID defined for light";
        }

        if (this.lights[lightId] != null) {
            return "ID must be unique for each light (conflict: ID = " + lightId + ")";
        }

        omniAux.id = lightId;

        var specs = omni.children;

        var nodeNames = [];
        for (var i = 0; i < specs.length; i++) {
            nodeNames.push(specs[i].nodeName);
        }

        //Get indices of each element
        var locationIndex = nodeNames.indexOf("location");
        var ambientIndex = nodeNames.indexOf("ambient");
        var diffuseIndex = nodeNames.indexOf("diffuse");
        var specularIndex = nodeNames.indexOf("specular");

        //Light location
        var lightLocation = [];
        if (locationIndex != -1) {
            //x
            var x = this.reader.getFloat(specs[locationIndex], 'x');
            if (!(x != null && !isNaN(x))) {
                return "unable to parse x-coordinate of the light position for ID = " + lightId;
            }
            else {
                lightLocation.push(x);
            }
            //y
            var y = this.reader.getFloat(specs[locationIndex], 'y');
            if (!(y != null && !isNaN(y))) {
                return "unable to parse y-coordinate of the light position for ID = " + lightId;
            }
            else {
                lightLocation.push(y);
            }
            //z
            var z = this.reader.getFloat(specs[locationIndex], 'z');
            if (!(z != null && !isNaN(z))) {
                return "unable to parse z-coordinate of the light position for ID = " + lightId;
            }
            else {
                lightLocation.push(z);
            }
            //w
            var w = this.reader.getFloat(specs[locationIndex], 'w');
            if (!(w != null && !isNaN(w))) {
                return "unable to parse w-coordinate of the light position for ID = " + lightId;
            }
            else {
                lightLocation.push(w);
            }

            omniAux.location = lightLocation;
        }

        //ambient values
        var ambientValues = [];
        if (ambientIndex != -1) {
            var r = this.reader.getFloat(specs[ambientIndex], 'r');
            if (r == null || isNaN(r)) {
                return "unable to parse r value of light ID = " + lightId;
            } else {
                ambientValues.push(r);
            }

            var g = this.reader.getFloat(specs[ambientIndex], 'g');
            if (g == null || isNaN(g)) {
                return "unable to parse g value of light ID = " + lightId;
            } else {
                ambientValues.push(g);
            }

            var b = this.reader.getFloat(specs[ambientIndex], 'b');
            if (b == null || isNaN(b)) {
                return "unable to parse b value of light ID = " + lightId;
            } else {
                ambientValues.push(b);
            }

            var a = this.reader.getFloat(specs[ambientIndex], 'r');
            if (a == null || isNaN(a)) {
                return "unable to parse r value of light ID = " + lightId;
            } else {
                ambientValues.push(a);
            }

            omniAux.ambient = ambientValues;
        }

        //diffuse values
        var diffuseValues = [];
        if (diffuseIndex != -1) {
            var r = this.reader.getFloat(specs[diffuseIndex], 'r');
            if (r == null || isNaN(r)) {
                return "unable to parse r value of light ID = " + lightId;
            } else {
                diffuseValues.push(r);
            }

            var g = this.reader.getFloat(specs[diffuseIndex], 'g');
            if (g == null || isNaN(g)) {
                return "unable to parse g value of light ID = " + lightId;
            } else {
                diffuseValues.push(g);
            }

            var b = this.reader.getFloat(specs[diffuseIndex], 'b');
            if (b == null || isNaN(b)) {
                return "unable to parse b value of light ID = " + lightId;
            } else {
                diffuseValues.push(b);
            }

            var a = this.reader.getFloat(specs[diffuseIndex], 'r');
            if (a == null || isNaN(a)) {
                return "unable to parse r value of light ID = " + lightId;
            } else {
                diffuseValues.push(a);
            }

            omniAux.diffuse = diffuseValues;
        }

        //specular values
        var specularValues = [];
        if (specularIndex != -1) {
            var r = this.reader.getFloat(specs[specularIndex], 'r');
            if (r == null || isNaN(r)) {
                return "unable to parse r value of light ID = " + lightId;
            } else {
                specularValues.push(r);
            }

            var g = this.reader.getFloat(specs[specularIndex], 'g');
            if (g == null || isNaN(g)) {
                return "unable to parse g value of light ID = " + lightId;
            } else {
                specularValues.push(g);
            }

            var b = this.reader.getFloat(specs[specularIndex], 'b');
            if (b == null || isNaN(b)) {
                return "unable to parse b value of light ID = " + lightId;
            } else {
                specularValues.push(b);
            }

            var a = this.reader.getFloat(specs[specularIndex], 'r');
            if (a == null || isNaN(a)) {
                return "unable to parse r value of light ID = " + lightId;
            } else {
                specularValues.push(a);
            }

            omniAux.specular = specularValues;
        }

        return omniAux;

    }

    parseSpotLight(spot) {

        var spotAux = new MySpotLight();

        var lightId = this.reader.getString(spot, 'id');
        if (lightId == null) {
            return "no ID defined for light";
        }

        if (this.lights[lightId] != null) {
            return "ID must be unique for each light (conflict: ID = " + lightId + ")";
        }

        var auxEnable = this.reader.getFloat(spot, 'enabled');
        if (!(auxEnable != null && !isNaN(auxEnable) && (auxEnable == 0 || auxEnable == 1))) {
            this.onXMLMinorError("unable to parse value component of the 'enable light' field for ID = " + lightId + "; assuming 'value = 1'")
        }

        var auxAngle = this.reader.getFloat(spot, 'angle');
        if (!(auxAngle != null && !isNaN(auxAngle))) {
            this.onXMLMinorError("unable to parse value component of the 'enable light' field for ID = " + lightId + "; assuming 'value = 1'")
        }

        var auxExponent = this.reader.getFloat(spot, 'angle');
        if (!(auxExponent != null && !isNaN(auxExponent))) {
            this.onXMLMinorError("unable to parse value component of the 'enable light' field for ID = " + lightId + "; assuming 'value = 1'")
        }

        spotAux.id = lightId;
        spotAux.enabled = auxEnable;
        spotAux.angle = auxAngle;
        spotAux.exponent = auxExponent;

        var specs = spot.children;

        var nodeNames = [];
        for (var i = 0; i < specs.length; i++) {
            nodeNames.push(specs[i].nodeName);
        }

        //Get indices of each element
        var targetIndex = nodeNames.indexOf("target");
        var locationIndex = nodeNames.indexOf("location");
        var ambientIndex = nodeNames.indexOf("ambient");
        var diffuseIndex = nodeNames.indexOf("diffuse");
        var specularIndex = nodeNames.indexOf("specular");

        //Light location
        var lightLocation = [];
        if (locationIndex != -1) {

            

            //x
            var x = this.reader.getFloat(specs[locationIndex], 'x');
            if (!(x != null && !isNaN(x))) {
                return "unable to parse x-coordinate of the light position for ID = " + lightId;
            }
            else {
                lightLocation.push(x);
            }
            //y
            var y = this.reader.getFloat(specs[locationIndex], 'y');
            if (!(y != null && !isNaN(y))) {
                return "unable to parse y-coordinate of the light position for ID = " + lightId;
            }
            else {
                lightLocation.push(y);
            }
            //z
            var z = this.reader.getFloat(specs[locationIndex], 'z');
            if (!(z != null && !isNaN(z))) {
                return "unable to parse z-coordinate of the light position for ID = " + lightId;
            }
            else {
                lightLocation.push(z);
            }
            //w
            var w = this.reader.getFloat(specs[locationIndex], 'w');
            if (!(w != null && !isNaN(w))) {
                return "unable to parse w-coordinate of the light position for ID = " + lightId;
            }
            else {
                lightLocation.push(w);
            }

            spotAux.location = lightLocation;
        }

        //Light target
        var lightTarget = [];
        if (targetIndex != -1) {

            

            //x
            var x = this.reader.getFloat(specs[targetIndex], 'x');
            if (!(x != null && !isNaN(x))) {
                return "unable to parse x-coordinate of the light position for ID = " + lightId;
            }
            else {
                lightTarget.push(x);
            }
            //y
            var y = this.reader.getFloat(specs[targetIndex], 'y');
            if (!(y != null && !isNaN(y))) {
                return "unable to parse y-coordinate of the light position for ID = " + lightId;
            }
            else {
                lightTarget.push(y);
            }
            //z
            var z = this.reader.getFloat(specs[targetIndex], 'z');
            if (!(z != null && !isNaN(z))) {
                return "unable to parse z-coordinate of the light position for ID = " + lightId;
            }
            else {
                lightTarget.push(z);
            }

            spotAux.target = lightTarget;
        }

        //ambient values
        var ambientValues = [];
        if (ambientIndex != -1) {
            var r = this.reader.getFloat(specs[ambientIndex], 'r');
            if (r == null || isNaN(r)) {
                return "unable to parse r value of light ID = " + lightId;
            } else {
                ambientValues.push(r);
            }

            var g = this.reader.getFloat(specs[ambientIndex], 'g');
            if (g == null || isNaN(g)) {
                return "unable to parse g value of light ID = " + lightId;
            } else {
                ambientValues.push(g);
            }

            var b = this.reader.getFloat(specs[ambientIndex], 'b');
            if (b == null || isNaN(b)) {
                return "unable to parse b value of light ID = " + lightId;
            } else {
                ambientValues.push(b);
            }

            var a = this.reader.getFloat(specs[ambientIndex], 'r');
            if (a == null || isNaN(a)) {
                return "unable to parse r value of light ID = " + lightId;
            } else {
                ambientValues.push(a);
            }

            spotAux.ambient = ambientValues;
        }

        //diffuse values
        var diffuseValues = [];
        if (diffuseIndex != -1) {
            var r = this.reader.getFloat(specs[diffuseIndex], 'r');
            if (r == null || isNaN(r)) {
                return "unable to parse r value of light ID = " + lightId;
            } else {
                diffuseValues.push(r);
            }

            var g = this.reader.getFloat(specs[diffuseIndex], 'g');
            if (g == null || isNaN(g)) {
                return "unable to parse g value of light ID = " + lightId;
            } else {
                diffuseValues.push(g);
            }

            var b = this.reader.getFloat(specs[diffuseIndex], 'b');
            if (b == null || isNaN(b)) {
                return "unable to parse b value of light ID = " + lightId;
            } else {
                diffuseValues.push(b);
            }

            var a = this.reader.getFloat(specs[diffuseIndex], 'r');
            if (a == null || isNaN(a)) {
                return "unable to parse r value of light ID = " + lightId;
            } else {
                diffuseValues.push(a);
            }

           spotAux.diffuse = diffuseValues;
        }

        //specular values
        var specularValues = [];
        if (specularIndex != -1) {
            var r = this.reader.getFloat(specs[specularIndex], 'r');
            if (r == null || isNaN(r)) {
                return "unable to parse r value of light ID = " + lightId;
            } else {
                specularValues.push(r);
            }

            var g = this.reader.getFloat(specs[specularIndex], 'g');
            if (g == null || isNaN(g)) {
                return "unable to parse g value of light ID = " + lightId;
            } else {
                specularValues.push(g);
            }

            var b = this.reader.getFloat(specs[specularIndex], 'b');
            if (b == null || isNaN(b)) {
                return "unable to parse b value of light ID = " + lightId;
            } else {
                specularValues.push(b);
            }

            var a = this.reader.getFloat(specs[specularIndex], 'r');
            if (a == null || isNaN(a)) {
                return "unable to parse r value of light ID = " + lightId;
            } else {
                specularValues.push(a);
            }

            spotAux.specular = specularValues;
        }

        return spotAux;

    }

    /**
     * Parses the <rectangle> block.
     * @param {rectangle element} rectangleNode
     * @return rectangle object
     */
    parseRectangle(rectangleNode){
        let x1 = this.reader.getFloat(rectangleNode, 'x1');
        if (!(x1 != null && !isNaN(x1))) {
            x1 = 0;
            this.onXMLMinorError("unable to parse value for x1 plane; assuming 'x1 = 0'");
        }

        let y1 = this.reader.getFloat(rectangleNode, 'y1');
        if (!(y1 != null && !isNaN(y1))) {
            y1 = 0;
            this.onXMLMinorError("unable to parse value for y1 plane; assuming 'y1 = 0'");
        }

        let x2 = this.reader.getFloat(rectangleNode, 'x2');
        if (!(x2 != null && !isNaN(x2))) {
            x2 = 1;
            this.onXMLMinorError("unable to parse value for x2 plane; assuming 'x2 = 1'");
        }

        let y2 = this.reader.getFloat(rectangleNode, 'y2');
        if (!(y2 != null && !isNaN(y2))) {
            y2 = 1;
            this.onXMLMinorError("unable to parse value for y2 plane; assuming 'y2 = 1'");
        }

        //criar retangulo
        var rectangle = new MyRectangle(this.scene, x1, x2, y1, y2);
        this.log("Parsed rectangle");

        return rectangle;
    }

    /**
     * Parses the <triangle> block.
     * @param {triangle element} triangleNode
     * @return triangle object
     */
    parseTriangle(triangleNode){
        let x1 = this.reader.getFloat(triangleNode, 'x1');
        if (!(x1 != null && !isNaN(x1))) {
            x1 = 0;
            this.onXMLMinorError("unable to parse value for x1 plane; assuming 'x1 = 0'");
        }

        let y1 = this.reader.getFloat(triangleNode, 'y1');
        if (!(y1 != null && !isNaN(y1))) {
            y1 = 0;
            this.onXMLMinorError("unable to parse value for y1 plane; assuming 'y1 = 0'");
        }

        let z1 = this.reader.getFloat(triangleNode, 'z1');
        if (!(z1 != null && !isNaN(z1))) {
            z1 = 0;
            this.onXMLMinorError("unable to parse value for z1 plane; assuming 'z1 = 0'");
        }

        let x2 = this.reader.getFloat(triangleNode, 'x2');
        if (!(x2 != null && !isNaN(x2))) {
            x2 = 1;
            this.onXMLMinorError("unable to parse value for x2 plane; assuming 'x2 = 1'");
        }

        let y2 = this.reader.getFloat(triangleNode, 'y2');
        if (!(y2 != null && !isNaN(y2))) {
            y2 = 1;
            this.onXMLMinorError("unable to parse value for y2 plane; assuming 'y2 = 1'");
        }

        let z2 = this.reader.getFloat(triangleNode, 'z2');
        if (!(z2 != null && !isNaN(z2))) {
            z2 = 1;
            this.onXMLMinorError("unable to parse value for z2 plane; assuming 'z2 = 1'");
        }

        let x3 = this.reader.getFloat(triangleNode, 'x3');
        if (!(x3 != null && !isNaN(x3))) {
            x3 = 1;
            this.onXMLMinorError("unable to parse value for x3 plane; assuming 'x3 = 1'");
        }

        let y3 = this.reader.getFloat(triangleNode, 'y3');
        if (!(y3 != null && !isNaN(y3))) {
            y3 = 1;
            this.onXMLMinorError("unable to parse value for y3 plane; assuming 'y3 = 1'");
        }

        let z3 = this.reader.getFloat(triangleNode, 'z3');
        if (!(z3 != null && !isNaN(z3))) {
            z3 = 0;
            this.onXMLMinorError("unable to parse value for z3 plane; assuming 'z3 = 0'");
        }

        var triangle = new MyTriangle(this.scene, x1, x2, x3, y1, y2, y3, z1, z2, z3);
        this.log("Parsed triangle");

        return triangle;
    }

    /**
     * Parses the <cylinder> block.
     * @param {cylinder element} cylinderNode
     * @return cylinder object
     */
    parseCylinder(cylinderNode){
        let base = this.reader.getFloat(cylinderNode, 'base');
        if (!(base != null && !isNaN(base))) {
            base = 1;
            this.onXMLMinorError("unable to parse value for base plane; assuming 'base = 1'");
        }
        if(base <= 0) {
            base = 1;
            this.onXMLMinorError("base can't be equal or lower than 0, assuming 'base = 1'");
        }

        let top = this.reader.getFloat(cylinderNode, 'top');
        if (!(top != null && !isNaN(top))) {
            top = 1;
            this.onXMLMinorError("unable to parse value for top plane; assuming 'top = 1'");
        }
        if(top <= 0) {
            top = 1;
            this.onXMLMinorError("top can't be equal or lower than 0, assuming 'top = 1'");
        }

        let height = this.reader.getFloat(cylinderNode, 'height');
        if (!(height != null && !isNaN(height))) {
            height = 1;
            this.onXMLMinorError("unable to parse value for height plane; assuming 'height = 1'");
        }
        if(height <= 0) {
            height = 1;
            this.onXMLMinorError("height can't be equal or lower than 0, assuming 'height = 1'");
        }

        let slices = this.reader.getFloat(cylinderNode, 'slices');
        if (!(slices != null && !isNaN(slices))) {
            slices = 1;
            this.onXMLMinorError("unable to parse value for slices plane; assuming 'slices = 1'");
        }
        if(slices <= 1 || slices % 1 != 0) {
            slices = 1;
            this.onXMLMinorError("slices can't be 0 or floats, assuming 'slices = 1'");
        }

        let stacks = this.reader.getFloat(cylinderNode, 'stacks');
        if (!(stacks != null && !isNaN(stacks))) {
            stacks = 1;
            this.onXMLMinorError("unable to parse value for stacks plane; assuming 'stacks = 1'");
        }
        if(stacks <= 1 || stacks % 1 != 0) {
            stacks = 1;
            this.onXMLMinorError("stacks can't be 0 or floats, assuming 'stacks = 1'");
        }

        //criar cilindro
        var cylinder = new MyCylinder(this.scene, base, top, height, slices, stacks);

        this.log("Parsed cylinder");

        return cylinder;
    }

    /**
     * Parses the <sphere> block.
     * @param {sphere element} sphereNode
     * @return sphere object
     */
    parseSphere(sphereNode){
        let radius = this.reader.getFloat(sphereNode, 'radius');
        if (!(radius != null && !isNaN(radius))) {
            radius = 1;
            this.onXMLMinorError("unable to parse value for radius plane; assuming 'radius = 1'");
        }
        if(radius <= 0) {
            radius = 1;
            this.onXMLMinorError("radius can't be equal or lower than 0, assuming 'radius = 1'");
        }

        let slices = this.reader.getFloat(sphereNode, 'slices');
        if (!(slices != null && !isNaN(slices))) {
            slices = 1;
            this.onXMLMinorError("unable to parse value for slices plane; assuming 'slices = 1'");
        }
        if(slices <= 1 || slices % 1 != 0) {
            slices = 1;
            this.onXMLMinorError("slices can't be 0 or floats, assuming 'slices = 1'");
        }

        let stacks = this.reader.getFloat(sphereNode, 'stacks');
        if (!(stacks != null && !isNaN(stacks))) {
            stacks = 1;
            this.onXMLMinorError("unable to parse value for stacks plane; assuming 'stacks = 1'");
        }
        if(stacks <= 1 || stacks % 1 != 0) {
            stacks = 1;
            this.onXMLMinorError("stacks can't be 0 or floats, assuming 'stacks = 1'");
        }

        //criar esfera
        var sphere = new MySphere(this.scene, radius, slices, stacks);
        this.log("Parsed sphere");

        return sphere;
    }

    /**
     * Parses the <torus> block.
     * @param {torus element} torusNode
     * @return torus object
     */
    parseTorus(torusNode){
        let inner = this.reader.getFloat(torusNode, 'inner');
        if (!(inner != null && !isNaN(inner))) {
            inner = 1;
            this.onXMLMinorError("unable to parse value for inner plane; assuming 'inner = 1'");
        }

        let outer = this.reader.getFloat(torusNode, 'outer');
        if (!(outer != null && !isNaN(outer))) {
            outer = 2;
            this.onXMLMinorError("unable to parse value for outer plane; assuming 'outer = 2'");
        }

        if(outer < inner){
            let aux = outer;
            outer = inner;
            inner = aux;
            this.onXMLMinorError("outer can't be lower than inner, assuming 'outer = inner and inner = outer'");
        }
        if(outer == inner){
            outer = 2*inner;
            this.onXMLMinorError("outer can't be equal to inner, assuming 'outer = 2*inner'");
        }

        let slices = this.reader.getFloat(torusNode, 'slices');
        if (!(slices != null && !isNaN(slices))) {
            slices = 1;
            this.onXMLMinorError("unable to parse value for slices plane; assuming 'slices = 1'");
        }
        if(slices <= 1 || slices % 1 != 0) {
            slices = 1;
            this.onXMLMinorError("slices can't be 0 or floats, assuming 'slices = 1'");
        }

        let loops = this.reader.getFloat(torusNode, 'loops');
        if (!(loops != null && !isNaN(loops))) {
            loops = 1;
            this.onXMLMinorError("unable to parse value for loops plane; assuming 'loops = 1'");
        }
        if(loops <= 1 || loops % 1 != 0) {
            loops = 1;
            this.onXMLMinorError("loops can't be 0 or floats, assuming 'loops = 1'");
        }

        //criar torus
        var torus = new MyTorus(this.scene, inner, outer, slices, loops);

        this.log("Parsed torus");

        return torus;
    }

    //implementar nos parsers das primitivas a sua criação com os valores

    /**
     * Parses the <primitives> block.
     * @param {primitives block element} primitivesNode
     */
    parsePrimitives(primitivesNode) {
        var children = primitivesNode.children;

        this.primitives = [];

        for (var i = 0; i < children.length; i++){
            var primitive = new MyPrimitive();

            if(children[i].nodeName != "primitive")
                this.onXMLError("primitive with wrong plane");

            let id = this.reader.getString(children[i], 'id');
            if (id == null) {
                this.onXMLError("unable to parse value for primitive id");
            }

            for(var j = 0; j < this.primitives.length; j++){
                if(this.primitives[j].id == id)
                    this.onXMLError("repeated id");
            }

            switch(children[i].children[0].nodeName){
                case "rectangle":
                    primitive.child = this.parseRectangle(children[i].children[0]);
                    break;
                case "triangle":
                    primitive.child = this.parseTriangle(children[i].children[0]);
                    break;
                case "cylinder":
                    primitive.child = this.parseCylinder(children[i].children[0]);
                    break;
                case "sphere":
                    primitive.child = this.parseSphere(children[i].children[0]);
                    break;
                case "torus":
                    primitive.child = this.parseTorus(children[i].children[0]);
                    break;
            }
            
            primitive.id = id;
            this.primitives.push(primitive);
        } 

        this.log("Parsed primitives");

        return null;
    }

    /**
     * Parses the <perspective> block.
     * @param {perspective block element} perspectiveNode 
     * @return  perspective camera
     */
    parsePerspective(perspectiveNode){
        let near = this.reader.getFloat(perspectiveNode, 'near');
        if (!(near != null && !isNaN(near))) {
            near = 0.1;
            this.onXMLMinorError("unable to parse value for near plane; assuming 'near = 0'");
        }

        let far = this.reader.getFloat(perspectiveNode, 'far');
        if (!(far != null && !isNaN(far))) {
            far = 30;
            this.onXMLMinorError("unable to parse value for far plane; assuming 'far = 10'");
        }

        let angle = this.reader.getFloat(perspectiveNode, 'angle');
        if (!(angle != null && !isNaN(angle))) {
            angle = Math.PI/2;
            this.onXMLMinorError("unable to parse value for angle plane; assuming 'angle = 45'");
        }

        angle = angle * Math.PI / 180;              //degrees to radians

        var children = perspectiveNode.children;
        var nodeNames = [];
        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        var indexFrom = nodeNames.indexOf("from");
        let from = [20,20,20];
        if (indexFrom == -1) {
            this.onXMLError("from planes missing; assuming 'x = 20' and 'y = 20' and 'z = 20'");
        }
        else {
            from[0] = this.reader.getFloat(children[indexFrom], 'x');
            from[1] = this.reader.getFloat(children[indexFrom], 'y');
            from[2] = this.reader.getFloat(children[indexFrom], 'z');

            if (!(from[0] != null && !isNaN(from[0]))) {
                from[0] = 20;
                this.onXMLMinorError("unable to parse value for x plane; assuming 'x = 20'");
            }

            if (!(from[1] != null && !isNaN(from[1]))) {
                from[1] = 20;
                this.onXMLMinorError("unable to parse value for y plane; assuming 'y = 20'");
            }

            if (!(from[2] != null && !isNaN(from[2]))) {
                from[2] = 20;
                this.onXMLMinorError("unable to parse value for z plane; assuming 'z = 20'");
            }
        }
        
        var indexTo = nodeNames.indexOf("to");
        let to = [0,0,0];
        if (indexTo == -1) {
            this.onXMLError("to planes missing; assuming 'x = 0' and 'y = 0' and 'z = 0'");
        }
        else {
            to[0] = this.reader.getFloat(children[indexTo], 'x');
            to[1] = this.reader.getFloat(children[indexTo], 'y');
            to[2] = this.reader.getFloat(children[indexTo], 'z');

            if (!(to[0] != null && !isNaN(to[0]))) {
                to[0] = 0;
                this.onXMLMinorError("unable to parse value for x plane; assuming 'x = 0'");
            }

            if (!(to[1] != null && !isNaN(to[1]))) {
                to[1] = 0;
                this.onXMLMinorError("unable to parse value for y plane; assuming 'y = 0'");
            }

            if (!(to[2] != null && !isNaN(to[2]))) {
                to[2] = 0;
                this.onXMLMinorError("unable to parse value for z plane; assuming 'z = 0'");
            }
        }

        let fromV = vec3.fromValues(from[0], from[1], from[2]);
        let toV = vec3.fromValues(to[0], to[1], to[2]);

        var perspective = new CGFcamera(angle, near, far, fromV, toV);
        this.log("Parsed perspective");

        return perspective;
    }

    /**
     * Parses the <ortho> block.
     * @param {ortho block element} orthoNode 
     * @return  ortho camera
     */
    parseOrtho(orthoNode){
        let near = this.reader.getFloat(orthoNode, 'near');
        if (!(near != null && !isNaN(near))) {
            near = 0.1;
            this.onXMLMinorError("unable to parse value for near plane; assuming 'near = 0.1'");
        }

        let far = this.reader.getFloat(orthoNode, 'far');
        if (!(far != null && !isNaN(far))) {
            far = 10;
            this.onXMLMinorError("unable to parse value for far plane; assuming 'far = 10'");
        }

        let left = this.reader.getFloat(orthoNode, 'left');
        if (!(left != null && !isNaN(left))) {
            left = 0;
            this.onXMLMinorError("unable to parse value for left plane; assuming 'left = 0'");
        }

        let right = this.reader.getFloat(orthoNode, 'right');
        if (!(right != null && !isNaN(right))) {
            right = 10;
            this.onXMLMinorError("unable to parse value for right plane; assuming 'right = 10'");
        }

        let top = this.reader.getFloat(orthoNode, 'top');
        if (!(top != null && !isNaN(top))) {
            top = 10;
            this.onXMLMinorError("unable to parse value for top plane; assuming 'top = 10'");
        }

        let bottom = this.reader.getFloat(orthoNode, 'bottom');
        if (!(bottom != null && !isNaN(bottom))) {
            bottom = 0;
            this.onXMLMinorError("unable to parse value for bottom plane; assuming 'bottom = 0'");
        }

        var children = orthoNode.children;
        var nodeNames = [];
        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        var indexFrom = nodeNames.indexOf("from");
        let from = [20,20,20];
        if (indexFrom == -1) {
            this.onXMLError("from planes missing; assuming 'x = 20' and 'y = 20' and 'z = 20'");
        }
        else {
            from[0] = this.reader.getFloat(children[indexFrom], 'x');
            from[1] = this.reader.getFloat(children[indexFrom], 'y');
            from[2] = this.reader.getFloat(children[indexFrom], 'z');

            if (!(from[0] != null && !isNaN(from[0]))) {
                from[0] = 20;
                this.onXMLMinorError("unable to parse value for x plane; assuming 'x = 20'");
            }

            if (!(from[1] != null && !isNaN(from[1]))) {
                from[1] = 20;
                this.onXMLMinorError("unable to parse value for y plane; assuming 'y = 20'");
            }

            if (!(from[2] != null && !isNaN(from[2]))) {
                from[2] = 20;
                this.onXMLMinorError("unable to parse value for z plane; assuming 'z = 20'");
            }
        }
        
        var indexTo = nodeNames.indexOf("to");
        let to = [0,0,0];
        if (indexTo == -1) {
            this.onXMLError("to planes missing; assuming 'x = 0' and 'y = 0' and 'z = 0'");
        }
        else {
            to[0] = this.reader.getFloat(children[indexTo], 'x');
            to[1] = this.reader.getFloat(children[indexTo], 'y');
            to[2] = this.reader.getFloat(children[indexTo], 'z');

            if (!(to[0] != null && !isNaN(to[0]))) {
                to[0] = 0;
                this.onXMLMinorError("unable to parse value for x plane; assuming 'x = 0'");
            }

            if (!(to[1] != null && !isNaN(to[1]))) {
                to[1] = 0;
                this.onXMLMinorError("unable to parse value for y plane; assuming 'y = 0'");
            }

            if (!(to[2] != null && !isNaN(to[2]))) {
                to[2] = 0;
                this.onXMLMinorError("unable to parse value for z plane; assuming 'z = 0'");
            }
        }

        let fromV = vec3.fromValues(from[0], from[1], from[2]);
        let toV = vec3.fromValues(to[0], to[1], to[2]);
        let vec = vec3.fromValues(0, 1, 0);

        var ortho = new CGFcameraOrtho(left, right, bottom, top, near, far, fromV, toV, vec);
        this.log("Parsed ortho");

        return ortho;
    }

    //implementar no parser das camaras a criacao da camara e parse do ortho

    /**
     * Parses the <views> block.
     * @param {views block element} viewsNode
     */
    parseViews(viewsNode) {
        var children = viewsNode.children;

        this.cameras = [];

        let def = this.reader.getString(viewsNode, 'default');
        if (def == null) {
            this.onXMLError("unable to parse default view");
        }

        for (var i = 0; i < children.length; i++){
            let id = this.reader.getString(children[i], 'id');
            if (id == null) {
                this.onXMLError("unable to parse value for view id");
            }

            for(var j = 0; j < this.cameras.length; j++){
                if(this.cameras[j].id == id)
                    this.onXMLError("repeated id");
            }

            var camera = new MyCamera();

            switch(children[i].nodeName){
                case "perspective":
                    camera.camera = this.parsePerspective(children[i]);
                    break;
                case "ortho":
                    camera.camera = this.parseOrtho(children[i]);
                    break;
            }

            camera.id = id;

            this.cameras.push(camera);
            if(id == def){
                this.scene.camera = camera.camera;
                this.scene.interface.setActiveCamera(camera.camera);
            }
        }

        this.log("Parsed views");

        return null;
    }

    parseTextures(texturesNode) {

        var children = texturesNode.children;
        this.textures = [];

        for (let i = 0; i < children.length; i++) {

            if (children[i].nodeName != "texture") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }
            this.textures.push(this.parseTexturesAux(children[i]));
        }

        this.log("Parsed textures");

        return null;
    }

    parseTexturesAux(texture) {

        var textureAux = new MyTexture();
        var textureId = this.reader.getString(texture, 'id');
        if (textureId == null) {
            return "no ID defined for texture";
        }

        if (this.textures[textureId] != null) { //does this work even? 
            return "ID must be unique for each texture (conflict: ID = " + textureId + ")";
        }

        textureAux.id = textureId;
        var textureFile = this.reader.getString(texture, 'file');
        if (textureFile == null) {
            return "no file defined for texture";
        }

        
        textureAux.file = "./scenes/images/" + textureFile;
        textureAux.cgf = new CGFtexture(this.scene, textureAux.file);
        return textureAux;  
        
    }

    parseMaterials(materialsNode) {

        var children = materialsNode.children;
        this.materials = [];

        for (let i = 0; i < children.length; i++) {

            if (children[i].nodeName != "material") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }
            this.materials.push(this.parseMaterialsAux(children[i]));
        }

        this.log("Parsed materials");

        return null;
    }

    parseMaterialsAux(material) {

        var materialAux = new MyMaterial();

        var specs = material.children;

        var materialId = this.reader.getString(material, 'id');
        if (materialId == null) {
            return "no ID defined for material";
        }

        if (this.materials[materialId] != null) {
            return "ID must be unique for each transformation (conflict: ID = " + materialId + ")";
        }

        materialAux.id = materialId;

        var materialShininess = this.reader.getString(material, 'shininess');
        if (materialShininess == null) {
            return "no shininess defined for material";
        }

        materialAux.shininess = materialShininess;

        for (var i = 0; i < specs.length; i++) {

            switch(specs[i].nodeName) {
                case "emission":
                    var emissionAux = [];
                    //r
                    var r = this.reader.getFloat(specs[i], 'r');
                    if (!(r != null && !isNaN(r))) {
                        return "unable to parse r value of the material emission for ID = " + materialId;
                    }
                    else {
                        emissionAux.push(r);
                    }
                    //g
                    var g = this.reader.getFloat(specs[i], 'g');
                    if (!(g != null && !isNaN(g))) {
                        return "unable to parse r value of the material emission for ID = " + materialId;
                    }
                    else {
                        emissionAux.push(g);
                    }
                    //b
                    var b = this.reader.getFloat(specs[i], 'b');
                    if (!(b != null && !isNaN(b))) {
                        return "unable to parse r value of the material emission for ID = " + materialId;
                    }
                    else {
                        emissionAux.push(b);
                    }
                    //a
                    var a = this.reader.getFloat(specs[i], 'a');
                    if (!(a != null && !isNaN(a))) {
                        return "unable to parse r value of the material emission for ID = " + materialId;
                    }
                    else {
                        emissionAux.push(a);
                    }

                    materialAux.emission = emissionAux;
                    break;
                case "ambient":
                    var ambientAux = [];
                    //r
                    var r = this.reader.getFloat(specs[i], 'r');
                    if (!(r != null && !isNaN(r))) {
                        return "unable to parse x-coordinate of the light position for ID = " + transformationId;
                    }
                    else {
                        ambientAux.push(r);
                    }
                    //g
                    var y = this.reader.getFloat(specs[i], 'g');
                    if (!(g != null && !isNaN(g))) {
                        return "unable to parse y-coordinate of the light position for ID = " + transformationId;
                    }
                    else {
                        ambientAux.push(g);
                    }
                    //b
                    var z = this.reader.getFloat(specs[i], 'b');
                    if (!(b != null && !isNaN(b))) {
                        return "unable to parse z-coordinate of the light position for ID = " + transformationId;
                    }
                    else {
                        ambientAux.push(b);
                    }
                    //a
                    var a = this.reader.getFloat(specs[i], 'a');
                    if (!(a != null && !isNaN(a))) {
                        return "unable to parse r value of the material emission for ID = " + materialId;
                    }
                    else {
                        ambientAux.push(a);
                    }

                    materialAux.ambient = ambientAux;
                    break;
                case "diffuse":
                    var diffuseAux = [];
                    //r
                    var r = this.reader.getFloat(specs[i], 'r');
                    if (!(r != null && !isNaN(r))) {
                        return "unable to parse x-coordinate of the light position for ID = " + transformationId;
                    }
                    else {
                        diffuseAux.push(r);
                    }
                    //g
                    var y = this.reader.getFloat(specs[i], 'g');
                    if (!(g != null && !isNaN(g))) {
                        return "unable to parse y-coordinate of the light position for ID = " + transformationId;
                    }
                    else {
                        diffuseAux.push(g);
                    }
                    //b
                    var z = this.reader.getFloat(specs[i], 'b');
                    if (!(b != null && !isNaN(b))) {
                        return "unable to parse z-coordinate of the light position for ID = " + transformationId;
                    }
                    else {
                        diffuseAux.push(b);
                    }
                    //a
                    var a = this.reader.getFloat(specs[i], 'a');
                    if (!(a != null && !isNaN(a))) {
                        return "unable to parse r value of the material emission for ID = " + materialId;
                    }
                    else {
                        diffuseAux.push(a);
                    }

                    materialAux.diffuse = diffuseAux;
                    break;
                case "specular":
                    var specularAux = [];
                    //r
                    var r = this.reader.getFloat(specs[i], 'r');
                    if (!(r != null && !isNaN(r))) {
                        return "unable to parse x-coordinate of the light position for ID = " + transformationId;
                    }
                    else {
                        specularAux.push(r);
                    }
                    //g
                    var y = this.reader.getFloat(specs[i], 'g');
                    if (!(g != null && !isNaN(g))) {
                        return "unable to parse y-coordinate of the light position for ID = " + transformationId;
                    }
                    else {
                        specularAux.push(g);
                    }
                    //b
                    var z = this.reader.getFloat(specs[i], 'b');
                    if (!(b != null && !isNaN(b))) {
                        return "unable to parse z-coordinate of the light position for ID = " + transformationId;
                    }
                    else {
                        specularAux.push(b);
                    }
                    //a
                    var a = this.reader.getFloat(specs[i], 'a');
                    if (!(a != null && !isNaN(a))) {
                        return "unable to parse r value of the material emission for ID = " + materialId;
                    }
                    else {
                        specularAux.push(a);
                    }

                    materialAux.specular = specularAux;
                    break;
            }

        }

        return materialAux;


    }

    parseTransformations(transformationNode) {

        var children = transformationNode.children;

        this.transformations = [];

        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "transformation") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            var transformation = new MyTransformation();
            transformation = this.parseTransformationAux(children[i]);
            this.transformations.push(transformation);

        }

        this.log("Parsed transformations");

        return null;
    }

    parseTransformationAux(transformation) {

        var transformationAux = new MyTransformation();

        var specs = transformation.children;

        var transformationId = this.reader.getString(transformation, 'id');
        if (transformationId == null) {
            return "no ID defined for transformation";
        }

        if (this.transformations[transformationId] != null) {
            return "ID must be unique for each transformation (conflict: ID = " + transformationId + ")";
        }

        transformationAux.id = transformationId;

        for (var i = 0; i < specs.length; i++) {

            switch(specs[i].nodeName) {
                case "scale":
                    var scaleAux = new MyTransformationElement();
                    scaleAux.type = "scale";
                    //x
                    var x = this.reader.getFloat(specs[i], 'x');
                    if (!(x != null && !isNaN(x))) {
                        return "unable to parse x-coordinate of the light position for ID = " + transformationId;
                    }
                    else {
                        scaleAux.content.push(x);
                    }
                    //y
                    var y = this.reader.getFloat(specs[i], 'y');
                    if (!(y != null && !isNaN(y))) {
                        return "unable to parse y-coordinate of the light position for ID = " + transformationId;
                    }
                    else {
                        scaleAux.content.push(y);
                    }
                    //z
                    var z = this.reader.getFloat(specs[i], 'z');
                    if (!(z != null && !isNaN(z))) {
                        return "unable to parse z-coordinate of the light position for ID = " + transformationId;
                    }
                    else {
                        scaleAux.content.push(z);
                    }

                    transformationAux.transformations.push(scaleAux);
                    break;
                case "translate":
                    var translateAux = new MyTransformationElement();
                    translateAux.type = "translate";
                    //x
                    var x = this.reader.getFloat(specs[i], 'x');
                    if (!(x != null && !isNaN(x))) {
                        return "unable to parse x-coordinate of the light position for ID = " + transformationId;
                    }
                    else {
                        translateAux.content.push(x);
                    }
                    //y
                    var y = this.reader.getFloat(specs[i], 'y');
                    if (!(y != null && !isNaN(y))) {
                        return "unable to parse y-coordinate of the light position for ID = " + transformationId;
                    }
                    else {
                        translateAux.content.push(y);
                    }
                    //z
                    var z = this.reader.getFloat(specs[i], 'z');
                    if (!(z != null && !isNaN(z))) {
                        return "unable to parse z-coordinate of the light position for ID = " + transformationId;
                    }
                    else {
                        translateAux.content.push(z);
                    }

                    transformationAux.transformations.push(translateAux);
                    break;
                case "rotate":
                    var rotateAux = new MyTransformationElement();
                    rotateAux.type = "rotate";
                    //axis
                    var axis = this.reader.getString(specs[i], 'axis');
                    if (!(axis != null)) {
                        return "unable to parse x-coordinate of the light position for ID = " + transformationId;
                    }
                    else {
                        rotateAux.content.push(axis);
                    }
                    //angle
                    var angle = this.reader.getFloat(specs[i], 'angle');
                    if (!(angle != null && !isNaN(angle))) {
                        return "unable to parse y-coordinate of the light position for ID = " + transformationId;
                    }
                    else {
                        rotateAux.content.push(angle);
                    }

                    transformationAux.transformations.push(rotateAux);
                    break;
            }

        }

        return transformationAux;

    }

    parseComponents(componentsNode) {

        var children = componentsNode.children;

        var grandChildren = [];
        var nodeNames = [];

        this.components = [];
        var numComponents = 0;

        var transformations= [];
        var materials = [];
        var childrenComponent = [];

        //there should be at least one component
        for (var i = 0; i < children.length; i++) {

            let component = new MyComponent();
            let textureAux = new MyTextureComponent();
            
            if (children[i].nodeName != "component") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            //get id of current component
            var componentId = this.reader.getString(children[i], 'id');
            if (componentId == null) {
                return "no ID defined for component";
            }
            
            //check for repeated IDs
            if (this.components[componentId] != null) {
                return "ID must be unique for each component (conflict: ID = " + componentId + ")";
            }

            component.id = componentId;

            grandChildren = children[i].children;

            //specifications for the current component

            //TODO need validity checks in all the ids!! 

            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            //get indices of each element
            var transformationIndex = nodeNames.indexOf("transformation");
            var materialsIndex = nodeNames.indexOf("materials");
            var textureIndex = nodeNames.indexOf("texture");
            var childrenIndex = nodeNames.indexOf("children");

            //transformation(s ?) to be applied (only working with transformation references, not explicit transformation declarations)
            if (transformationIndex == -1) {
                this.onXMLMinorError("transformation reference value missing for ID = " + componentId + "; assuming 'value = 1'");
            } else {
                let transformationAux = grandChildren[transformationIndex].children;
                transformations = this.parseComponentTransformations(transformationAux);
            }

            //materials
            if (materialsIndex == -1) {
                this.onXMLMinorError("material reference value missing for ID = " + componentId + "; assuming 'value = 1'");
            } else {
                let materialsAux = grandChildren[materialsIndex].children;
                materials = this.parseComponentMaterials(materialsAux);
            }

            //texture
            if (textureIndex == -1) {
                this.onXMLMinorError("texture value missing for ID = " + componentId);
            } else {
                textureAux.id = this.reader.getString(grandChildren[textureIndex], 'id');
                
                textureAux.lengthS = this.reader.getFloat(grandChildren[textureIndex], 'length_s');
                textureAux.lengthT = this.reader.getFloat(grandChildren[textureIndex], 'length_t');
            }

            //children
            if (childrenIndex == -1) {
                this.onXMLMinorError("children value missing for ID = " + componentId);
            } else {
                var childrenAux = grandChildren[childrenIndex].children;
                var childrenTmp = this.parseComponentChildren(childrenAux);
            } 

            component.transformation = transformations;
            component.materials = materials;
            component.texture = textureAux;
            component.children = childrenTmp;
        
            this.components.push(component);
            numComponents++;

        }

        return null;
    }

    parseComponentTransformations(transformations) {

        let transformationsAux = [];

        for (var i = 0; i < transformations.length; i++) {

            let refAux = [];
            refAux.push("ref");
            let translateAux = [];
            translateAux.push("translate");
            let scaleAux = [];
            scaleAux.push("scale");
            let rotateAux = [];
            rotateAux.push("rotate");
           
            

            switch(transformations[i].nodeName) {

                case "transformationref":
                    refAux.push(this.reader.getString(transformations[i], 'id'));
                    transformationsAux.push(refAux);
                break;
                case "scale":
                    //x
                    var x = this.reader.getFloat(transformations[i], 'x');
                    if (!(x != null && !isNaN(x))) {
                        return "unable to parse x-coordinate of the light position for ID = " + transformationId;
                    }
                    else {
                        scaleAux.push(x);
                    }
                    //y
                    var y = this.reader.getFloat(transformations[i], 'y');
                    if (!(y != null && !isNaN(y))) {
                        return "unable to parse y-coordinate of the light position for ID = " + transformationId;
                    }
                    else {
                        scaleAux.push(y);
                    }
                    //z
                    var z = this.reader.getFloat(transformations[i], 'z');
                    if (!(z != null && !isNaN(z))) {
                        return "unable to parse z-coordinate of the light position for ID = " + transformationId;
                    }
                    else {
                        scaleAux.push(z);
                    }
                    transformationsAux.push(scaleAux);
                    break;
                 case "translate":
                    //x
                    var x = this.reader.getFloat(transformations[i], 'x');
                    if (!(x != null && !isNaN(x))) {
                        return "unable to parse x-coordinate of the light position for ID = " + transformationId;
                    }
                    else {
                        translateAux.push(x);
                    }
                    //y
                    var y = this.reader.getFloat(transformations[i], 'y');
                    if (!(y != null && !isNaN(y))) {
                        return "unable to parse y-coordinate of the light position for ID = " + transformationId;
                    }
                    else {
                        translateAux.push(y);
                    }
                    //z
                    var z = this.reader.getFloat(transformations[i], 'z');
                    if (!(z != null && !isNaN(z))) {
                        return "unable to parse z-coordinate of the light position for ID = " + transformationId;
                    }
                    else {
                        translateAux.push(z);
                    }

                    transformationsAux.push(translateAux);
                    break;
                 case "rotate":
                    //axis
                    var axis = this.reader.getString(transformations[i], 'axis');
                    if (!(axis != null)) {
                        return "unable to parse x-coordinate of the light position for ID = " + transformationId;
                    }
                    else {
                        rotateAux.push(axis);
                    }
                    //angle
                    var angle = this.reader.getFloat(transformations[i], 'angle');
                    if (!(angle != null && !isNaN(angle))) {
                        return "unable to parse y-coordinate of the light position for ID = " + transformationId;
                    }
                    else {
                        rotateAux.push(angle);
                    }

                    transformationsAux.push(rotateAux);
                    break;
            }

        }

        return transformationsAux;
    }

    parseComponentMaterials(materials) {

        let materialsAux = [];

        for (var i = 0; i < materials.length; i++) {
            if (materials[i].nodeName == "material") {
                materialsAux.push(this.reader.getString(materials[i], 'id'));
            }
        }

        return materialsAux;

    }

    parseComponentChildren(children) {
        
        let childrenAux = [];

        let child = new MyComponentChildren();

        for (var i = 0; i < children.length; i++) {
            if (children[i].nodeName == "primitiveref" || children[i].nodeName == "componentref") {
                child.ref = children[i].nodeName;
                child.id = this.reader.getString(children[i], 'id');
                childrenAux.push(child);
            }
            child = new MyComponentChildren();
        }

        return childrenAux;

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
    onXMLMinorError(message) {
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
        for (var i = 0; i < this.primitives.length; i++) {
            this.processRoot();
        }
        return null;
    }

    processRoot() {

        for (let i = 0; i < this.components.length; i++) {
            if (this.components[i].id == this.root) {
                this.processComponents(this.components[i]);
                break;
            }
        }

    }

    processComponents(component) {

        for (let i = 0; i < component.children.length; i++) {

            if (component.materials[0] != "inherit") {
                this.applyAppearance(component.materials[0], component.texture.id);
            }

            switch(component.children[i].ref) {
                case "primitiveref":
                this.scene.pushMatrix();
                    this.applyTransformation(component);
                    this.displayPrimitive(component.children[i].id);
                this.scene.popMatrix();
                break;
                case "componentref":
                for (let j = 0; j < this.components.length; j++) {
                    if (this.components[j].id == component.children[i].id) {
                        this.scene.pushMatrix();
                            this.applyTransformation(component);
                            this.processComponents(this.components[j]);
                        this.scene.popMatrix();
                    }
                }
                break;
            }

        }

    }

    applyAppearance(materialId, textureId) {

        var appearance = new CGFappearance(this.scene);

        if (textureId != "inherit" && textureId != "none") {
            for (let j = 0; j < this.textures.length; j++) {
                if (textureId == this.textures[j].id) {
                    
                    appearance.setTexture(this.textures[j].cgf);
                    break;
                }
            }
        }

        for (let i = 0; i < this.materials.length; i++) {
            if (materialId == this.materials[i].id) {
                appearance.setDiffuse(this.materials[i].diffuse[0], this.materials[i].diffuse[1], this.materials[i].diffuse[2])
                appearance.setSpecular(this.materials[i].specular[0], this.materials[i].specular[1], this.materials[i].specular[2])
                appearance.setAmbient(this.materials[i].ambient[0], this.materials[i].ambient[1], this.materials[i].ambient[2])
                appearance.setShininess(this.materials[i].shininess);
                appearance.apply();
            }
        }

    }

    displayPrimitive(primitiveid) {
        for (let i = 0; i < this.primitives.length; i++) {
            if (this.primitives[i].id == primitiveid) {
                this.primitives[i].child.display();
            }
        }
    }

    applyTransformation(component) {

        for (let i = 0; i < component.transformation.length; i++) {
            this.applyTransformationAux(component.transformation[i]);
        }
    }

    applyTransformationAux(transformation) {

        switch(transformation[0]) {
            case "ref":
                for (let i = 0; i < this.transformations.length; i++) {
                    if (this.transformations[i].id == transformation[1]) {
                        this.processTransformation(this.transformations[i]);
                    }
                }
            break;
            case "translate":
                this.scene.translate(transformation[1],transformation[2],transformation[3]);
            break;
            case "scale":
                this.scene.scale(transformation[1],transformation[2],transformation[3]);
            break;
            case "rotate":
               
                switch(transformation[1]) {
                    case "x":
                    this.scene.rotate(transformation[2]*DEGREE_TO_RAD, 1, 0, 0);
                    break;
                    case "y":
                    this.scene.rotate(transformation[2]*DEGREE_TO_RAD, 0, 1, 0);
                    break;
                    case "z":
                    this.scene.rotate(transformation[2]*DEGREE_TO_RAD, 0, 0, 1);
                    break;
                }
            break;
        }

    }

    processTransformation(transformation) {

        for (let i = 0; i < transformation.transformations.length; i++) {
            switch(transformation.transformations[i].type) {
                case "translate":
                    this.scene.translate(transformation.transformations[i].content[0],transformation.transformations[i].content[1],transformation.transformations[i].content[2]);
                    break;
                case "scale":
                    this.scene.scale(transformation.transformations[i].content[0],transformation.transformations[i].content[1],transformation.transformations[i].content[2]);
                    break;
                case "rotate":
                        //console.log(transformation.transformations[i].content[1]);
                    switch(transformation.transformations[i].content[0]) {
                        case "x":
                        this.scene.rotate(transformation.transformations[i].content[1]*DEGREE_TO_RAD, 1, 0, 0);
                        break;
                        case "y":
                        this.scene.rotate(transformation.transformations[i].content[1]*DEGREE_TO_RAD, 0, 1, 0);
                        break;
                        case "z":
                        this.scene.rotate(transformation.transformations[i].content[1]*DEGREE_TO_RAD, 0, 0, 1);
                        break;
                    }
                    break;
            }
        }
    }

}