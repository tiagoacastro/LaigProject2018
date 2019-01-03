//assuming moveDirPos - currPiecePos

var dirMap = {}; // key: row, col
dirMap[[-1,0]] = 1; // N
dirMap[[0,1]] = 3; // E 
dirMap[[1,0]] = 4; // S
dirMap[[0,-1]] = 2; // W
dirMap[[-1,1]] = 5; // NE 
dirMap[[1,1]] = 7; // SE
dirMap[[-1,-1]] = 6; // NW
dirMap[[1,-1]] = 8; // SW

class Game {

  constructor(scene) {
    this.scene = scene;
    this.state = 'init';
    this.moveDirRow = -1;
    this.moveDirCol = -1;
    this.currPlayer = null;
    this.selectedPieceCol = -1;
    this.selectedPieceRow = -1;
    this.boardContent = null;
    this.currPiece = null;
    this.moveDir = -1;
    this.turns = [];

    this.gamePOV = new CGFcamera(0.4, 0.1, 10, vec3.fromValues(3, 5, 0), vec3.fromValues(0, 0, 0));

    this.initGame();
  }

  initGame() {
    this.board = new Board(this.scene, 5, 5); // hmm constants
    var boundSetBoard = this.setBoard.bind(this);
    getBoard(boundSetBoard);

    this.scene.camera = this.gamePOV;
  }

  setBoard(data){
    this.boardContent = data.target.response;
  }

  areAnimationsRunning() {
    for (let i = 0; i < this.board.pieces.length; i++) {
      if (this.board.pieces[i].currAnimation != null) {
        return true;
      }
    }
    return false;
  }

  switchPlayers() {
    this.selectedPieceCol = -1;
    this.selectedPieceRow = -1;
    this.moveDirRow = -1;
    this.moveDirCol = -1;
    this.moveDir = -1;
    this.currPiece = null;
    if (this.currPlayer == 'b') {
      this.currPlayer = 'w';
    } else {
      this.currPlayer = 'b';
    }
  }

  choosePiece() {

    var validPiece = this.board.isPieceInPos(this.selectedPieceRow, this.selectedPieceCol);
    if (validPiece != null && validPiece.color == this.currPlayer) {
      this.currPiece = validPiece;
      this.state = 'get_valid_dirs';
    }

  }

  getValidDirs(data) {
    this.currValidDirs = data.target.response;
    console.log(this.currValidDirs);
    this.state = 'choose_direction';
  }

  isValidDir() {
    var currDir = dirMap[[this.moveDirRow - this.selectedPieceRow, this.moveDirCol - this.selectedPieceCol]];
    if (this.currValidDirs.includes(currDir)) {
      return currDir;
    } else {
      return null;
    }
  }

  chooseDir() {
    var validDir = this.isValidDir();
    console.log(validDir);
    if (validDir != null) {
      this.moveDir = validDir; 
      this.state = 'move_piece';
    }
  }

  movePiece(data) {
    let response = data.target.response.split("-");

    this.turns.push([response[0], this.currPiece, this.currPiece.getPos(), [parseInt(response[1]), parseInt(response[2])]]); //board, piece, oldPos, newPos
    console.log(this.turns);

    this.boardContent = response[0];
    console.log('new row: ' + response[1] + ' new col: ' + response[2]);
    this.currPiece.setPos(parseInt(response[2]),parseInt(response[1]));
    this.currPiece.isMoving = true;
    this.state = 'check_game_over';
  }

  checkGameOver(data) {
    let occurences = this.turns.filter(turn => turn[0] === this.boardContent);

    if(data.target.response == 1 || occurences.length === 3){                                                              
      this.state = 'end';
    } else {
      this.state = 'move_camera';
    }
  }

  moveCamera() {
    if (!this.areAnimationsRunning()) {
      if (this.currPlayer == 'b') {
        this.gamePOV.orbit(CGFcameraAxis.Y, -Math.PI);
      } else {
        this.gamePOV.orbit(CGFcameraAxis.Y, Math.PI);
      }
      this.switchPlayers();
      this.state = 'choose_piece';
    } 
  }

  end() {
    //check the winner
    if (!this.areAnimationsRunning()) {
      this.state = 'init';
      this.currPlayer = null;
      this.selectedPieceCol = -1;
      this.selectedPieceRow = -1;
      this.boardContent = null;
      this.currPiece = null;
      this.moveDirRow = -1;
      this.moveDirCol = -1;
      this.moveDir = -1;
      this.turns = [];
      this.initGame();
    }
  }

  stateMachine() {
    //console.log('in state: ' + this.state + ' for player ' + this.currPlayer);
    switch (this.state) {
      case 'init':
        this.currPlayer = 'b';
        this.state = 'choose_piece';
        break;
      case 'choose_piece':
        this.choosePiece();
        break;
      case 'get_valid_dirs':
        var boundGetValidDirs = this.getValidDirs.bind(this);
        this.state = 'wait';
        validMoves(this.boardContent, this.selectedPieceRow, this.selectedPieceCol, boundGetValidDirs);
        break;
      case 'choose_direction':
        this.chooseDir();
        break;
      case 'move_piece':
        let boundMovePiece = this.movePiece.bind(this);
        this.state = 'wait';
        movePlayer(this.boardContent, this.currPlayer, this.selectedPieceRow, this.selectedPieceCol, this.moveDir, boundMovePiece);
        break;
      case 'check_game_over':
        var boundCheckGameOver = this.checkGameOver.bind(this);
        this.state = 'wait';
        isGameOver(this.boardContent, this.currPlayer, boundCheckGameOver);
        break;
      case 'move_camera':
        this.moveCamera();
        break;
      case 'end':
        this.end();
        break;
      case 'wait':
        break;
    }
  }

  display() {
    this.board.display();
  }
}



