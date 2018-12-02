class Board extends CGFobject{

    constructor(scene) {
        super(scene);
        this.scene = scene;
        this.board = new MyCube(this.scene, 1, 1);
    }

    display() {
        this.scene.pushMatrix();
          this.board.display();
        this.scene.popMatrix();
    }

}