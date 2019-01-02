class Game {

  constructor(scene) {
    this.scene = scene;
    this.state = 'init';
    this.action = '';
    this.currPieceCol = -1;
    this.currPieceRow = -1;
    this.currPieceDir = -1;
    this.piece = null;

    this.initGame();
  }

  initGame() {
    this.board = new Board(this.scene, 5, 5); // hmm constants
    var bindedSetBoard = this.setBoard.bind(this);
    getBoard(bindedSetBoard);
  }

  setBoard(data){
    this.boardContent = data.target.response;
  }

  updateBoard(data){
    let response = data.target.response.split("-");
    this.boardContent = response[0];
    this.piece.setPos(response[1],response[2]);
  }

  checkWin(data){
    if(data.target.response == 1){                                                               //VER DRAW AQUI TMB
      this.state = 'end';
    }else{
      if(this.state == 'black_player_turn')
        this.state = 'white_player_turn';
      else
        this.state = 'black_player_turn';

      this.action = 'choose_piece';
    }
  }

  updateGameState() {
    switch(this.state){
      case 'init':
        this.state = 'black_player_turn';
        this.action = 'choose_piece';
        break;
      case 'black_player_turn':
        if (this.action === 'choose_piece') {
          console.log('black turn');
          this.piece = this.board.isPieceInPos(this.currPieceRow, this.currPieceCol);
          if (this.piece != null && this.piece.color === "b") {
            validMoves(this.boardContent, this.currPieceRow, this.currPieceCol, print);
            this.action = 'get_direction';
          }
        } else if (this.action === 'get_direction') {
          this.currPieceDir = 2;                                                                 //NEEDS PICKING FOR DIR
          this.action = 'move_piece';
        } else if (this.action === 'move_piece') {
          let boundUpdateBoard = this.updateBoard.bind(this);
          movePlayer(this.boardContent, 'b', this.currPieceRow, this.currPieceCol, this.currPieceDir, boundUpdateBoard);
          this.action = 'check_game_over';
        } else if (this.action === 'check_game_over') {
          let boundCheckWin = this.checkWin.bind(this);
          isGameOver(this.boardContent, 'b', boundCheckWin);
          this.action = 'wait';
        }
        break;
      case 'white_player_turn':
        if (this.action === 'choose_piece') {
          console.log('white turn');
          this.piece = this.board.isPieceInPos(this.currPieceRow, this.currPieceCol);
          if (this.piece != null && this.piece.color === "w") {
            validMoves(this.boardContent, this.currPieceRow, this.currPieceCol, print);
            this.action = 'get_direction';
          }
        } else if (this.action === 'get_direction') {
          this.currPieceDir = 2;                                                                //NEEDS PICKING FOR DIR
          this.action = 'move_piece';
        } else if (this.action === 'move_piece') {
          let boundUpdateBoard = this.updateBoard.bind(this);
          movePlayer(this.boardContent, 'w', this.currPieceRow, this.currPieceCol, this.currPieceDir, boundUpdateBoard);
          this.action = 'check_game_over';
        } else if (this.action === 'check_game_over') {
          let boundCheckWin = this.checkWin.bind(this);
          isGameOver(this.boardContent, 'w', boundCheckWin);
          this.action = 'wait';
        }
        break;
      case 'end':
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



