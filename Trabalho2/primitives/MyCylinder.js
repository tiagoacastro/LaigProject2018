/**
 * Cylinder class that joins the baseless cylinder and 2 circles
 */
class MyCylinder extends CGFobject
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
        this.rtop = top;
        this.rbase = base;
        if(this.rtop = 0)
            this.rtop = 0.0001;
        if(this.rbase = 0)
            this.rbase = 0.0001

        this.baselessCylinder = new MyBaselessCylinder(scene, base, top, height, slices, stacks);
        this.top = new MyCircle(scene, slices);
        this.bottom = new MyCircle(scene, slices);

		this.display();
	};
    /**
     * function to draw the cylinder and its pieces in the correct way
     */
    display()
	{
        this.baselessCylinder.display();

        this.scene.pushMatrix();
            this.scene.translate(0, 0, this.height);
            if(this.top !=null){
                this.scene.pushMatrix();
                    this.scene.scale(this.rtop,this.rtop,1);
                    this.top.display();
                this.scene.popMatrix();
            }
        this.scene.popMatrix();
    
        this.scene.pushMatrix();
            this.scene.rotate(Math.PI, 0, 1, 0);
            this.scene.scale(-1, -1, 1);
            if(this.bottom !=null){
                this.scene.pushMatrix();
                    this.scene.scale(this.rbase,this.rbase,1);
                    this.bottom.display();
                this.scene.popMatrix();
            }
        this.scene.popMatrix();
    };
}; 