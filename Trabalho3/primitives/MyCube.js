class MyCube extends CGFobject{
  
  constructor(scene) {
    super(scene);
    this.scene = scene;

    this.face = new MyRectangle(this.scene, -0.5, -0.5, 0.5, 0.5);
    this.plane = new MyPlane(scene, 20, 20);
  }
  
  display() {

    
    this.scene.pushMatrix();
      this.face.display();
    this.scene.popMatrix();
    

    this.scene.pushMatrix();
      this.scene.translate(0,0,0.5);
      this.face.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
      this.scene.translate(0,-0.5,0);
      this.scene.rotate(Math.PI/2, 1, 0, 0);
      this.face.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
      this.scene.translate(0,0,-0.5);
      this.scene.rotate(Math.PI, 1, 0, 0);
      this.face.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
      this.scene.translate(0,0.5,0);
      this.scene.rotate(-Math.PI/2, 1, 0, 0);
      this.face.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
      this.scene.translate(0.5,0,0);
      this.scene.rotate(Math.PI/2, 0, 1, 0);
      this.face.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
      this.scene.translate(-0.5,0,0);
      this.scene.rotate(-Math.PI/2, 0, 1, 0);
      this.face.display();
    this.scene.popMatrix();

  }

}