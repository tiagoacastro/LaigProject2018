class Piece {

    constructor(scene, color, id) {
				this.scene = scene;
				this.body = new MyCylinder(scene, 1, 1, 1, 10, 1);
				this.color = color || '';
				this.id = id;
				this.oldPos = [0, 0, 0];
				this.currPos = [0, 0, 0];
				this.oldRow = null;
				this.oldCol = null;
				this.currRow = null;
				this.currCol = null;

				this.isMoving = false;
				this.currAnimation = null;

				this.material = new CGFappearance(this.scene);
        this.material.setShininess(80);
        this.material.setEmission(0,0,0,1);
        this.material.setAmbient(0.2,0.2,0.2,1);
        this.material.setDiffuse(0,0,0,1);
        this.material.setSpecular(0.6,0.6,0.6,1);

				this.initPiece();
		}

		getId(){
			return this.id;
		}
		
		setPos(col, row) {
			this.oldPos = this.currPos;
			this.currPos = [-0.6 + row * 0.2, 0, 0.6 - col * 0.2];
			this.oldCol = this.currCol;
			this.oldRow = this.currRow;
			this.currCol = col;
			this.currRow = row;
		}

		getPos() {
			return [this.currRow, this.currCol];
		}

		movePiece() {
			if (this.currAnimation == null) {
				this.currAnimation = new LinearAnimation(this.scene, 1, [this.oldPos, this.currPos]);
				this.currAnimation.isActive = 1;
				console.log('created new animation');
			} else {
				if (!this.currAnimation.isDone) {
					this.currAnimation.apply();
					console.log('applying animation');
				} else {
					console.log('animation done');
					this.isMoving = false;
					this.currAnimation = null;
				}
			}
		}

		initPiece() {
			switch(this.id) { // 0-2 black, 3-5 white 
				case 0:
					this.setPos(2, 1);
					this.color = 'w';
					this.material.setDiffuse(1,1,1,1);
					break;
				case 1:
					this.setPos(3, 4);
					this.color = 'w';
					this.material.setDiffuse(1,1,1,1);
					break;
				case 2:
					this.setPos(4, 1);
					this.color = 'w';
					this.material.setDiffuse(1,1,1,1);
					break;
				case 3:
					this.setPos(2, 5);
					this.color = 'b';
					break;
				case 4:
					this.setPos(3, 2);
					this.color = 'b';
					break;
				case 5:
					this.setPos(4, 5);
					this.color = 'b';
					break;
			}
		}

    display() {

			this.material.apply();

			if (this.isMoving) {
				this.scene.pushMatrix();
					this.movePiece();
					this.scene.rotate(-Math.PI/2, 1, 0, 0);
					this.scene.scale(0.05, 0.05, 0.05);
					this.body.display();
				this.scene.popMatrix();
			} else {	
				this.scene.pushMatrix();
					this.scene.translate(this.currPos[0], this.currPos[1], this.currPos[2]);
					this.scene.rotate(-Math.PI/2, 1, 0, 0);
					this.scene.scale(0.05, 0.05, 0.05);
					this.body.display();
				this.scene.popMatrix();
			}

    }

}