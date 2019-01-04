class Counter extends CGFobject {

  constructor(scene) {
    super(scene);
    this.scene = scene;

    this.body = new MyCube(scene);
    this.screen = new MyRectangle(scene, -0.5, 0.5, -0.5, 0.5);

    this.blackPlayerWins = 0;
    this.whitePlayerWins = 0;

    this.whiteCounter = new CGFappearance(this.scene);
    this.whiteCounter.setShininess(20);
    this.whiteCounter.setEmission(0,0,0,1);
    this.whiteCounter.setAmbient(0.2,0.2,0.2,1);
    this.whiteCounter.setSpecular(0.6,0.6,0.6,1);
    this.whiteCounter.setDiffuse(1,1,1,1);

    this.blackCounter = new CGFappearance(this.scene);
    this.blackCounter.setShininess(20);
    this.blackCounter.setEmission(0,0,0,1);
    this.blackCounter.setAmbient(0.2,0.2,0.2,1);
    this.blackCounter.setSpecular(0.6,0.6,0.6,1);
    this.blackCounter.setDiffuse(0,0,0,1);

    this.zero = new CGFappearance(this.scene);
    this.zero.loadTexture("./scenes/images/zero.jpg");
    this.zero.setShininess(80);
    this.zero.setEmission(0,0,0,1);
    this.zero.setAmbient(0.2,0.2,0.2,1);
    this.zero.setDiffuse(0.5,0.5,0.5,1);
    this.zero.setSpecular(0.5,0.5,0.5,1);

    this.one = new CGFappearance(this.scene);
    this.one.loadTexture("./scenes/images/one.jpg");
    this.one.setShininess(80);
    this.one.setEmission(0,0,0,1);
    this.one.setAmbient(0.2,0.2,0.2,1);
    this.one.setDiffuse(0.5,0.5,0.5,1);
    this.one.setSpecular(0.5,0.5,0.5,1);

    this.two = new CGFappearance(this.scene);
    this.two.loadTexture("./scenes/images/two.jpg");
    this.two.setShininess(80);
    this.two.setEmission(0,0,0,1);
    this.two.setAmbient(0.2,0.2,0.2,1);
    this.two.setDiffuse(0.5,0.5,0.5,1);
    this.two.setSpecular(0.5,0.5,0.5,1);

    this.three = new CGFappearance(this.scene);
    this.three.loadTexture("./scenes/images/three.jpg");
    this.three.setShininess(80);
    this.three.setEmission(0,0,0,1);
    this.three.setAmbient(0.2,0.2,0.2,1);
    this.three.setDiffuse(0.5,0.5,0.5,1);
    this.three.setSpecular(0.5,0.5,0.5,1);

    this.four = new CGFappearance(this.scene);
    this.four.loadTexture("./scenes/images/four.jpg");
    this.four.setShininess(80);
    this.four.setEmission(0,0,0,1);
    this.four.setAmbient(0.2,0.2,0.2,1);
    this.four.setDiffuse(0.5,0.5,0.5,1);
    this.four.setSpecular(0.5,0.5,0.5,1);

    this.five = new CGFappearance(this.scene);
    this.five.loadTexture("./scenes/images/five.jpg");
    this.five.setShininess(80);
    this.five.setEmission(0,0,0,1);
    this.five.setAmbient(0.2,0.2,0.2,1);
    this.five.setDiffuse(0.5,0.5,0.5,1);
    this.five.setSpecular(0.5,0.5,0.5,1);

    this.six = new CGFappearance(this.scene);
    this.six.loadTexture("./scenes/images/six.jpg");
    this.six.setShininess(80);
    this.six.setEmission(0,0,0,1);
    this.six.setAmbient(0.2,0.2,0.2,1);
    this.six.setDiffuse(0.5,0.5,0.5,1);
    this.six.setSpecular(0.5,0.5,0.5,1);

    this.seven = new CGFappearance(this.scene);
    this.seven.loadTexture("./scenes/images/seven.jpg");
    this.seven.setShininess(80);
    this.seven.setEmission(0,0,0,1);
    this.seven.setAmbient(0.2,0.2,0.2,1);
    this.seven.setDiffuse(0.5,0.5,0.5,1);
    this.seven.setSpecular(0.5,0.5,0.5,1);

    this.eight = new CGFappearance(this.scene);
    this.eight.loadTexture("./scenes/images/eight.jpg");
    this.eight.setShininess(80);
    this.eight.setEmission(0,0,0,1);
    this.eight.setAmbient(0.2,0.2,0.2,1);
    this.eight.setDiffuse(0.5,0.5,0.5,1);
    this.eight.setSpecular(0.5,0.5,0.5,1);

    this.nine = new CGFappearance(this.scene);
    this.nine.loadTexture("./scenes/images/nine.jpg");
    this.nine.setShininess(80);
    this.nine.setEmission(0,0,0,1);
    this.nine.setAmbient(0.2,0.2,0.2,1);
    this.nine.setDiffuse(0.5,0.5,0.5,1);
    this.nine.setSpecular(0.5,0.5,0.5,1);
  }

  apply(n) {

    switch(n) {
      case 0:
        this.zero.apply();  
        break;
      case 1:
        this.one.apply();
        break;
      case 2:
        this.two.apply();
        break;
      case 3:
        this.three.apply();
        break;
      case 4:
        this.four.apply();
        break;
      case 5:
        this.five.apply();
        break;
      case 6:
        this.six.apply();
        break;
      case 7:
        this.seven.apply();
        break;
      case 8:
        this.eight.apply();
        break;
      case 9:
        this.nine.apply();
        break;
    }
}

  display() {

    //unit (white counter)
    
    this.apply(this.whitePlayerWins%10);

    this.scene.pushMatrix();
      this.scene.translate(-0.95, 0, 0.130);
      this.scene.scale(0.1, 0.2, 0.2);
      this.screen.display();
    this.scene.popMatrix();

    //tens (white counter)

    this.apply(Math.floor(this.whitePlayerWins/10));

    this.scene.pushMatrix();
      this.scene.translate(-1.05, 0, 0.130);
      this.scene.scale(0.1, 0.2, 0.2);
      this.screen.display();
    this.scene.popMatrix();

    //unit (black counter)

    this.apply(this.blackPlayerWins%10)

    this.scene.pushMatrix();
      this.scene.translate(0.95, 0, 0.130);
      this.scene.scale(0.1, 0.2, 0.2);
      this.screen.display();
    this.scene.popMatrix();

    //tens (black counter)

    this.apply(Math.floor(this.blackPlayerWins/10));

    this.scene.pushMatrix();
      this.scene.translate(1.05, 0, 0.130);
      this.scene.scale(0.1, 0.2, 0.2);
      this.screen.display();
    this.scene.popMatrix();

    //black counter

    this.blackCounter.apply();
  
    this.scene.pushMatrix();
      this.scene.translate(1, 0, 0);
      this.scene.scale(0.25, 0.25, 0.25);
      this.body.display();
    this.scene.popMatrix();

    //white counter

    this.whiteCounter.apply();

    this.scene.pushMatrix();
      this.scene.translate(-1, 0, 0); 
      this.scene.scale(0.25, 0.25, 0.25);
      this.body.display();
    this.scene.popMatrix();

  }

}