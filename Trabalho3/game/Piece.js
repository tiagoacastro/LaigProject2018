class Piece {

    constructor(scene, color, id) {
				this.scene = scene;
				this.body = new MyCylinder(scene, 1, 1, 1, 10, 1);
				this.color = color || '';
				this.id = id;
				this.pos = [0, 0, 0];
				this.row = null;
				this.col = null;

				this.initPiece();
		}
		
		setPos(col, row) {
			this.pos = [-0.6 + row * 0.2, 0, 0.6 - col * 0.2];
			this.col = col;
			this.row = row;
			console.log('col: ' + this.col + ' row: ' + this.row);
		}

		initPiece() {
			switch(this.id) { // 0-2 black, 3-5 white 
				case 0:
					this.setPos(2, 1);
					this.color = 'b';
					break;
				case 1:
					this.setPos(3, 4);
					this.color = 'b';
					break;
				case 2:
					this.setPos(4, 1);
					this.color = 'b';
					break;
				case 3:
					this.setPos(2, 5);
					this.color = 'w';
					break;
				case 4:
					this.setPos(3, 2);
					this.color = 'w';
					break;
				case 5:
					this.setPos(4, 5);
					this.color = 'w';
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