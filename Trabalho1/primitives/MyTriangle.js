class MyTriangle extends CGFobject{
    constructor(scene, x1, x2, x3, y1, y2, y3, z1, z2 , z3) {
        super(scene);
        this.x1 = x1;
        this.x2 = x2;
        this.x3 = x3;
        this.y1 = y1;
        this.y2 = y2;
        this.y3 = y3;
        this.z1 = z1;
        this.z2 = z2;
        this.z3 = z3;

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

        this.p1 = vec3.fromValues(this.x1, this.y1, this.z1);
        this.p2 = vec3.fromValues(this.x2, this.y2, this.z2);
        this.p3 = vec3.fromValues(this.x3, this.y3, this.z3);

        this.v12 = vec3.create();
        this.v12 = [
            this.p2[0]-this.p1[0],
            this.p2[1]-this.p1[1],
            this.p2[2]-this.p1[2]
        ];

        this.v23 = [
            this.p3[0]-this.p2[0],
            this.p3[1]-this.p2[1],
            this.p3[2]-this.p2[2]
        ];

        this.n = vec3.create();
        this.n = vec3.cross(this.n, this.v12, this.v23);
        this.n = vec3.normalize(this.n, this.n);

        this.normals = [
            this.n[0], this.n[1], this.n[2], 
            this.n[0], this.n[1], this.n[2],
            this.n[0], this.n[1], this.n[2]
        ];

        this.distA = Math.sqrt(Math.pow(this.x3-this.x1, 2)+Math.pow(this.y3-this.y1, 2)+Math.pow(this.z3-this.z1, 2));
        this.distB = Math.sqrt(Math.pow(this.x2-this.x1, 2)+Math.pow(this.y2-this.y1, 2)+Math.pow(this.z2-this.z1, 2));
        this.distC = Math.sqrt(Math.pow(this.x3-this.x2, 2)+Math.pow(this.y3-this.y2, 2)+Math.pow(this.z3-this.z2, 2));

        this.cosAlpha = (-Math.pow(this.distA, 2) + Math.pow(this.distB, 2) + Math.pow(this.distC, 2))/(2*this.distB*this.distC);
        this.cosGama = (Math.pow(this.distA, 2) + Math.pow(this.distB, 2) - Math.pow(this.distC, 2))/(2*this.distA*this.distB);
        this.cosBeta = (-Math.pow(this.distA, 2) - Math.pow(this.distB, 2) + Math.pow(this.distC, 2))/(2*this.distA*this.distC);

        this.beta = Math.acos(this.cosBeta);

        this.p0Text = [this.distC - this.distA * this.cosBeta, this.maxT - this.distA * Math.sin(this.beta)];
        this.p1Text = [this.minS, this.maxT];
        this.p2Text = [this.distC, this.maxT];

        this.texCoords = [
            this.p0Text[0], this.p0Text[1],
            this.p1Text[0], this.p1Text[1],
            this.p2Text[0], this.p2Text[1]
        ];

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    };
}