class MyCube extends CGFobject{
  
  constructor(scene, x, y) {
    super(scene);
    this.scene = scene;
    this.x = x;
    this.y = y;

    this.face = new MyRectangle(this.scene, -(this.x/2), -(this.y/2), (this.x/2), (this.y/2));
  }
  
  display() {

    this.scene.pushMatrix();
      this.scene.translate(0,0,this.x/2);
      this.face.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
      this.scene.translate(0,-(this.y/2),0);
      this.scene.rotate(Math.PI/2, 1, 0, 0);
      this.face.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
      this.scene.translate(0,0,-this.x/2);
      this.scene.rotate(Math.PI, 1, 0, 0);
      this.face.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
      this.scene.translate(0,this.y/2,0);
      this.scene.rotate(-Math.PI/2, 1, 0, 0);
      this.face.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
      this.scene.translate(this.x/2,0,0);
      this.scene.rotate(Math.PI/2, 0, 1, 0);
      this.face.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
      this.scene.translate(-this.x/2,0,0);
      this.scene.rotate(-Math.PI/2, 0, 1, 0);
      this.face.display();
    this.scene.popMatrix();

  }

}