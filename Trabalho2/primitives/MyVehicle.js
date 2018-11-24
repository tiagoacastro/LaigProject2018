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
        this.cone = new MyCylinder2(scene, 0.5625, 1, 1, 60, 60);
        this.cylinder = new MyCylinder2(scene, 0.2, 0.2, 1, 60, 60);
        this.circle = new MyCircle(scene, 60);
        this.top = new MyPatch(
            scene,
            4, 4, 60, 60,
            [
                [0, 0, 5],
                [0, 0, 4.7],
                [0, 0, 0.3],
                [0, 0, 0],

                [0.1, 0, 5],
                [0.1, 3, 4.7],
                [0.1, 0.75, 0.3],
                [0.1, 0, 0],

                [2.9, 0, 5],
                [2.9, 3, 4.7],
                [2.9, 0.75, 0.3],
                [2.9, 0, 0],

                [3, 0, 5],
                [3, 0, 4.7],
                [3, 0, 0.3],
                [3, 0, 0],
            ]
        )
    };

    /**
     * Object display
     */
    display(){

        this.scene.pushMatrix();

        this.scene.translate(-1.5, 0, -2.5);

        //  body

        this.scene.pushMatrix();
            this.scene.rotate(Math.PI/2, 0, 0, 1);
            this.scene.scale(1, 1, 5);
            this.scene.translate(0.5, 0, 0.5);
            this.plane.display();
        this.scene.popMatrix();
        
        this.scene.pushMatrix();
            this.scene.translate(3, 1, 0)
            this.scene.rotate(-Math.PI/2, 0, 0, 1);
            this.scene.scale(1, 1, 5);
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
            this.scene.scale(3, 1, 1);
            this.scene.translate(0.5, 0, 0.5);
            this.plane.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate(0, 1, 5);
            this.scene.rotate(Math.PI/2, 1, 0, 0);
            this.scene.scale(3, 1, 1);
            this.scene.translate(0.5, 0, 0.5);
            this.plane.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate(3, 1, 5);
            this.top.display();
        this.scene.popMatrix();

        //thrusters

        this.scene.pushMatrix();
            this.scene.translate(4.25, 1, 1.25);
            this.scene.scale(0.5625, 0.5625, 1.5);
            this.scene.rotate(Math.PI, 1, 0, 0);
            this.circle.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate(4.25, 1, 1.25);
            this.scene.scale(1, 1, 2.5);
            this.cone.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate(4.25, 1, 3.75);
            this.scene.scale(1, 1, 1.5);
            this.circle.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate(-1.25, 1, 1.25);
            this.scene.scale(0.5625, 0.5625, 1.5);
            this.scene.rotate(Math.PI, 1, 0, 0);
            this.circle.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate(-1.25, 1, 1.25);
            this.scene.scale(1, 1, 2.5);
            this.cone.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate(-1.25, 1, 3.75);
            this.scene.scale(1, 1, 1.5);
            this.circle.display();
        this.scene.popMatrix();

        //conectors
        
        this.scene.pushMatrix();
            this.scene.translate(-0.75, 1, 2.5);
            this.scene.rotate(Math.PI/2, 0, 1, 0);
            this.scene.scale(1, 1, 1.5);
            this.cylinder.display();
        this.scene.popMatrix();
        
        this.scene.pushMatrix();
            this.scene.translate(2.75, 1, 2.5);
            this.scene.rotate(Math.PI/2, 0, 1, 0);
            this.scene.scale(1, 1, 1.5);
            this.cylinder.display();
        this.scene.popMatrix(); 

        this.scene.popMatrix();
    };
};