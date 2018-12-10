%Gets coordinates from piece that is going to be moved and validates them.

getMovingPiece(Board, Row, Column, Player) :-
    repeat,
    readRow(Row),
    readColumn(Column),
    getPiece(Row, Column, Board, Piece),
    validatePiece(Board, Row, Column, Piece, Player).
        
%Gets row from user, converts it to 1-5 and checks if it is valid

readRow(Row) :-
    repeat,
    write('Enter the row of the piece you want to move (1-5): '),  
    get_code(Input),
    skip_line,  
    validateRow(Input, Row) , !.

%Input = 1
validateRow(49, 1) :- !.

%Input = 2
validateRow(50, 2) :- !.

%Input = 3
validateRow(51, 3) :- !.

%Input = 4
validateRow(52, 4) :- !.

%Input = 5
validateRow(53, 5) :- !.

%Input is invalid
validateRow(_,Row) :-
    write('\nRow is invalid. Try again.\n'),
    fail.

%Gets column from user, converts it to number (1-5) and checks if it is valid

readColumn(Column) :-
    repeat,
    write('Enter the column of the piece you want to move (a-e): '),
    get_code(Input),
    skip_line,
    validateColumn(Input, Column), !.  

%Input = a
validateColumn(97, 1) :- !.

%Input = b
validateColumn(98, 2) :- !.

%Input = c
validateColumn(99, 3) :- !.

%Input = d
validateColumn(100, 4) :- !.

%Input = e
validateColumn(101, 5) :- !.

%Input is invalid
validateColumn(_, Column) :-
    write('\nColumn is invalid. Try again.\n'),
    fail.

%-----------------------------------------------------------

%Checks if piece belong to current player and if there are valid moves

%Piece selected is valid
validatePiece(Board, Row, Column, Piece, Player) :-
    Piece = Player,
    valid_moves(Board, Row, Column, ListOfMoves),
    length(ListOfMoves, Length),
    hasValidMoves(Length),
    write('\nPiece selected\n\n'), !.

%Piece selected is invalid
validatePiece(Board, Row, Column, Piece, Player) :-
    Piece \= Player,
    write('\nPiece selected is invalid. Try again.\n\n'),
    fail.

%Piece selected doesnt have valid moves
hasValidMoves(Length) :-
    Length > 0.

%Piece selected has valid moves
hasValidMoves(Length) :-
    Length = 0,
    write('\nPiece selected is invalid. Try again.\n\n'),
    fail.
%-----------------------------------------------------------


%-----------------------------------------------------------

%Gets direction of movement from user and validates it

readDirection(ListOfMoves, Direction) :-
    printDirections(ListOfMoves),
    repeat,
    write('Enter the desired direction: '),
    get_code(Input),
    skip_line,  
    validateDirection(Input, Direction, ListOfMoves), !.

%Input = 1, Direction = North
validateDirection(49, 1, ListOfMoves) :- sublist([1], ListOfMoves), !.

%Input = 2, Direction = West
validateDirection(50, 2, ListOfMoves) :- sublist([2], ListOfMoves), !.

%Input = 3, Direction = East
validateDirection(51, 3, ListOfMoves) :- sublist([3], ListOfMoves), !.

%Input = 4, Direction = South
validateDirection(52, 4, ListOfMoves) :- sublist([4], ListOfMoves), !.

%Input = 5, Direction = Northeast
validateDirection(53, 5, ListOfMoves) :- sublist([5], ListOfMoves), !.

%Input = 6, Direction = Northwest
validateDirection(54, 6, ListOfMoves) :- sublist([6], ListOfMoves), !.

%Input = 7, Direction = Southeast
validateDirection(55, 7, ListOfMoves) :- sublist([7], ListOfMoves), !.

%Input = 8, Direction = Southwest
validateDirection(56, 8, ListOfMoves) :- sublist([8], ListOfMoves), !.

%Input is invalid
validateDirection(_, Direction, ListOfMoves) :-
    write('\nDirection is invalid. Try again.\n'),
    fail.

%Displays directions. 

printDirections(ListOfMoves) :-
    write('DIRECTION\n\n'),
    printDir(1, 'North', ListOfMoves),
    printDir(2, 'West', ListOfMoves),
    printDir(3, 'East', ListOfMoves),
    printDir(4, 'South', ListOfMoves),
    write('\n'),
    printDir(5, 'Northeast', ListOfMoves),
    printDir(6, 'Northwest', ListOfMoves),
    printDir(7, 'Southeast', ListOfMoves),
    printDir(8, 'Southwest', ListOfMoves),
    write('\n').

%If a direction is in the list of valid moves, then it is displayed as valid, otherwise it is not valid

printDir(Number, Direction, ListOfMoves) :-
    (sublist([Number], ListOfMoves),
    format('~w - ', Number),
    format('~w   ', Direction));
    (format('~w not valid   ', Direction)).

%-----------------------------------------------------------
