class Board extends CGFobject{

	constructor(scene, rows, cols) {
		super(scene);
		this.scene = scene;
		this.rows = rows; 
		this.cols = cols;
		this.board = [];
		this.pieces = [];

		this.black = new CGFappearance(this.scene);
		this.black.setShininess(20);
		this.black.setEmission(0,0,0,1);
		this.black.setAmbient(0.2,0.2,0.2,1);
		this.black.setSpecular(0.6,0.6,0.6,1);
		this.black.setDiffuse(1,1,1,1);
		this.black.loadTexture("./scenes/images/black_marble.jpg");

		this.white = new CGFappearance(this.scene);
		this.white.setShininess(20);
		this.white.setEmission(0,0,0,1);
		this.white.setAmbient(0.2,0.2,0.2,1);
		this.white.setSpecular(0.6,0.6,0.6,1);
		this.white.setDiffuse(1,1,1,1);
		this.white.loadTexture("./scenes/images/marble.jpg");
	

		this.initPieces();
		this.initBoard();
	}

	initPieces() {
		
		this.pieces.push(new Piece(this.scene, 'w', 0));
		this.pieces.push(new Piece(this.scene, 'w', 1));
		this.pieces.push(new Piece(this.scene, 'w', 2));
		this.pieces.push(new Piece(this.scene, 'b', 3));
		this.pieces.push(new Piece(this.scene, 'b', 4));
		this.pieces.push(new Piece(this.scene, 'b', 5));

		console.log(this.pieces);
	}

	initBoard() {

		let colLen = 1/this.cols,
				rowLen = 1/this.rows,
				rowAux = [],
				currX1 = -0.5,
				currY1 = -0.5,
				currX2 = -0.5+colLen,
				currY2 = -0.5+rowLen;
			
		for(let i = 0; i < this.cols; i++) {
			for(let j = 0; j < this.rows; j++) {
				rowAux.push(new MyRectangle(this.scene, currX1, currX2, currY1, currY2));
				currX1 += colLen; currX2 += colLen;
				//console.log(rowAux[j]);
			}
			currX1 = -0.5; 
			currX2 = -0.5 + colLen;
			currY1 += rowLen; 
			currY2 += rowLen;	
			this.board.push(rowAux);
			rowAux = [];
		}

		//console.log(this.board.length);
	}

	displayBoard() {

		for(let i = 0; i < this.cols; i++) {
			for(let j = 0; j < this.rows; j++) {
				this.scene.pushMatrix();
					if((j+i)%2===0)
						this.black.apply();
					else
						this.white.apply();
					this.scene.rotate(-Math.PI/2, 1, 0, 0);
					this.board[i][j].display();
				this.scene.popMatrix();
			}
		}
	}

	displayPieces() {
		
		for(let i = 0; i < this.pieces.length; i++) {
			this.scene.pushMatrix();
				this.pieces[i].display();
			this.scene.popMatrix();
		}
	}

	isPieceInPos(row, col) {
		//console.log(row, col);
		for (let i = 0; i < this.pieces.length; i++) {
			if (this.pieces[i].currCol == col && this.pieces[i].currRow == row) {
				return this.pieces[i];
			}
		}
		return null;
	}

	display() {
		this.displayBoard();
		this.displayPieces();
	}

}