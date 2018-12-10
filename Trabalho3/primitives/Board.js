class Board extends CGFobject{

	constructor(scene, rows, cols) {
		super(scene);
		this.scene = scene;
		this.rows = rows; 
		this.cols = cols;
		this.board = [];

		this.initBoard();
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
				rowAux.push(new MyRectangle(this.scene, currX1, currY1, currX2, currY2));
				currX1 += colLen; currX2 += colLen;
				console.log(currX1, currX2, currY1, currY2);
			}
			currX1 = -0.5; 
			currX2 = -0.5 + colLen;
			currY1 += rowLen; 
			currY2 += rowLen;	
			this.board.push(rowAux);
			rowAux = [];
		}

		console.log(this.board);
	}

	display() {

		for(let i = 0; i < this.cols; i++) {
			for(let j = 0; j < this.rows; j++) {
				this.scene.pushMatrix();
					this.board[i][j].display();
				this.scene.popMatrix();
			}
		}
	}

}