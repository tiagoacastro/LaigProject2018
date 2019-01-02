% Starts a game with the start board 

% Human vs Human 
initGame(1) :-
    startBoard(Board),
    playTurn(Board, 1).

% Human vs Computer 
initGame(2, Difficulty) :-
    startBoard(Board),
    playTurnVSBot(Board, 1, Difficulty).

% Computer vs Computer 
initGame(3, Difficulty) :-
    startBoard(Board),
    playTurnBotVSBot(Board, 1, Difficulty).

%-----------------------------------------------------------

% Game loop

% Human vs Human 
playTurn(Board, N):-
    blackTurn(Board, IntBoard),
    (
        game_over(IntBoard, 'b');
        (
            whiteTurn(IntBoard, FinalBoard),
            (
                saveBoard(N, Board), game_over(FinalBoard, 'w');
                (
                    NewN is N + 1,
                    playTurn(FinalBoard, NewN)
                )
            )
        )
    ).

% Human vs Computer
playTurnVSBot(Board, N, Dif):-
    blackTurn(Board, IntBoard),
    (
        game_over(IntBoard, 'b');
        (
            display_game(IntBoard),
            write('\n'),
            choose_move(IntBoard, FinalBoard, Dif, 'w'),
            (
                saveBoard(N, Board), game_over(FinalBoard, 'w');
                (
                    NewN is N + 1,
                    playTurnVSBot(FinalBoard, NewN, Dif)
                )
            )
        )
    ).

% Computer vs Computer
playTurnBotVSBot(Board, N, Dif):-
    display_game(Board),
    write('\n'),
    choose_move(Board, IntBoard, Dif, 'b'),
    (
        game_over(IntBoard, 'b');
        (
            display_game(IntBoard),
            write('\n'),
            choose_move(IntBoard, FinalBoard, Dif, 'w'),
            (
                saveBoard(N, Board), game_over(FinalBoard, 'w');
                (
                    saveBoard(N, Board),
                    NewN is N + 1,
                    playTurnBotVSBot(FinalBoard, NewN, Dif)
                )
            )
        )
    ).

%-----------------------------------------------------------

%Turn processing

% Processes black piece's turn
blackTurn(InBoard, OutBoard) :-
    display_game(InBoard),
    write('\nNow playing: BLACK\n\n'),
    move(Direction, InBoard, 'b', OutBoard).

% Processes white piece's turn
whiteTurn(InBoard, OutBoard) :-
    display_game(InBoard),
    write('\nNow playing: WHITE\n\n'),
    move(Direction, InBoard, 'w', OutBoard).  

% Processes easy bot's turn
choose_move(InBoard, OutBoard, 1, Color) :-
    random(1, 4, Piece),
    getNthPiecePos(InBoard, Color, Nrow, Ncolumn, Piece),
    valid_moves(InBoard, Nrow, Ncolumn, ListOfMoves),
    randomDirection(ListOfMoves, Direction),
    findNewPosition(Direction, InBoard, Nrow, Ncolumn, OutRow, OutColumn),
    changePiece(InBoard, Ncolumn, Nrow, 'x', IntBoard),
    changePiece(IntBoard, OutColumn, OutRow, Color, OutBoard).

% Processes hard bot's turn
choose_move(InBoard, OutBoard, 2, Color) :-
    getBestPlay(1, InBoard, Color, Row1, Column1, Direction1, Value1),
    getBestPlay(2, InBoard, Color, Row2, Column2, Direction2, Value2),
    getBestPlay(3, InBoard, Color, Row3, Column3, Direction3, Value3),
    checkBestPiece(Value1, Value2, Value3, Piece),
    parse(Piece, Row, Row1, Row2, Row3, Column, Column1, Column2, Column3, Direction, Direction1, Direction2, Direction3),
    findNewPosition(Direction, InBoard, Row, Column, OutRow, OutColumn),
    changePiece(InBoard, Column, Row, 'x', IntBoard),
    changePiece(IntBoard, OutColumn, OutRow, Color, OutBoard).

% Processes easy bot's turn
choose_move_more(InBoard, OutBoard, 1, Color, Nrow, Ncolumn, OutRow, OutColumn) :-
    random(1, 4, Piece),
    getNthPiecePos(InBoard, Color, Nrow, Ncolumn, Piece),
    valid_moves(InBoard, Nrow, Ncolumn, ListOfMoves),
    randomDirection(ListOfMoves, Direction),
    findNewPosition(Direction, InBoard, Nrow, Ncolumn, OutRow, OutColumn),
    changePiece(InBoard, Ncolumn, Nrow, 'x', IntBoard),
    changePiece(IntBoard, OutColumn, OutRow, Color, OutBoard).

% Processes hard bot's turn
choose_move_more(InBoard, OutBoard, 2, Color, Row, Column, OutRow, OutColumn) :-
    getBestPlay(1, InBoard, Color, Row1, Column1, Direction1, Value1),
    getBestPlay(2, InBoard, Color, Row2, Column2, Direction2, Value2),
    getBestPlay(3, InBoard, Color, Row3, Column3, Direction3, Value3),
    checkBestPiece(Value1, Value2, Value3, Piece),
    parse(Piece, Row, Row1, Row2, Row3, Column, Column1, Column2, Column3, Direction, Direction1, Direction2, Direction3),
    findNewPosition(Direction, InBoard, Row, Column, OutRow, OutColumn),
    changePiece(InBoard, Column, Row, 'x', IntBoard),
    changePiece(IntBoard, OutColumn, OutRow, Color, OutBoard).

%-----------------------------------------------------------

%Choosing hard bot's move

% Processes hard bot turn for value purposes
simulateBotWin(Board, 2, Color) :-
    (getWinPlay(1, Board, Color, A), A = 1);
    (getWinPlay(2, Board, Color, B), B = 1);
    (getWinPlay(3, Board, Color, C), C = 1).

% Parses values for the chosen piece
parse(Piece, Row, Row1, Row2, Row3, Column, Column1, Column2, Column3, Direction, Direction1, Direction2, Direction3) :-
    (
        (Piece = 1, Direction is Direction1, Row is Row1, Column is Column1);
        (Piece = 2, Direction is Direction2, Row is Row2, Column is Column2);
        (Piece = 3, Direction is Direction3, Row is Row3, Column is Column3)
    ), !.

% Gets piece with highest value move
checkBestPiece(Value1, Value2, Value3, Piece) :-
    (
        (Value1 > Value2, Value1 > Value3, Piece is 1);
        (Value2 > Value1, Value2 > Value3, Piece is 2);
        (Value3 > Value1, Value3 > Value2, Piece is 3);
        (Value1 = Value2, random(1, 3, Piece));
        (Value2 = Value3, random(2, 4, Piece));
        (Value1 = Value3, random(1, 3, Choice), ((Choice = 1, Piece is 1);(Choice = 2, Piece is 3)));
        random(1, 4, Piece)
    ), !.

% Gets best play for the piece
getBestPlay(N, Board, Color, Row, Column, Direction, Value) :-
    getNthPiecePos(Board, Color, Row, Column, N),
    valid_moves(Board, Row, Column, Moves),
    getBestDirection(8, Board, Color, Row, Column, -11, -11, Moves, Direction, Value).

% Checks if there is a win play
getWinPlay(N, Board, Color, A) :-
    getNthPiecePos(Board, Color, Row, Column, N),
    valid_moves(Board, Row, Column, Moves),
    getWinDirection(8, Board, Color, Row, Column, Moves, A), !.

% Gets best direction for the play
getBestDirection(0, Board, Color, Row, Column, TempDir, TempValue, Moves, Direction, Value) :-
    Value is TempValue,
    Direction is TempDir.

getBestDirection(Dir, Board, Color, Row, Column, TempDir, TempValue, Moves, Direction, Value) :-
    Next is Dir - 1,
    ((sublist([Dir], Moves), % check is Dir is valid 
        findNewPosition(Dir, Board, Row, Column, OutRow, OutColumn),
        changePiece(Board, Column, Row, 'x', IntBoard),
        changePiece(IntBoard, OutColumn, OutRow, Color, OutBoard),
        value(OutBoard, Color, Val), !,(
        (Val > TempValue, % check if value is superior to the one stored
            getBestDirection(Next, Board, Color, Row, Column, Dir, Val, Moves, Direction, Value)
        );((Val = TempValue, % check if value is equal to the one stored
            random(1, 3, Check),
            Check = 1, % check if the direction is changed based on a random number
            getBestDirection(Next, Board, Color, Row, Column, Dir, Val, Moves, Direction, Value), !)
            ;getBestDirection(Next, Board, Color, Row, Column, TempDir, TempValue, Moves, Direction, Value)
        ))
    );( 
    getBestDirection(Next, Board, Color, Row, Column, TempDir, TempValue, Moves, Direction, Value))).

% Checks if any direction leads to victory
getWinDirection(0, Board, Color, Row, Column, Moves, A) :-
    A is 0, !.

getWinDirection(Dir, Board, Color, Row, Column, Moves, A) :-
    Next is Dir - 1,
    ((sublist([Dir], Moves),
        findNewPosition(Dir, Board, Row, Column, OutRow, OutColumn),
        changePiece(Board, Column, Row, 'x', IntBoard),
        changePiece(IntBoard, OutColumn, OutRow, Color, OutBoard),
        checkWin(OutBoard, Color), A is 1
    );( 
    getWinDirection(Next, Board, Color, Row, Column, Moves, A))).

% Evaluates board state checking if it as a win for the player, if it has an opponent win,
% if it has a win on the next turn and if it has 2 pieces together
value(Board, 'b', Value) :-
    (checkWin(Board, 'b'), Value is 3);
    (simulateBotWin(Board, 2, 'w'), Value is -1);
    (simulateBotWin(Board, 2, 'b'), Value is 2);
    (check2(Board, 'b'), Value is 1);
    Value is 0.

value(Board, 'w', Value) :-
    (checkWin(Board, 'w'), Value is 3);
    (simulateBotWin(Board, 2, 'b'), Value is -1);
    (simulateBotWin(Board, 2, 'w'), Value is 2);
    (check2(Board, 'w'), Value is 1);
    Value is 0.

%-----------------------------------------------------------

% Processes move and updates board 

%Finds the piece's new position and updates board
move(Direction, InBoard, Player, OutBoard) :-
    getMovingPiece(InBoard, Row, Column, Player),
    valid_moves(InBoard, Row, Column, ListOfMoves),
    readDirection(ListOfMoves, Direction), 
    findNewPosition(Direction, InBoard, Row, Column, OutRow, OutColumn),
    changePiece(InBoard, Column, Row, 'x', IntBoard),
    changePiece(IntBoard, OutColumn, OutRow, Player, OutBoard).

%Finds the piece's new position and updates board
player_move(InBoard, Color, Row, Column, Direction, OutBoard, OutRow, OutColumn) :-
    findNewPosition(Direction, InBoard, Row, Column, OutRow, OutColumn),
    changePiece(InBoard, Column, Row, 'x', IntBoard),
    changePiece(IntBoard, OutColumn, OutRow, Color, OutBoard).

%When a findNewPosition predicate is prematurely ended because a piece was found before reaching the border
findNewPosition('end', Board, Row, Column, OutRow, OutColumn) :-
    OutRow is Row,
    OutColumn is Column.

%Gets the new position for a piece moving 'north'
findNewPosition(1, Board, Row, Column, OutRow, OutColumn) :-
    NewRow is Row - 1, 
    ((isMoveValid(Board, NewRow, Column),
        findNewPosition(1, Board, NewRow, Column, OutRow, OutColumn));
        findNewPosition('end', Board, Row, Column, OutRow, OutColumn)).

%Gets the new position for a piece moving 'west'
findNewPosition(2, Board, Row, Column, OutRow, OutColumn) :-
    NewColumn is Column - 1, 
    ((isMoveValid(Board, Row, NewColumn),
        findNewPosition(2, Board, Row, NewColumn, OutRow, OutColumn));
        findNewPosition('end', Board, Row, Column, OutRow, OutColumn)).

%Gets the new position for a piece moving 'east'
findNewPosition(3, Board, Row, Column, OutRow, OutColumn) :-
    NewColumn is Column + 1, 
    ((isMoveValid(Board, Row, NewColumn),
        findNewPosition(3, Board, Row, NewColumn, OutRow, OutColumn));
        findNewPosition('end', Board, Row, Column, OutRow, OutColumn)).   

%Gets the new position for a piece moving 'south'
findNewPosition(4, Board, Row, Column, OutRow, OutColumn) :-
    NewRow is Row + 1, 
    ((isMoveValid(Board, NewRow, Column),
        findNewPosition(4, Board, NewRow, Column, OutRow, OutColumn));
        findNewPosition('end', Board, Row, Column, OutRow, OutColumn)).
    
%Gets the new position for a piece moving 'northeast'
findNewPosition(5, Board, Row, Column, OutRow, OutColumn) :-
    NewRow is Row - 1, 
    NewColumn is Column + 1, 
    ((isMoveValid(Board, NewRow, NewColumn),
        findNewPosition(5, Board, NewRow, NewColumn, OutRow, OutColumn));
        findNewPosition('end', Board, Row, Column, OutRow, OutColumn)).

%Gets the new position for a piece moving 'northwest'
findNewPosition(6, Board, Row, Column, OutRow, OutColumn) :-
    NewRow is Row - 1, 
    NewColumn is Column - 1, 
    ((isMoveValid(Board, NewRow, NewColumn),
        findNewPosition(6, Board, NewRow, NewColumn, OutRow, OutColumn));
        findNewPosition('end', Board, Row, Column, OutRow, OutColumn)).

%Gets the new position for a piece moving 'southeast'
findNewPosition(7, Board, Row, Column, OutRow, OutColumn) :-
    NewRow is Row + 1, 
    NewColumn is Column + 1, 
    ((isMoveValid(Board, NewRow, NewColumn),
        findNewPosition(7, Board, NewRow, NewColumn, OutRow, OutColumn));
        findNewPosition('end', Board, Row, Column, OutRow, OutColumn)).

%Gets the new position for a piece moving 'southwest'
findNewPosition(8, Board, Row, Column, OutRow, OutColumn) :-
    NewRow is Row + 1, 
    NewColumn is Column - 1, 
    ((isMoveValid(Board, NewRow, NewColumn),
        findNewPosition(8, Board, NewRow, NewColumn, OutRow, OutColumn));
        findNewPosition('end', Board, Row, Column, OutRow, OutColumn)).

%Gets valid moves and stores them in a list
valid_moves(Board, Row, Column, ListOfMoves) :-
    RowDown is Row + 1,
    RowUp is Row - 1,
    ColumnRight is Column + 1,
    ColumnLeft is Column - 1,
    isMoveValid(Board, RowUp, Column, 1, [], OutList1),
    isMoveValid(Board, Row, ColumnLeft, 2, OutList1, OutList2),
    isMoveValid(Board, Row, ColumnRight, 3, OutList2, OutList3),
    isMoveValid(Board, RowDown, Column, 4, OutList3, OutList4),
    isMoveValid(Board, RowUp, ColumnRight, 5, OutList4, OutList5),
    isMoveValid(Board, RowUp, ColumnLeft, 6, OutList5, OutList6),
    isMoveValid(Board, RowDown, ColumnRight, 7, OutList6, OutList7),
    isMoveValid(Board, RowDown, ColumnLeft, 8, OutList7, ListOfMoves).

%Checks if position (Row, Column) is valid
isMoveValid(Board, Row, Column) :-
    getPiece(Row, Column, Board, Piece),
    Piece = 'x'.

%If the movement in a certain direction is valid, that direction is added to the list for valid moves
isMoveValid(Board, Row, Column, Dir, InList, OutList) :-
    (getPiece(Row, Column, Board, Piece),
    Piece = 'x', append(InList, [Dir], OutList));
    append(InList, [], OutList).

%-----------------------------------------------------------

%Board evaluation auxiliary functions

% Checks all conditions that put bot in near victory condition
check2(Board, Player) :-
    checkRow2(Board, Player);
    checkColumn2(Board, Player);
    checkDiagonalNWSE2(Board, Player);
    checkDiagonalNESW2(Board, Player).

% Checks if any row has a two pieces together
checkRow2([H|T], Player) :-
    sublist([Player, Player], H);
    checkRow2(T, Player).

% Checks if any column has a two pieces together
checkColumn2(Board, Player) :-
    getNthPiecePos(Board, Player, Nrow, Ncolumn, 1),
    Nrow2 is Nrow + 1, getPiece(Nrow2, Ncolumn, Board, Piece2), Piece2 = Player.

% Checks if any diagonal has a two pieces together (NW-SE orientation)
checkDiagonalNWSE2(Board, Player) :-
    getNthPiecePos(Board, Player, Nrow, Ncolumn, 1),
    Nrow2 is Nrow + 1, Ncolumn2 is Ncolumn + 1, getPiece(Nrow2, Ncolumn2, Board, Piece2), Piece2 = Player.

% Checks if any diagonal has a two pieces together (NE-SW orientation)
checkDiagonalNESW2(Board, Player) :-
    getNthPiecePos(Board, Player, Nrow, Ncolumn, 1),
    Nrow2 is Nrow + 1, Ncolumn2 is Ncolumn - 1, getPiece(Nrow2, Ncolumn2, Board, Piece2), Piece2 = Player.

%-----------------------------------------------------------

% Game ending conditions

% Checks all conditions that end game
game_over(Board, Player) :-
    (checkRow(Board, Player), display_game(Board), clean_previousBoards, printVictory(Player));
    (checkColumn(Board, Player), display_game(Board),  clean_previousBoards, printVictory(Player));
    (checkDiagonalNWSE(Board, Player), display_game(Board),  clean_previousBoards, printVictory(Player));
    (checkDiagonalNESW(Board, Player), display_game(Board),  clean_previousBoards, printVictory(Player));
    (Player = 'w', checkDraw(Board), display_game(Board), clean_previousBoards, printDraw).

% Checks all conditions that end game without printing
check_game_over(Board, Player, W) :-
    (checkRow(Board, Player), W is 1);
    (checkColumn(Board, Player), W is 1);
    (checkDiagonalNWSE(Board, Player), W is 1);
    (checkDiagonalNESW(Board, Player), W is 1);
    W is 0.


% Checks all victory conditions without displaying anything
checkWin(Board, Player) :-
    checkRow(Board, Player);
    checkColumn(Board, Player);
    checkDiagonalNWSE(Board, Player);
    checkDiagonalNESW(Board, Player).

% Checks if any row has a game ending condition
checkRow([H|T], Player) :-
    sublist([Player, Player, Player], H);
    checkRow(T, Player).

% Checks if any column has a game ending condition
checkColumn(Board, Player) :-
    getNthPiecePos(Board, Player, Nrow, Ncolumn, 1),
    Nrow2 is Nrow + 1, getPiece(Nrow2, Ncolumn, Board, Piece2), Piece2 = Player,
    Nrow3 is Nrow + 2, getPiece(Nrow3, Ncolumn, Board, Piece3), Piece3 = Player.

% Checks if any diagonal has a game ending condition (NW-SE orientation)
checkDiagonalNWSE(Board, Player) :-
    getNthPiecePos(Board, Player, Nrow, Ncolumn, 1),
    Nrow2 is Nrow + 1, Ncolumn2 is Ncolumn + 1, getPiece(Nrow2, Ncolumn2, Board, Piece2), Piece2 = Player, 
    Nrow3 is Nrow + 2, Ncolumn3 is Ncolumn + 2, getPiece(Nrow3, Ncolumn3, Board, Piece3), Piece3 = Player.

% Checks if any diagonal has a game ending condition (NE-SW orientation)
checkDiagonalNESW(Board, Player) :-
    getNthPiecePos(Board, Player, Nrow, Ncolumn, 1),
    Nrow2 is Nrow + 1, Ncolumn2 is Ncolumn - 1, getPiece(Nrow2, Ncolumn2, Board, Piece2), Piece2 = Player, 
    Nrow3 is Nrow + 2, Ncolumn3 is Ncolumn - 2, getPiece(Nrow3, Ncolumn3, Board, Piece3), Piece3 = Player.

% Checks if the same position occurred for the third time. If it did, then the game is declared a draw. 
checkDraw(Board) :-
    previousBoards(N1, Board),
    previousBoards(N2, Board),
    N1 \= N2.

%-----------------------------------------------------------

% Prints the Win of the player
printVictory('b') :-
    display_border(30),
    put_code(0x2503),
    write('    BLACK WINS     '),
    put_code(0x2503),
    write('\n'),
    display_border(30).
    
printVictory('w'):-
    display_border(30),
    put_code(0x2503),
    write('    WHITE WINS     '),
    put_code(0x2503),
    write('\n'),
    display_border(30).    

printDraw :-
    display_border(30),
    put_code(0x2503),
    write('       DRAW        '),
    put_code(0x2503),
    write('\n'),
    display_border(30).
