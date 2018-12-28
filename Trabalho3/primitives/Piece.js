class Piece {

    constructor(scene, color, id) {
				this.scene = scene;
				this.body = new MyCylinder(scene, 1, 1, 1, 10, 1);
				this.color = color || '';
				this.id = id;
				this.pos = [0, 0, 0];

				this.initPiece(id);
		}
		
		setPos(col, row) {
			this.pos = [-0.4 + (row-1) * 0.2, 0, -0.4 + (col.charCodeAt() - 65) * 0.2];
			console.log(this.pos);
		}

		initPiece() {
			switch(this.id) { // 0-2 black, 3-5 white 
				case 0:
					this.setPos('B', 1);
					break;
				case 1:
					this.setPos('C', 4);
					break;
				case 2:
					this.setPos('D', 1);
					break;
				case 3:
					this.setPos('B', 5);
					break;
				case 4:
					this.setPos('C', 2);
					break;
				case 5:
					this.setPos('D', 5);
					break;
			}
		}

    display() {
				this.scene.pushMatrix();
					this.scene.translate(this.pos[0], this.pos[1], this.pos[2]);
					this.scene.rotate(-Math.PI/2, 1, 0, 0);
					this.scene.scale(0.05, 0.05, 0.05);
					this.body.display();
        this.scene.popMatrix();
    }

}