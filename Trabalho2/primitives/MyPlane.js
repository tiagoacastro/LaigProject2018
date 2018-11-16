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
    };

    display(){
        this.scene.pushMatrix();
            this.scene.rotate(Math.PI, 0, 1, 0);
            this.obj.display();
        this.scene.popMatrix();
    };
};