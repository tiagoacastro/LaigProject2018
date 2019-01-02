class Game {

  constructor(scene) {
    this.scene = scene;
    this.state = 'init';
    this.action = '';
    this.currPieceCol = -1;
    this.currPieceRow = -1;
    this.currPieceDir = -1;

    this.initGame();
  }

  initGame() {
    this.board = new Board(this.scene, 5, 5); // hmm constants
  }

  updateBoard() {
    var currPiece = this.board.isPieceInPos(this.currPieceRow, this.currPieceCol);
    var incRow = 0, incCol = 0, tmpRow = this.currPieceRow, tmpCol = this.currPieceCol;
    var pieceFound = 0;
    switch(this.currPieceDir) {
      case 1:
        incRow = -1;
        break;
      case 2:
        incCol = -1;
        break;
      case 3:
        incCol = 1;
        break;
      case 4:
        incRow = 1; 
        break;
      case 5:
        incCol = 1;
        incRow = -1;
        break; 
      case 6:
        incCol = -1;
        incRow = -1;
        break;
      case 7:
        incCol = 1;
        incRow = 1;
        break;
      case 8:
        incCol = -1;
        incRow = 1;
        break;
    }

    while(tmpCol < 6 && tmpCol > 0 && tmpRow < 6 && tmpRow > 0 && !pieceFound) {
      console.log("tmp col: " + tmpCol + " tmp row: " + tmpRow);
      tmpCol += incCol; tmpRow += incRow; 
      if (tmpCol < 6 && tmpCol > 0 && tmpRow < 6 && tmpRow > 0) {
        if (this.board.isPieceInPos(tmpRow, tmpCol)) {
          pieceFound = 1;
          tmpCol -= incCol; tmpRow -= incRow;
          break;
        }
      } else {
        tmpCol -= incCol; tmpRow -= incRow;
        break;  
      }
    }

    //console.log("curr piece row: " + currPiece.row + " curr piece col: " + currPiece.col + " curr piece id: " + currPiece.id);
    //console.log("tmp row: " + tmpRow + " tmp col: " + tmpCol);
    currPiece.setPos(tmpCol, tmpRow);
    //console.log(this.board.pieces);

  }

  checkGameState() {
    switch(this.state){
      case 'init':
        this.state = 'black_player_turn';
        this.action = 'choose_piece';
        break;
      case 'black_player_turn':
        //choose move
        if (this.action === 'choose_piece') {
          //check if move is valid, assuming it always is for now
          var pieceExists = this.board.isPieceInPos(this.currPieceRow, this.currPieceCol);
          //console.log(pieceExists);
          if (pieceExists != null && pieceExists.color === "b") {
            console.log('piece exists');
            //check valid moves
            validMoves(this.board.pieces, this.currPieceRow, this.currPieceCol, print);
            //choose direction (for test purposes assuming south by default)
            this.currPieceDir = 2;
            //send move to prolog
            movePlayer(this.board.pieces, 'b', this.currPieceRow, this.currPieceCol, this.currPieceDir, print);
            this.updateBoard();
            this.action = 'check_game_over';
          }
        } else if (this.action === 'check_game_over') {
          //check game state
          //if they won, go to end state
          //if not, start white player turn
          this.state = 'white_player_turn';
          this.action = 'choose_piece';
        }

        break;
      case 'white_player_turn':
        //choose move
        if (this.action === 'choose_piece') {
          //check if move is valid, assuming it always is for now
          var pieceExists = this.board.isPieceInPos(this.currPieceRow, this.currPieceCol);
          //console.log(pieceExists);
          if (pieceExists != null && pieceExists.color === "w") {
            console.log('piece exists');
            //check valid moves
            validMoves(this.board.pieces, this.currPieceRow, this.currPieceCol, print);
            //choose direction (for test purposes assuming south by default)
            this.currPieceDir = 2;
            //send move to prolog
            movePlayer(this.board.pieces, 'w', this.currPieceRow, this.currPieceCol, this.currPieceDir, print);
            this.updateBoard();
            this.action = 'check_game_over';
          }
        } else if (this.action === 'check_game_over') {
          //check game state TODO
          //if they won, go to end state TODO
          //if not, start white player turn
          this.state = 'black_player_turn';
          this.action = 'choose_piece';
        }
        break;
      case 'end_game':
        //?? victory screen ? TODO
        break;
      case 'draw':
       //?? draw screen ? TODO
       break;
    }
  }

  display() {
    this.board.display();
  }
}



