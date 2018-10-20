/**
 * Sphere class
 */
class MySphere extends CGFobject {
    /**
     * Constructor
     * @param {XMLscene} scene 
     * @param {float} radius 
     * @param {int} slices 
     * @param {int} stacks 
     */
    constructor(scene, radius, slices, stacks){
        super(scene);

        this.slices = slices;
        this.stacks = stacks;
        this.radius = radius;
    
        this.initBuffers();
    }
    /**
     * Function where the vertexes, indexes, normals and texcoords are defined
     */
    initBuffers()
    {
        this.vertices = [];
        this.normals = [];
        this.indices = [];
        this.texCoordsAux = [];
    
        var theta = (2 * Math.PI) / this.slices;
        var phi = (Math.PI) / this.stacks;
        var n = 0;
    
        var patchX = 1 / this.slices;
        var patchY = 1 / this.stacks;
        var xCoord = 0;
        var yCoord = 0;
    
    
        for (var i = 0; i <= this.slices; i++) {
            for (var j = 0; j <= this.stacks; j++) {
                let x = Math.cos(theta * i) * Math.sin(phi * j);
                let y = Math.sin(theta * i) * Math.sin(phi * j);
                let z = Math.cos(phi * j);
    
                this.vertices.push(this.radius * x, this.radius * y, this.radius * z);
                n++;
    
                this.normals.push(x, y, z);
    
                if (i > 0 && j > 0) {
                    this.indices.push(n - this.stacks - 1, n - 1, n - this.stacks - 2);
                    this.indices.push(n - 1, n - 2, n - this.stacks - 2);
                }
    
                yCoord += patchY;

                this.texCoordsAux.push(xCoord, yCoord);
            }
    
            yCoord = 0;
            xCoord += patchX;
        }
    
        this.texCoords = this.texCoordsAux.slice();
        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    };
};