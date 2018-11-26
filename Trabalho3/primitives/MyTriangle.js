/**
 * Triangle class
 */
class MyTriangle extends CGFobject{
    /**
     * @constructor with the 3 points belonging to the triangle
     * @param {XMLscene} scene 
     * @param {float} x1 
     * @param {float} x2 
     * @param {float} x3 
     * @param {float} y1 
     * @param {float} y2 
     * @param {float} y3 
     * @param {float} z1 
     * @param {float} z2 
     * @param {float} z3 
     */
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

        this.minS = 0;
        this.minT = 0;
        this.maxS = 1;
        this.maxT = 1;
        
        this.initBuffers();
    }
    /**
     * Function where the vertexes, indexes, normals and texcoords are defined
     */
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

        this.p0 = vec3.fromValues(this.x1, this.y1, this.z1);
        this.p1 = vec3.fromValues(this.x2, this.y2, this.z2);
        this.p2 = vec3.fromValues(this.x3, this.y3, this.z3);

        this.v01 = vec3.create();
        this.v01 = [
            this.p1[0]-this.p0[0],
            this.p1[1]-this.p0[1],
            this.p1[2]-this.p0[2]
        ];

        this.v12 = [
            this.p2[0]-this.p1[0],
            this.p2[1]-this.p1[1],
            this.p2[2]-this.p1[2]
        ];

        this.n = vec3.create();
        this.n = vec3.cross(this.n, this.v01, this.v12);
        this.n = vec3.normalize(this.n, this.n);

        this.normals = [
            this.n[0], this.n[1], this.n[2], 
            this.n[0], this.n[1], this.n[2],
            this.n[0], this.n[1], this.n[2]
        ];

        this.d02 = Math.sqrt(Math.pow(this.x3-this.x1, 2)+Math.pow(this.y3-this.y1, 2)+Math.pow(this.z3-this.z1, 2));
        this.d01 = Math.sqrt(Math.pow(this.x2-this.x1, 2)+Math.pow(this.y2-this.y1, 2)+Math.pow(this.z2-this.z1, 2));
        this.d12 = Math.sqrt(Math.pow(this.x3-this.x2, 2)+Math.pow(this.y3-this.y2, 2)+Math.pow(this.z3-this.z2, 2));

        this.cosBeta = (-Math.pow(this.d12, 2) - Math.pow(this.d02, 2) + Math.pow(this.d02, 2))/(2*this.d12*this.d01);

        this.beta = Math.acos(this.cosBeta);

        this.p0Text = [this.d01 - this.d12 * this.cosBeta, this.maxT - this.d12 * Math.sin(this.beta)];
        this.p1Text = [this.minS, this.maxT];
        this.p2Text = [this.maxS, this.maxT];

        this.texCoords = [
            this.p1Text[0], this.p1Text[1],
            this.p2Text[0], this.p2Text[1],
            this.p0Text[0], this.p0Text[1]
        ];

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    };
    /**
     * TexCoords update for the lengthS and lengthT use
     * @param {float} lengthS 
     * @param {float} lengthT 
     */
    
    updateTexCoords(lengthS, lengthT) {
        var angBeta = Math.acos((Math.pow(this.d12, 2) - Math.pow(this.d02, 2) + Math.pow(this.d01, 2)) / (2 * this.d12 * this.d01));
        var dist = this.d12 * Math.sin(angBeta);
        this.texCoords = [
            0, dist/lengthT,
            this.d01/lengthS, dist/lengthT,
            (this.d01-this.d12*Math.cos(angBeta))/lengthS,(dist-this.d12*Math.sin(angBeta))/lengthT
        ];
        this.updateTexCoordsGLBuffers();
    }
}