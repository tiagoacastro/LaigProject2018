/**
 * Patch class
 */
class MyPatch extends CGFobject {
    /**
     * @constructor
     * @param {XMLscene} scene 
     * @param {int} nPointsU
     * @param {int} nPointsV
     * @param {int} nPartsU
     * @param {int} nPartsV
     * @param {array of int arrays} controlPoints
     */
    constructor(scene, nPointsU, nPointsV, nPartsU, nPartsV, controlPoints){
        super(scene);

        this.nPointsU = nPointsU;
        this.nPointsV = nPointsV;
        this.nPartsU = nPartsU;
        this.nPartsV = nPartsV;
        this.controlPoints = controlPoints;
    
        this.initBuffers();
    };

    initBuffers()
	{
        this.actualControlPoints = [];

        for(let i = 0; i < this.nPointsU; i ++){
            let aux = [];
            for(let j = 0; j < this.nPointsV; j ++){
                aux.push([this.controlPoints[i*this.nPointsV+j][0], this.controlPoints[i*this.nPointsV+j][1], this.controlPoints[i*this.nPointsV+j][2], this.nPointsV-1]);
            }
            this.actualControlPoints.push(aux);
        }

        this.surface = new CGFnurbsSurface(this.nPointsU-1, this.nPointsV-1, this.actualControlPoints);

        this.obj = new CGFnurbsObject(this.scene, this.nPartsU, this.nPartsV, this.surface);
    };

    display(){
        this.scene.pushMatrix();
            this.scene.rotate(Math.PI, 0, 1, 0);
            this.obj.display();
        this.scene.popMatrix();
    };
};