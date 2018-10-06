class MySphere extends CGFobject {
    
    constructor(scene, radius, slices, stacks){
        super(scene);

        this.slices = slices;
        this.stacks = stacks;
        this.radius = radius;
    
        this.initBuffers();
    }

    initBuffers()
    {
        this.vertices = [];
        this.normals = [];
        this.indices = [];
        this.originalTexCoords = [];
    
        var theta = (2 * Math.PI) / this.slices;
        var phi = (Math.PI) / this.stacks;
        var n_verts = 0;
    
        var patchLengthx = 1 / this.slices;
        var patchLengthy = 1 / this.stacks;
        var xCoord = 0;
        var yCoord = 0;
    
    
        for (var i = 0; i <= this.slices; i++) {
            for (var j = 0; j <= this.stacks; j++) {
    
                let x = Math.cos(theta * i) * Math.sin(phi * j);
                let y = Math.sin(theta * i) * Math.sin(phi * j);
                let z = Math.cos(phi * j);
    
                this.vertices.push(this.radius * x, this.radius * y, this.radius * z);
                n_verts++;
    
                this.normals.push(x, y, z);
    
                if (i > 0 && j > 0) {
                    this.indices.push(n_verts - this.stacks - 1, n_verts - 1, n_verts - this.stacks - 2);
                    this.indices.push(n_verts - 1, n_verts - 2, n_verts - this.stacks - 2);
                }
    
    
                    yCoord += patchLengthy;

                this.originalTexCoords.push(  xCoord,yCoord);
            }
    
            yCoord = 0;
            xCoord += patchLengthx;
    
        }
    
        this.texCoords = this.originalTexCoords.slice();
        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    };
};