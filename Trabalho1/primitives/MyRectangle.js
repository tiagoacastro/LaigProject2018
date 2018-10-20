/**
 * Rectangle class
 */
class MyRectangle extends CGFobject{
    /**
     * @constructor
     * @param {XMLscene} scene 
     * @param {float} x1 
     * @param {float} x2 
     * @param {float} y1 
     * @param {float} y2 
     */
    constructor(scene, x1, x2, y1, y2) {
        super(scene);
        
        this.x1 = x1;
        this.x2 = x2;
        this.y1 = y1;
        this.y2 = y2;
        this.minS = 0.0;
        this.minT =  0.0;
        this.maxS =  1.0;
        this.maxT =  1.0;

        this.initBuffers();
    }
    /**
     * Function where the vertexes, indexes, normals and texcoords are defined
     */
    initBuffers()
    {
        this.vertices = [
            this.x1, this.y1, 0,
            this.x2, this.y1, 0,
            this.x1, this.y2, 0,
            this.x2, this.y2, 0
        ];
 
        this.indices = [
            0, 1, 2,
            3, 2, 1
        ];
 
        this.normals = [
            0, 0, 1,
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
    }
    /**
     * TexCoords update for the lengthS and lengthT use
     * @param {float} lengthS 
     * @param {float} lengthT 
     */
    updateTexCoords(lengthS, lengthT) {
        this.minS = 0;
        this.minT = 0;
        this.maxS = (this.x2 - this.x1) / lengthS;
        this.maxT = (this.y2 - this.y1) / lengthT;

        this.texCoords = [
            this.minS, this.maxT,
            this.maxS, this.maxT,
            this.minS, this.minT,
            this.maxS, this.minT
        ];

        this.updateTexCoordsGLBuffers();
    }
 
}