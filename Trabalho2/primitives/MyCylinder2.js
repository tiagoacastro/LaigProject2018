/**
 * Cylinder2 class
 */
class MyCylinder2 extends CGFobject
{   
    /**
     * @constructor, base and top are the radius of the bases
     * @param {XMLscene} scene 
     * @param {float} base
     * @param {float} top 
     * @param {float} height 
     * @param {int} slices 
     * @param {int} stacks 
     */
	constructor(scene, base, top, height, slices, stacks)
	{
		super(scene);

        this.slices = slices;
        this.stacks = stacks;
        this.height = height;
        this.top = top;
        if(this.top = 0)
            this.top = 0.0001;
        this.base = base;
        if(this.base = 0)
            this.base = 0.0001

        this.initBuffers();
    };
    
    /**
     * Nurbs setup
     */
    initBuffers()
	{
        this.controlPoints = [	// U = 0
            [ // V = 0..1;
                 [-this.top, 0.0, this.height, 1],
                 [-this.base, 0.0, 0.0, 1] 
            ],
            // U = 1
            [ // V = 0..1;
                [-this.top, (4/3)*this.top, this.height, 1],
                [-this.base, (4/3)*this.base, 0.0, 1] 
            ],
            // U = 2
            [ // V = 0..1;
                [this.top, (4/3)*this.top, this.height, 1],
                [this.base, (4/3)*this.base, 0.0, 1] 
            ],
            // U = 3
            [ // V = 0..1
                [this.top, 0.0, this.height, 1],
                [this.base, 0.0, 0.0, 1]						 
            ]
        ];

        this.surface = new CGFnurbsSurface(3, 1, this.controlPoints);

        this.obj = new CGFnurbsObject(this.scene, this.slices/2, this.stacks/2, this.surface);
    };

    /**
     * Object display
     */
    display()
	{   
        this.obj.display();
        this.scene.pushMatrix();
            this.scene.rotate(Math.PI, 0, 0, 1);
            this.obj.display();
        this.scene.popMatrix();
    };
}; 