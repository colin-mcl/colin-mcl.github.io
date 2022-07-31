/* script.js
 *
 * Colin Mclaughlin
 * July 2022
 *
 * This script implements a game of tic-tac-toe. Using a board represented as a
 * 2D array of chars, the game implements a minimax algorithm. The algorithm
 * decides which move it should make by evaluating the possible outcomes of
 * each move. It does this by assigning a score based on if a move will lead
 * to a win, loss or tie. Then the algorithm selects the move which will
 * minimize or maximize its score (depending on if it is playing X or O).
 */

let user = ''; //the user's letter
let cpu = ''; //the computer's letter
let board = [
            ['-', '-', '-'],
            ['-', '-', '-'],
            ['-', '-', '-']
            ];
let cpuMaximizing = undefined;
            

/* startGame
 *
 * Input: char xOrO--the user's letter
 * Functionality: displays the playing board and hides the start game buttons
 */
function startGame(xOrO) {
    var table = document.getElementById("board");
    table.style.display = "block";
    
    var buttons = document.getElementById('start-buttons');
    buttons.style.display = "none";

    user = xOrO;
    cpu = (xOrO === 'X') ? 'O' : 'X';
    
    cpuMaximizing = (cpu === 'X') ? true : false;
    
}

/* show
 * Input: button square, num row and col
 * Functionality: disables the ability to select that square and displays the
 *                X/O in the square
 */
function show(square, row, col) {
    square.disabled = true; 
    
    square.innerHTML = user;
    board[row][col] = user;
    
    
    if (!movesLeft() || evaluate() != 0)
        gameOver();
    else
        cpuMove();
    
}

/* cpuMove
 *
 * Functionality: selects the best CPU move using the minimax algorithm and
 *                makes that move by displaying the CPU's letter and disabling
 *                the square
 */
function cpuMove() {

    let cpuSquare = findBestMove(cpuMaximizing);
    
    const row = cpuSquare.row;
    const col = cpuSquare.col;
    board[row][col] = cpu;
    
    let table = document.getElementById('board');
    let tRow = table.getElementsByTagName('tr');
    let square = tRow[row].getElementsByTagName('td')[col];
    let button = square.getElementsByTagName('button')[0];

    button.disabled = true;
    button.innerHTML = cpu;

    if (!movesLeft() || evaluate() != 0)
        gameOver();

}

/* gameOver()
 *
 * Functionality: disables the playing board and displays game over message
 */
function gameOver() {
    let buttons = document.getElementsByClassName('square');
    for (button of buttons) {
        button.disabled = true; //disables the squares of the board
    }

    let overBox = document.getElementById('game-over');
    let message = document.getElementById('message');
    const score = evaluate()

    if (!movesLeft() && score === 0) { //tie
        message.innerHTML = "It's a tie!";
    } else if ((cpuMaximizing && score > 0) || (!cpuMaximizing && score < 0)) {
        message.innerHTML = "I win, you lose!"; //cpu wins
    } else {
        message.innerHTML = "You win!"; //user wins
    }
    
    overBox.style.display = "flex";
}


/* restart()
 *
 * Functionality: hides the game over message and the playing board, resets
 *                variables to default values and shows the start game buttons
 */
function restart() {
    let overBox = document.getElementById('game-over');
    overBox.style.display = 'none';
    
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            board[i][j] = '-'; //clear the board
        }
    }
    cpuMaximizing = undefined;
    cpu = '';
    user = '';

    
    let table = document.getElementById('board');
    table.style.display = 'none'; //hide the board
    
    let squares = document.getElementsByClassName('square')
    
    for (square of squares) {
        square.disabled = false; //enable and clear the board squares
        square.innerHTML = '';
    }
    
    var startButtons = document.getElementById('start-buttons');
    startButtons.style.display = "flex";
}


/* evaluate
 *
 * Functionality: determines the value of the board for use in the minimax
 *                algorithm
 *
 * Output: returns 10 if X has won the board, -10 if O has won the board and 0
 *         if the game is not in a winning state
 */
function evaluate() {
    //check if any rows are filled
    for (let row = 0; row < 3; row++) {
        if (board[row][0] === board[row][1] && board[row][1] === board[row][2])
        {
            if (board[row][0] === "X")
                return 10;
            else if (board[row][0] === "O")
                return -10;
        }
    }
    
    //check if any columns are filled
    for (let col = 0; col < 3; col++) {
        if (board[0][col] === board[1][col] && board[1][col] === board[2][col])
        {
            if (board[0][col] === "X")
                return 10;
            else if (board[0][col] === "O")
                return -10;
        }
    }
    
    //check if the diagonals are filled
    if (board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
        if (board[0][0] === "X")
            return 10;
        else if (board[0][0] === "O")
            return -10;
    }
    
    if (board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
        if (board[0][2] === "X")
            return 10;
        else if (board[0][2] === "O")
            return -10;
    }
    
    return 0;
    
}

/* movesLeft()
 *
 * Functionality: determines if there are moves left to be made on the board
 *
 * Output: true if there is a possible move remaining, false if there are none
 */
function movesLeft() {
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            if (board[row][col] === '-')
                return true;
        }
    }
    
    return false;
}


/* minimax()
 *
 * Functionality: implements the minimax algorithm to evaluate all possible
 *                 ways the game can go and return the score
 */
function minimax(depth, maximizing) {
    const score = evaluate();
    
    //if either player has won, the game is over and return the value of the board
    if (score === 10)
        return score - depth;
    else if (score === -10)
        return score + depth;
    else if (!movesLeft()) //if we are in a tied situation return 0
        return 0;
    
    if (maximizing) {
        let bestScore = -100;
        
        //evaluate every possible move on the board
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                
                if (board[row][col] === '-') { //if there is an open square
    
                    board[row][col] = 'X'; //make the move, check if it is better and undo
                    bestScore = Math.max(bestScore, minimax(depth + 1, !maximizing));
                    board[row][col] = '-';
                }
                
            }
        }
        
        return bestScore;
    }
    else {
        let bestScore = 100;
        
        //evaluate every possible move on the board
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                
                if (board[row][col] === '-') {
                    board[row][col] = 'O';
                    bestScore = Math.min(bestScore, minimax(depth + 1, !maximizing));
                    board[row][col] = '-';
                }
                
            }
        }

        return bestScore;
    }

}

function findBestMove(maximizing) {
    let bestMove = {row: -1, col: -1};
    
    if (maximizing) {
        let bestScore = -100;
        
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                
                if (board[row][col] === '-') { //there is an open square
                    board[row][col] = 'X'; //place an X in the square
                    
                    moveScore = minimax(0, !maximizing); // evaluate the outcome of the move 
                    board[row][col] = '-';
                    
                    //if that move is better than the current best, update bestMove
                    if (moveScore > bestScore) {
                        bestScore = moveScore;
                        bestMove.row = row;
                        bestMove.col = col;
                    }
                }
                
            }
        }
    }
    else {
        let bestScore = 100;
        
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                
                if (board[row][col] === '-') {
                    board[row][col] = 'O';
                    
                    moveScore = minimax(0, !maximizing);
                    board[row][col] = '-';
                    
                    if (moveScore < bestScore) {
                        bestScore = moveScore;
                        bestMove.row = row;
                        bestMove.col = col;
                    }
                }
                
            }
        }
    }
    
    return bestMove;
}
