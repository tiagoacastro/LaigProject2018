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
    this.state = 'none';
    this.moveDirRow = -1;
    this.moveDirCol = -1;
    this.currPlayer = null;
    this.selectedPieceCol = -1;
    this.selectedPieceRow = -1;
    this.boardContent = null;
    this.currPiece = null;
    this.moveDir = -1;
    this.turns = [];

    this.currCameraAng = 0;
    this.cameraAngInc = 0;
    this.botDifficulty = 2;
    this.actualBotDifficulty = 2;
    this.chosenSide = 'b';
    this.actualChosenSide = 'b';

    this.blackBotDifficulty = 2;
    this.whiteBotDifficulty = 2;

    this.undoAgain = false;

    this.gamePOV = new CGFcamera(0.4, 0.1, 10, vec3.fromValues(3, 5, 0), vec3.fromValues(0, 0, 0));
    this.dirArrow = new Arrow(this.scene);

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
    if (validDir != null) {
      this.moveDir = validDir; 
      this.state = 'move_piece';
    }
  }

  movePiece(data) {
    let response = data.target.response.split("-");

    this.turns.push([this.boardContent, this.currPiece.getId(), this.currPiece.getPos()]); //board, piece id, oldPos, newPos
    //console.log(this.turns);

    this.boardContent = response[0];
    //console.log('new row: ' + response[1] + ' new col: ' + response[2]);
    this.currPiece.setPos(parseInt(response[2]),parseInt(response[1]));
    this.currPiece.isMoving = true;
    this.state = 'check_game_over';
  }

  botMove(data){
    let response = data.target.response.split("-");

    this.currPiece = this.board.isPieceInPos(parseInt(response[1]), parseInt(response[2]));
    this.turns.push([this.boardContent, this.currPiece.getId(), this.currPiece.getPos()]); //board, pieceId, oldPos, newPos
    console.log(this.turns);

    this.boardContent = response[0];
    console.log('new row: ' + response[3] + ' new col: ' + response[4]);
    this.currPiece.setPos(parseInt(response[4]),parseInt(response[3]));
    this.currPiece.isMoving = true;
    this.state = 'check_game_over';
  }

  checkGameOver(data) { 
    let occurences = this.turns.filter(turn => turn[0] === this.boardContent);

    if(data.target.response == 1 || occurences.length === 3){                                                              
      this.state = 'end';
    } else {
      if(this.style === 0)
        this.state = 'move_camera';
      else{
        this.switchPlayers();
        this.state = 'check_style';
      }
    }
  }

  moveCamera() {
    if (!this.areAnimationsRunning()) {
      if (this.currPlayer == 'b') {
        this.gamePOV.orbit(CGFcameraAxis.Y, -this.cameraAngInc);
      } else {
        this.gamePOV.orbit(CGFcameraAxis.Y, this.cameraAngInc);
      }

      if (Math.abs(this.currCameraAng) >= Math.PI) { 
        this.currCameraAng = 0;
        if (this.currPlayer == 'b') {
          this.gamePOV.setPosition(vec3.fromValues(-3,5,0));
        } else {
          this.gamePOV.setPosition(vec3.fromValues(3,5,0));
        }
        this.switchPlayers();
        this.state = 'check_style';
      }

    } 
  }

  undo(){
    if(this.turns.length > 0  && !this.areAnimationsRunning()){
      if(this.style === 0)
        this.state = 'move_camera';
      else
        this.state = 'check_style';
      let turn = this.turns.pop();
      this.boardContent = turn[0];
      let piece = this.board.pieces[turn[1]];
      piece.setPos(turn[2][1], turn[2][0]);
      piece.isMoving = true;
      if(this.style !== 0)
        this.undoAgain = !this.undoAgain;
    }
  }

  startPvsP(){
    if(this.state === 'none'){
      this.state = 'init';
      this.style = 0;
    }
  }

  startPvsBot(){
    if(this.state === 'none'){
      this.state = 'init';
      this.style = 1;
    }
  }

  startBotvsBot(){
    if(this.state === 'none'){
      this.state = 'init';
      this.style = 2;
    }
  }

  end() {
    //check the winner
    if (!this.areAnimationsRunning()) {
      //this.moveCamera();
      this.gamePOV.setPosition(vec3.fromValues(3,5,0)); //kinda of a temp solution for now, should probably do one last animation to reset the player pov
      this.state = 'none';
      this.currPlayer = null;
      this.selectedPieceCol = -1;
      this.selectedPieceRow = -1;
      this.boardContent = null;
      this.currPiece = null;
      this.moveDirRow = -1;
      this.moveDirCol = -1;
      this.moveDir = -1;
      this.turns = [];
      this.undoAgain = false;
      this.initGame();
    }
  }

  stateMachine() {
    //console.log('in state: ' + this.state + ' for player ' + this.currPlayer);
    switch (this.state) {
      case 'init':
        this.currPlayer = 'b';
        this.state = 'check_style';
        switch(this.style){
          case 1:
            this.actualChosenSide = this.chosenSide;
            this.actualBotDifficulty = this.botDifficulty;
            break;
          case 2:
            this.actualWhiteBotDifficulty = this.whiteBotDifficulty;
            this.actualBlackBotDifficulty = this.blackBotDifficulty;
            break;
        }
        break;
      case 'check_style':
        if(this.undoAgain){
          this.undo();
        } else 
          switch(this.style){
            case 0:
              this.state = 'choose_piece';
              break;
            case 1:
              if(this.currPlayer === this.actualChosenSide)
                this.state = 'choose_piece';
              else
                this.state = 'bot_move';
              break;
            case 2:
                this.state = 'bot_move';
              break;
          }
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
      case 'bot_move':
          let boundBotMove = this.botMove.bind(this);
          this.state = 'wait';
          if(this.style === 2)
            moveBot(this.boardContent, this.currPlayer, this.actualBotDifficulty, boundBotMove);
          else{
            if(this.currPlayer = 'b')
              moveBot(this.boardContent, this.currPlayer, this.actualBlackBotDifficulty, boundBotMove);
            else
              moveBot(this.boardContent, this.currPlayer, this.actualWhiteBotDifficulty, boundBotMove);
          }
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
      case 'none':
        break;
    }
  }

  display() {
    this.board.display();
  }
}



