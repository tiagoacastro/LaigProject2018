class MyTriangle extends CGFobject{
    constructor(scene, x1, x2, x3, y1, y2, y3, z1, z2 , z3) {
        super(scene);
        this.x1 = x1 || 0;
        this.x2 = x2 || 1;
        this.x3 = x3 || 0;
        this.y1 = y1 || 0;
        this.y2 = y2 || 0;
        this.y3 = y3 || 1;
        this.z1 = z1 || 0;
        this.z2 = z2 || 0;
        this.z3 = z3 || 0;

        //temp values

        this.minS = 0;
        this.minT = 0;
        this.maxS = 1;
        this.maxT = 1;
        
        this.initBuffers();
    }

    initBuffers()
    {
        this.vertices = [
            this.x1, this.y1, this.z1,
            this.x2, this.y2, this.z2,
            this.x3, this.y3, this.z3,
        ];

        this.indices = [
            0, 1, 2,
        ];

        this.normals = [
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
        ];

        this.texCoords = [
            this.minS,this.maxT,
            this.maxS,this.maxT,
            this.minS,this.minT,
            this.maxS,this.minT
        ];

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    };
}