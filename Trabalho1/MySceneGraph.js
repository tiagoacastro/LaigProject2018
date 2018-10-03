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
            console.log(nodes[i].nodeName);
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

        console.log(this);
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

        var nodeNames = [];

        //Should have at least one light (omni or spot)
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "omni" && children[i].nodeName != "spot") {
                this.onXMLMinorError("unknown tag <" + children.nodeName + ">");
                continue;
            }

            //omni
            if (children[i].nodeName == "omni") {
                
                var lightAux = children[i].children;
                var omniLight =  new MyOmniLight();

                omniLight = this.parseOmniLight(children[i]);

                var aux = this.reader.getFloat(children[i], 'enabled');
                if (!(aux != null && !isNaN(aux) && (aux == 0 || aux == 1))) {
                    this.onXMLMinorError("unable to parse value component of the 'enable light' field for ID = " + lightId + "; assuming 'value = 1'")
                }

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
        var targetIndex = nodeNames.indexOf("target");

        //Light location
        var lightLocation = [];
        if (locationIndex != -1) {
            //x
            let x = this.reader.getFloat(specs[locationIndex], 'x');
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
        }
        
        return omniAux;

    }

    parseSpotLight(spot) {

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
        var rectangle = null;

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

        //criar triangulo
        var triangle = null;

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
        var cylinder = null;

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
        var sphere = null;

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
        if(inner <= 0) {
            inner = 1;
            this.onXMLMinorError("inner can't be equal or lower than 0, assuming 'inner = 1'");
        }

        let outer = this.reader.getFloat(torusNode, 'outer');
        if (!(outer != null && !isNaN(outer))) {
            outer = 2;
            this.onXMLMinorError("unable to parse value for outer plane; assuming 'outer = 2'");
        }
        if(outer <= 0) {
            outer = 2;
            this.onXMLMinorError("outer can't be equal or lower than 0, assuming 'outer = 2'");
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
        var torus = null;

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
        var perspective = null;

        this.log("Parsed perspective");

        return perspective;
    }

    /**
     * Parses the <ortho> block.
     * @param {ortho block element} orthoNode 
     * @return  ortho camera
     */
    parseOrtho(orthoNode){
        var ortho = null;
        
        this.log("Parsed ortho");

        return ortho;
    }

    //implementar no parser das camaras a criacao da camara

    /**
     * Parses the <views> block.
     * @param {views block element} viewsNode
     */
    parseViews(viewsNode) {
        var children = viewsNode.children;

        this.cameras = [];

        this.default = this.reader.getString(viewsNode, 'default');
        if (this.default == null) {
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

            switch(children[i].nodeName){
                case "perspective":
                    var perspective = this.parsePerspective(children[i]);

                    this.cameras.push(perspective);
                    break;
                case "ortho":
                    var ortho = this.parseOrtho(children[i]);

                    this.cameras.push(ortho);
                    break;
            }
        }

        this.log("Parsed views");

        return null;
    }

    parseTextures(texturesNode) {

        this.log("Parsed textures");

        return null;
    }

    parseMaterials(materialsNode) {

        this.log("Parsed materials");

        return null;
    }

    parseTransformations(transformationsNode) {

        this.log("Parsed transformations");

        return null;
    }

    parseComponents(componentsNode) {

        var children = componentsNode.children;

        var grandChildren = [];
        var nodeNames = [];

        this.components = [];
        var numComponents = 0;

        var transformations= [];
        var materials = [];
        var texture = {
            id: "",
            lengthS: 1,
            lengthT: 1
        };
        var childrenComponent = [];

        //there should be at least one component
        for (var i = 0; i < children.length; i++) {

            let component = new MyComponent();
            
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
                texture.id = this.reader.getString(grandChildren[textureIndex], 'id');
                texture.lengthS = this.reader.getFloat(grandChildren[textureIndex], 'length_s');
                texture.lengthT = this.reader.getFloat(grandChildren[textureIndex], 'length_t');
            }

            //children
            if (childrenIndex == -1) {
                this.onXMLMinorError("children value missing for ID = " + componentId);
            } else {
                var childrenAux = grandChildren[childrenIndex].children;
                children = this.parseComponentChildren(childrenAux);
            } 

            component.transformation = transformations;
            component.materials = materials;
            component.texture = texture.id;
            component.textureLengthS = texture.lengthS;
            component.textureLengthT = texture.lengthT;
            component.children = childrenComponent;
            this.components.push(component);
            numComponents++;

        }

        return null;
    }

    parseComponentTransformations(transformations) {

        let transformationsAux = [];

        for (var i = 0; i < transformations.length; i++) {
            if (transformations[i].nodeName == "transformationref") {
                transformationsAux.push(this.reader.getString(transformations[i], 'id'));
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

        for (var i = 0; i < children.length; i++) {
            if (children[i].nodeName == "material") {
                childrenAux.push(this.reader.getString(children[i], 'id'));
            }
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
        // entry point for graph rendering
        //TODO: Render loop starting at root of graph
        return null;
    }
}