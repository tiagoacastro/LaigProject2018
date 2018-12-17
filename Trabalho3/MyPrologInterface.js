function getPrologRequest(requestString, onSuccess, onError, port){
    var requestPort = port || 8081
    var request = new XMLHttpRequest()
    request.open('GET', 'http://localhost:'+requestPort+'/'+requestString, true)

    request.onload = onSuccess || function(data){console.log("Request successful. Reply: " + data.target.response)}
    request.onerror = onError || function(){console.log("Error waiting for response")}

    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8')
    request.send()
}

function getBoard(callback){
    let requestString = 'get_board'

    getPrologRequest(requestString, callback)
}

function validMoves(board, row, column, callback){
    let requestString = 'valid_moves('
        + decode(board) + ','
        + row + ','
        + column + ')';

    getPrologRequest(requestString, callback)
}

function movePlayer(board, color, row, column, direction, callback){
    let requestString = 'move_player('
        + decodeObject(board) + ','
        + decodeString(color) + ','
        + row + ','
        + column + ','
        + direction + ')';

    getPrologRequest(requestString, callback)
}

function moveBot(board, color, difficulty, callback){
    let requestString = 'move_bot('
        + decodeObject(board) + ','
        + decodeString(color) + ','
        + difficulty + ')';

    getPrologRequest(requestString, callback)
}

function isGameOver(board, color, callback){
    let requestString = 'is_game_over('
        + decodeObject(board) + ','
        + decodeString(color) + ')';

    getPrologRequest(requestString, callback)
}

function decodeString(string){
    return JSON.stringify(string)
}

function decodeObject(string){
    return JSON.stringify(string).replace(/"/g, '')
}

function print(){
    console.log(this.response)
}