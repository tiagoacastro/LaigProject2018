class Piece {

    constructor(scene, color, id) {
				this.scene = scene;
				this.body = new MyCylinder(scene, 1, 1, 1, 30, 10);
				this.top = new MyTorus(scene, 0.15, 0.7, 30, 30);
				this.color = color || '';
				this.id = id;
				this.oldRow = null;
				this.oldCol = null;
				this.currRow = null;
				this.currCol = null;

				this.isMoving = false;
				this.currAnimation = null;

				this.material = new CGFappearance(this.scene);
				this.material.setShininess(20);
				this.material.setEmission(0,0,0,1);
				this.material.setAmbient(0.2,0.2,0.2,1);
				this.material.setSpecular(0.6,0.6,0.6,1);
				if(color === 'b') {
					this.material.setDiffuse(1,1,1,1);
					this.material.loadTexture("./scenes/images/black_marble.jpg");
				} else {
					this.material.setDiffuse(1,1,1,1);
					this.material.loadTexture("./scenes/images/marble.jpg");
				}

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
				let height = Math.sqrt((this.currPos[0]-this.oldPos[0])*(this.currPos[0]-this.oldPos[0]) + (this.currPos[2]-this.oldPos[2])*(this.currPos[2]-this.oldPos[2]))*0.25;
				if(height>0.25)
					height=0.25;
				let mid = [this.currPos[0], this.currPos[1]+height, this.currPos[2]];
				let time = Math.sqrt((this.currRow-this.oldRow)*(this.currRow-this.oldRow)+(this.currCol-this.oldCol)*(this.currCol-this.oldCol))*0.75;
				this.currAnimation = new LinearAnimation(this.scene, time, [this.oldPos, mid, this.currPos]);
				this.currAnimation.isActive = 1;
				this.currAnimation.apply();
				console.log('created new animation');
			} else {
				if (!this.currAnimation.isDone) {
					this.currAnimation.apply();
					console.log('applying animation');
				} else {
					console.log('animation done');
					this.scene.translate(this.currPos[0], this.currPos[1], this.currPos[2]);
					this.isMoving = false;
					this.currAnimation = null;
				}
			}
		}

		initPiece() {
			switch(this.id) { // 0-2 black, 3-5 white 
				case 0:
					this.setPos(2, 1);
					break;
				case 1:
					this.setPos(3, 4);
					break;
				case 2:
					this.setPos(4, 1);		
					break;
				case 3:
					this.setPos(2, 5);		
					break;
				case 4:
					this.setPos(3, 2);			
					break;
				case 5:
					this.setPos(4, 5);
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
					this.scene.translate(0, 0, 1);
					this.scene.pushMatrix();
						this.scene.translate(0, 0, 1);
						this.scene.scale(1, 1, 0.5);
						this.top.display();
					this.scene.popMatrix();
				this.scene.popMatrix();
			} else {	
				this.scene.pushMatrix();
					this.scene.translate(this.currPos[0], this.currPos[1], this.currPos[2]);
					this.scene.rotate(-Math.PI/2, 1, 0, 0);
					this.scene.scale(0.05, 0.05, 0.05);
					this.body.display();
					this.scene.pushMatrix();
						this.scene.translate(0, 0, 1);
						this.scene.scale(1, 1, 0.3);
						this.top.display();
					this.scene.popMatrix();
				this.scene.popMatrix();
			}

    }

}