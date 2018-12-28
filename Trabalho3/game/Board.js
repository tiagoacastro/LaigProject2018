class Board extends CGFobject{

	constructor(scene, rows, cols) {
		super(scene);
		this.scene = scene;
		this.rows = rows; 
		this.cols = cols;
		this.board = [];
		this.pieces = [];

		this.initPieces();
		this.initBoard();
	}

	initPieces() {
		
		for (let i = 0; i < 6; i++) {
			if (i < 3) {
				this.pieces.push(new Piece(this.scene, 'black', i));
			} else {
				this.pieces.push(new Piece(this.scene, 'white', i));
			}
			this.pieces[i].initPiece();
		}

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
					//this.scene.translate(0, i*j*0.2, 0);
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

	display() {
		this.displayBoard();
		this.displayPieces();
	}

}