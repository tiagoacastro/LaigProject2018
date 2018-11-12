/**
 * Plane class
 */
class MyPlane extends CGFobject {
    /**
     * @constructor
     * @param {XMLscene} scene 
     * @param {int} nPartsU
     * @param {int} nPartsV
     */
    constructor(scene, nPartsU, nPartsV){
        super(scene);

        this.nPartsU = nPartsU;
        this.nPartsV = nPartsV;
    
        this.initBuffers();
    };

    initBuffers()
	{
        this.controlPoints = [	// U = 0
            [ // V = 0..1;
                 [-0.5, 0.0, 0.5, 1 ],
                 [-0.5, 0.0, -0.5, 1 ]
                
            ],
            // U = 1
            [ // V = 0..1
                [0.5, 0.0, 0.5, 1 ],
                [0.5, 0.0, -0.5, 1 ]						 
            ]
        ];

        this.surface = new CGFnurbsSurface(1, 1, this.controlPoints);

        this.obj = new CGFnurbsObject(this.scene, this.nPartsU, this.nPartsV, this.surface);

        /*
        let x = -0.5;
        let z = -0.5;
        let intX = 1/this.nPartsU;
        let intZ = 1/this.nPartsV;

        for(let u = 0; u < this.nPartsU; u++){
            z = -0.5;
            for(let v = 0; v < this.nPartsV - 1; v++){
                this.controlPoints.push([
                    [x + u*intX, 0, z + v*intZ],
                    [x + u*intX, 0, z + (v+1)*intZ]
                ])
                z += intZ;
            }
            x += intX;
        }
        */
    };

    display(){
        this.obj.display();
    };
};