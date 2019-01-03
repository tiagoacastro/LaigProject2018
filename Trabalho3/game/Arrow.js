class Arrow extends CGFobject {

  constructor(scene) {
    super(scene);
    this.scene = scene;

    this.triangle = new MyTriangle(scene, -0.5, 0, 0.5, 0, 0, 0, 0, 0.5, 0);
    this.quad = new MyRectangle(scene, -0.25, 0.25, 0, 0.25);
  }

  display() {

    this.scene.pushMatrix();
      this.triangle.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
      this.scene.rotate(-Math.PI/2, 1, 0, 0);
      this.quad.display();
    this.scene.popMatrix();
  }

}