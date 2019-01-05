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
    this.reset = true;

    this.currCameraAng = 0;
    this.cameraAngInc = 0;
    this.botDifficulty = 2;
    this.actualBotDifficulty = 2;
    this.chosenSide = 'b';
    this.actualChosenSide = 'b';

    this.blackBotDifficulty = 2;
    this.whiteBotDifficulty = 2;

    this.undoAgain = false;
    this.replayRevertCounter = 0;
    this.replayReenactCounter = 0;

    this.clock = null;
    this.clockStopped = false;
    this.duration = 30;

    this.counter = null;

    this.isPlayerPOVActive = false;
    this.playerPOV = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(8, 11, 0), vec3.fromValues(0, 0, 0));
    this.dirArrow = new Arrow(this.scene);

    this.pickableObjs = [];
    for(let i = 0; i < 5*5; i++) { 
      this.pickableObjs.push(new MyCylinder(this.scene, 1, 1, 1, 10, 1));
    }

    this.ghostShader = new CGFshader(this.scene.gl, "./shaders/normal.vert", "./shaders/ghost.frag");
    this.highlightMaterial = new CGFappearance(this.scene);
    this.highlightMaterial.setShininess(80);
    this.highlightMaterial.setEmission(0,0,0,1);
    this.highlightMaterial.setAmbient(0.4,0.4,0.4,1);
    this.highlightMaterial.setDiffuse(0.74,1,0.71,1);
    this.highlightMaterial.setSpecular(0.7,0.7,0.7,1);

    this.scene.setPickEnabled(true);

    this.initGame();
  }

  logPicking() {

    let col, row;

    if (this.scene.pickMode == false) {
      if (this.scene.pickResults != null && this.scene.pickResults.length > 0) {
        for (var i=0; i< this.scene.pickResults.length; i++) {
          var obj = this.scene.pickResults[i][0];
          if (obj) {
            var customId = this.scene.pickResults[i][1];
            col = Math.floor((customId-1)/5) + 1;
            row = ((customId-1)%5) + 1;
            if (this.state === 'choose_piece') {
              this.selectedPieceCol = col;
              this.selectedPieceRow = row;
            } else if (this.state === 'choose_direction') {
                              this.moveDirCol = col;
                              this.moveDirRow = row;
                          }
            console.log("Picked object: " + obj + ", with pick id " + customId);
            console.log("Row: " + row + "; Col: " + col);
          }
        }
        this.scene.pickResults.splice(0,this.scene.pickResults.length);
      }		
    }
  }

  initGame() {
    this.ended = false;
    this.turns = [];
    this.board = new Board(this.scene, 5, 5); // hmm constants
    var boundSetBoard = this.setBoard.bind(this);
    getBoard(boundSetBoard);
  }

  resetBoard(){
    this.clock.stop();
    this.clockStopped = true;
    if(this.replayRevertCounter < this.board.pieces.length){
      if(!this.areAnimationsRunning()){
        let piece = this.board.pieces[this.replayRevertCounter];
        piece.initPiece();
        piece.isMoving = true;
        this.replayRevertCounter++;
      }
      return;
    }
    this.clock.continue();
    this.clockStopped = false; 
    this.ended = false;
    this.turns = [];
    var boundSetBoard = this.setBoard.bind(this);
    getBoard(boundSetBoard);
    this.reset = true;
    this.replayRevertCounter = 0;
    this.currPlayer = null;
    this.boardContent = null;
    this.undoAgain = false;

  }

  setBoard(data){
    this.boardContent = data.target.response;
  }

  setBotCamera() {
    if (!this.areAnimationsRunning()) {
      if (this.currPlayer == 'b') {
        this.playerPOV.orbit(CGFcameraAxis.Y, this.cameraAngInc);
      } else {
        this.playerPOV.orbit(CGFcameraAxis.Y, -this.cameraAngInc);
      }

      if (Math.abs(this.currCameraAng) >= Math.PI/2) { 
        this.currCameraAng = 0;
        this.playerPOV.setPosition(vec3.fromValues(0,11,8));
        this.state = 'init';
      }

    } 
  }

  setPVCCamera() {
    if (!this.areAnimationsRunning()) {
      console.log(this.actualChosenSide);
      if (this.actualChosenSide == 'w') {
        this.playerPOV.orbit(CGFcameraAxis.Y, -this.cameraAngInc);
        console.log('hmm');
      } else {
        this.state = 'init';
        return;
      }

      if (Math.abs(this.currCameraAng) >= Math.PI) { 
        this.currCameraAng = 0;
        this.playerPOV.setPosition(vec3.fromValues(-8,11,0));
        this.state = 'init';
      }

    } 
  }

  setCamera() {
    this.isPlayerPOVActive = !this.isPlayerPOVActive;
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

    this.clock.stop();
    this.clockStopped = true;

    this.turns.push([this.boardContent, this.currPiece.getId(), this.currPiece.getPos(), [parseInt(response[1]), parseInt(response[2])]]); //board, piece id, oldPos, newPos
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
    this.turns.push([this.boardContent, this.currPiece.getId(), this.currPiece.getPos(), [parseInt(response[3]), parseInt(response[4])]]); //board, pieceId, oldPos, newPos
    console.log(this.turns);

    this.boardContent = response[0];
    console.log('new row: ' + response[3] + ' new col: ' + response[4]);
    this.currPiece.setPos(parseInt(response[4]),parseInt(response[3]));
    this.currPiece.isMoving = true;
    this.state = 'check_game_over';
  }

  checkGameOver(data) {

    if ((this.clock.current - this.clock.base)/1000 > this.clock.time) {
      switch(this.style) {
        case 0:
        this.state = 'reset_camera';
        break;
        case 1:
        this.state = 'reset_pvc_camera';
        break;
        case 2:
        this.state = 'reset_bot_camera';
        break;
      }

      if (this.currPlayer === 'b') {
        this.counter.whitePlayerWins++;
      } else {
        this.counter.blackPlayerWins++;
      }

      return;
    }
    
    let occurences = this.turns.filter(turn => turn[0] === this.boardContent);

    if(data.target.response == 1 || occurences.length === 3) {
      switch(this.style) {
        case 0:
        this.state = 'reset_camera';
        break;
        case 1:
        this.state = 'reset_pvc_camera';
        break;
        case 2:
        this.state = 'reset_bot_camera';
        break;
      }

      if (this.currPlayer === 'b') {
        this.counter.blackPlayerWins++;
      } else {
        this.counter.whitePlayerWins++;
      }

      this.clock.stop();
    } else {
      this.clock.change();
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
        this.playerPOV.orbit(CGFcameraAxis.Y, -this.cameraAngInc);
      } else {
        this.playerPOV.orbit(CGFcameraAxis.Y, this.cameraAngInc);
      }

      //console.log(this.playerPOV.position.toString());

      if (Math.abs(this.currCameraAng) >= Math.PI) { 
        this.currCameraAng = 0;
        if (this.currPlayer == 'b') {
          this.playerPOV.setPosition(vec3.fromValues(-8, 11, 0));
        } else {
          this.playerPOV.setPosition(vec3.fromValues(8, 11, 0));
        }
        this.cameraAngInc = 0;
        this.switchPlayers();
        this.state = 'check_style';
      }

    } 
  }

  resetCamera() {
    if (!this.areAnimationsRunning()) {
      if (this.currPlayer == 'w') {
        this.playerPOV.orbit(CGFcameraAxis.Y, this.cameraAngInc);
      } else {
        this.state = 'end';
        return;
      }

      if (Math.abs(this.currCameraAng) >= Math.PI) { 
        this.currCameraAng = 0;
        this.playerPOV.setPosition(vec3.fromValues(8,11,0));
        this.state = 'end';
      }

    } 
  }

  resetBotCamera() {
    if (!this.areAnimationsRunning()) {
      this.playerPOV.orbit(CGFcameraAxis.Y, this.cameraAngInc);

      if (Math.abs(this.currCameraAng) >= Math.PI/2) { 
        this.currCameraAng = 0;
        this.playerPOV.setPosition(vec3.fromValues(8,11,0));
        this.state = 'end';
      }

    } 
  }

  resetPVCCamera() {
    if (!this.areAnimationsRunning()) {
      if (this.actualChosenSide == 'w') {
        this.playerPOV.orbit(CGFcameraAxis.Y, this.cameraAngInc);
      } else {
        this.state = 'end';
        return;
      }

      if (Math.abs(this.currCameraAng) >= Math.PI) { 
        this.currCameraAng = 0;
        this.playerPOV.setPosition(vec3.fromValues(8,11,0));
        this.state = 'end';
      }

    } 
  }

  replay(){
    if(this.turns.length > 0  && !this.areAnimationsRunning() && (this.style !== 2 || this.ended) && 
    (this.style !== 1 || this.currPlayer === this.actualChosenSide || this.ended)){
      this.state = 'replay';
      this.replayRevertCounter = 0;
      this.replayReenactCounter = 0;
    }
  }

  replayState(){

    if(!this.clockStopped){
      this.clock.stop();
      this.clockStopped = true;
    }

    if(this.replayRevertCounter < this.board.pieces.length){
      if(!this.areAnimationsRunning()){
        let piece = this.board.pieces[this.replayRevertCounter];
        piece.initPiece();
        piece.isMoving = true;
        this.replayRevertCounter++;
      }
      return;
    }

    if(this.replayReenactCounter < this.turns.length){
      if(!this.areAnimationsRunning()){
        let turn = this.turns[this.replayReenactCounter];
        console.log(turn)
        let piece = this.board.pieces[turn[1]];
        piece.setPos(turn[3][1], turn[3][0]);
        piece.isMoving = true;
        this.replayReenactCounter++;
      }
      return;
    }

    if(this.ended)
      this.state = 'end';
    else
      this.state = 'check_style';
  }

  undo(){
    if(this.turns.length > 0  && !this.areAnimationsRunning() && this.style !== 2 && !this.ended &&
    (this.style !== 1 || this.currPlayer === this.actualChosenSide)){
      this.state = 'undo';
    }
  }

  undoState(){
    if(!this.clockStopped){
      this.clock.stop();
      this.clockStopped = true;
    }
    this.clock.change();
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

  checkStyle() {
    if(!this.areAnimationsRunning()) {
      if(this.undoAgain) {
        this.undo();
      } else{
        if(this.clockStopped){
          this.clock.continue();
          this.clockStopped = false;
        }
        switch(this.style) {
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
      }
    }
  }

  startPvsP(){
    if(this.state === 'none'){
      this.state = 'init';
      this.style = 0;
      this.clock.start();
    }
  }

  startPvsBot(){
    if(this.state === 'none'){
      this.state = 'set_pvc_camera';
      this.actualChosenSide = this.chosenSide;
      this.actualBotDifficulty = this.botDifficulty;
      this.style = 1;
      this.clock.start();
    }
  }

  startBotvsBot(){
    if(this.state === 'none'){
      this.state = 'set_bot_camera';
      this.style = 2;
      this.actualWhiteBotDifficulty = this.whiteBotDifficulty;
      this.actualBlackBotDifficulty = this.blackBotDifficulty;
      this.clock.start();
    }
  }

  end() {
    if (!this.areAnimationsRunning()) {
      this.playerPOV.setPosition(vec3.fromValues(8, 11, 0)); //kinda of a temp solution for now, should probably do one last animation to reset the player pov
      this.state = 'none';
      this.selectedPieceCol = -1;
      this.selectedPieceRow = -1;
      this.currPiece = null;
      this.moveDirRow = -1;
      this.moveDirCol = -1;
      this.moveDir = -1;
      this.ended = true;
      this.replayRevertCounter = 0;
      this.replayReenactCounter = 0;
      this.reset = false;
    }
  }

  stateMachine() {
    console.log(this.state);
    switch (this.state) {
      case 'init':
        if(this.reset){
          this.currPlayer = 'b';
          this.state = 'check_style';
          this.clock.setTime(this.duration);
        } else
          this.resetBoard();
        break;
      case 'set_bot_camera':
        this.setBotCamera();
        break;
      case 'set_pvc_camera':
        this.setPVCCamera();
        break;
      case 'check_style':
        this.checkStyle();
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
        if(this.style === 1)
          moveBot(this.boardContent, this.currPlayer, this.actualBotDifficulty, boundBotMove);
        else{
          if(this.currPlayer === 'b')
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
      case 'reset_camera':
        this.resetCamera();
        break;
      case 'reset_bot_camera':
        this.resetBotCamera();
        break;
      case 'reset_pvc_camera':
        this.resetPVCCamera();
        break;
      case 'end':
        this.end();
        break;
      case 'undo':
        this.undoState();
        break;
      case 'replay':
        this.replayState();
        break;
      case 'wait': //for async functions
        break;
      case 'none':
        break;
    }
  }

  display() {

    this.logPicking();
    this.scene.clearPickRegistration();

    this.board.display();
					
    let currX = -0.4, currY = 0.4;
    let currRow = 1, currCol = 1;

    for (let i = 0; i < this.pickableObjs.length; i++) {

      this.highlightMaterial.apply();

      if (i != 0) {
        if (i%5 == 0){
          currX = -0.4;
          currY -= 0.2
          currRow = 1;
          currCol++;
        } else {
          currX += 0.2;
          currRow++;
        } 
      }
        
      this.scene.setActiveShader(this.ghostShader);

      if (this.state == 'choose_direction') {
        var isHighlighted = dirMap[[currRow - this.selectedPieceRow, currCol - this.selectedPieceCol]];
        if (this.currValidDirs.includes(isHighlighted)) {
          //set arrow direction 
          var rot = 0;
          switch (isHighlighted) {
            case 1: // N
            rot = -Math.PI/2;
            break;
            case 2: // W
            break;
            case 3: // E
            rot = Math.PI;
            break;
            case 4: // S
            rot = Math.PI/2;
            break
            case 5: // NE
            rot = -(Math.PI/4)*3; 
            break;
            case 6: // NW
            rot = -Math.PI/4;
            break;
            case 7: // SE
            rot = (Math.PI/4)*3; 
            break;
            case 8: // SW
            rot = Math.PI/4; 
          }
          this.scene.setActiveShader(this.scene.defaultShader);
          this.scene.pushMatrix();
              this.scene.translate(currX, 0.01, currY);
              this.scene.rotate(rot, 0, 1, 0);
              this.scene.scale(0.1, 0.1, 0.1);
              this.dirArrow.display();
          this.scene.popMatrix();
          this.scene.setActiveShader(this.ghostShader);
        }
      }

      this.scene.pushMatrix();
        this.scene.translate(currX, 0, currY);
        this.scene.rotate(-Math.PI/2, 1, 0, 0);
        this.scene.scale(0.1, 0.1, 0.1);
        this.scene.registerForPick(i+1, this.pickableObjs[i]);
        this.pickableObjs[i].display();
      this.scene.popMatrix();
    }
    
    this.scene.setActiveShader(this.scene.defaultShader);
  }
}



