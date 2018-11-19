/**
 * Vehicle class
 */
class MyVehicle extends CGFobject {
    /**
     * @constructor
     * @param {XMLscene} scene 
     */
    constructor(scene){
        super(scene);

        this.plane = new MyPlane(scene, 20, 20);
        this.cone = new MyCylinder2(scene, 0.75, 1, 1, 60, 60);
    
        this.display();
    };

    /**
     * Object display
     */
    display(){
        this.scene.pushMatrix();
            this.scene.rotate(Math.PI/2, 0, 0, 1);
            this.scene.scale(2, 1, 5);
            this.scene.translate(0.5, 0, 0.5);
            this.plane.display();
        this.scene.popMatrix();
        
        this.scene.pushMatrix();
            this.scene.translate(3, 2, 0)
            this.scene.rotate(-Math.PI/2, 0, 0, 1);
            this.scene.scale(2, 1, 5);
            this.scene.translate(0.5, 0, 0.5);
            this.plane.display();
        this.scene.popMatrix();
        
        this.scene.pushMatrix();
            this.scene.translate(0, 2, 0);
            this.scene.scale(3, 1, 5);
            this.scene.translate(0.5, 0, 0.5);
            this.plane.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate(3, 0, 0);
            this.scene.rotate(Math.PI, 0, 0, 1);
            this.scene.scale(3, 1, 5);
            this.scene.translate(0.5, 0, 0.5);
            this.plane.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.rotate(-Math.PI/2, 1, 0, 0);
            this.scene.scale(3, 1, 2);
            this.scene.translate(0.5, 0, 0.5);
            this.plane.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate(0, 2, 5);
            this.scene.rotate(Math.PI/2, 1, 0, 0);
            this.scene.scale(3, 1, 2);
            this.scene.translate(0.5, 0, 0.5);
            this.plane.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate(4.3, 1.5, 0);
            this.scene.scale(2.6, 2.6, 4);
            this.cone.display();
        this.scene.popMatrix();
    };
};