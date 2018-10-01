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
            this.onXMLMinorError("ambient planes missing; assuming 'r = 0' and 'g = 0' and 'b = 0' and 'a = 1'");
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
            if (!(this.ambient[1] != null && !isNaN(this.ambient[1]))) {
                this.ambient[1] = 0;
                this.onXMLMinorError("unable to parse value for g plane; assuming 'g = 0'");
            }
            if (!(this.ambient[2] != null && !isNaN(this.ambient[2]))) {
                this.ambient[2] = 0;
                this.onXMLMinorError("unable to parse value for b plane; assuming 'b = 0'");
            }
            if (!(this.ambient[3] != null && !isNaN(this.ambient[3]))) {
                this.ambient[3] = 1;
                this.onXMLMinorError("unable to parse value for a plane; assuming 'a = 1'");
            }
        }

        var indexBackground = nodeNames.indexOf("background");
        this.background = [0, 0, 0, 1];
        if (indexBackground == -1) {
            this.onXMLMinorError("background planes missing; assuming 'r = 0' and 'g = 0' and 'b = 0' and 'a = 1'");
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
            if (!(this.background[1] != null && !isNaN(this.background[1]))) {
                this.background[1] = 0;
                this.onXMLMinorError("unable to parse value for g plane; assuming 'g = 2'");
            }
            if (!(this.background[2] != null && !isNaN(this.background[2]))) {
                this.background[2] = 0;
                this.onXMLMinorError("unable to parse value for b plane; assuming 'b = 2'");
            }
            if (!(this.background[3] != null && !isNaN(this.background[3]))) {
                this.background[3] = 1;
                this.onXMLMinorError("unable to parse value for a plane; assuming 'a = 1'");
            }
        }     

        this.log("Parsed ambient");
        return null;
    }

    parseLights(lightsNode) {

        /*
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
                
                let lightAux = children[i].children;
                let omniLight =  new MyOmniLight();

                omniLight = this.parseOmniLight(lightAux);

                var aux = this.reader.getFloat(children[i], 'enabled');
                if (!(aux != null && !isNaN(aux) && (aux == 0 || aux == 1))) {
                    this.onXMLMinorError("unable to parse value component of the 'enable light' field for ID = " + lightId + "; assuming 'value = 1'")
                }

            }

            //Get id of the current light
            var lightId = this.reader.getString(children[i], 'id');
            if (lightId == null) {
                return "no ID defined for light";
            }

            //Check for repeated IDs
            if (this.lights[lightId] != null) {
                return "ID must be unique for each light (conflict: ID = " + lightId + ")";
            }

            //Specs for current light
            grandChildren = children[i].children;

            nodeNames = [];
            for (var j = 0; j < grandChildren.lenght; j++) {
                nodeNames.push(grandChildren[j].nodeName);
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
                var x = this.reader.getFloat(grandChildren[positionIndex], 'x');
                if (!(x != null && !isNaN(x))) {
                    return "unable to parse x-coordinate of the light position for ID = " + lightId;
                }
                else {
                    positionLight.push(x);
                }
                //y
                var y = this.reader.getFloat(grandChildren[positionIndex], 'y');
                if (!(y != null && !isNaN(y))) {
                    return "unable to parse y-coordinate of the light position for ID = " + lightId;
                }
                else {
                    positionLight.push(y);
                }
                //z
                var z = this.reader.getFloat(grandChildren[positionIndex], 'z');
                if (!(z != null && !isNaN(z))) {
                    return "unable to parse z-coordinate of the light position for ID = " + lightId;
                }
                else {
                    positionLight.push(z);
                }
                //w
                var w = this.reader.getFloat(grandChildren[positionIndex], 'w');
                if (!(w != null && !isNaN(w))) {
                    return "unable to parse w-coordinate of the light position for ID = " + lightId;
                }
                else {
                    positionLight.push(w);
                }
            }

        }

        this.log("Parsed lights");

        return null;
        */

    }

    parseOmniLight(omni) {
        /*
        let omniAux = new MyOmniLight();

        let aux = this.reader.getFloat(omni, 'enabled');
        if (!(aux != null && !isNaN(aux) && (aux == 0 || aux == 1))) {
            this.onXMLMinorError("unable to parse value component of the 'enable light' field for ID = " + lightId + "; assuming 'value = 1'")
        }

        let lightId = this.reader.getString(omni, 'id');
        if (lightId == null) {
            return "no ID defined for light";
        }

        if (this.lights[lightId] != null) {
            return "ID must be unique for each light (conflict: ID = " + lightId + ")";
        }

        let specs = omni.children;

        let nodeNames = [];
        for (var i = 0; i < specs.length; i++) {
            nodeNames.push(grandChildren[i].nodeName);
        }
            //Get indices of each element
            let locationIndex = nodeNames.indexOf("location");
            let ambientIndex = nodeNames.indexOf("ambient");
            let diffuseIndex = nodeNames.indexOf("diffuse");
            let specularIndex = nodeNames.indexOf("specular");
            let targetIndex = nodeNames.indexOf("target");

            //Light location
            var lightLocation = [];
            if (locationIndex != -1) {
                //x
                let x = this.reader.getFloat(specs[positionIndex], 'x');
                if (!(x != null && !isNaN(x))) {
                    return "unable to parse x-coordinate of the light position for ID = " + lightId;
                }
                else {
                    positionLight.push(x);
                }
                //y
                var y = this.reader.getFloat(specs[positionIndex], 'y');
                if (!(y != null && !isNaN(y))) {
                    return "unable to parse y-coordinate of the light position for ID = " + lightId;
                }
                else {
                    positionLight.push(y);
                }
                //z
                var z = this.reader.getFloat(specs[positionIndex], 'z');
                if (!(z != null && !isNaN(z))) {
                    return "unable to parse z-coordinate of the light position for ID = " + lightId;
                }
                else {
                    positionLight.push(z);
                }
                //w
                var w = this.reader.getFloat(specs[positionIndex], 'w');
                if (!(w != null && !isNaN(w))) {
                    return "unable to parse w-coordinate of the light position for ID = " + lightId;
                }
                else {
                    positionLight.push(w);
                }
            }
        

        return omniAux;

        */

    }

    parseSpotLight(spot) {

    }

    /**
     * Parses the <primitives> block.
     * @param {primitives block element} primitivesNode
     */
    parsePrimitives(primitivesNode) {
        var children = primitivesNode.children;
        var nodeNames = [];
        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName); 
        


        this.log("Parsed primitives");

        return null;
    }

    parseViews(viewsNode) {

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