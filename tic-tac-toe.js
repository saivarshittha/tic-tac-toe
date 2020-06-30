let player = 'X';
let computerPlayer = 'O';
let gameBoard;   

let winningCombinations = [ [0,3,6] , [1,4,7] , [2,5,8] , [0,1,2] , [3,4,5] , [6,7,8] , [6,4,2] , [0,4,8] ];

const cells = document.querySelectorAll('.cell');

newGame();

function newGame(){

	document.querySelector(".endgame").style.display = "none";
	gameBoard = [0, 1, 2, 3, 4, 5, 6, 7, 8];
	for(let i = 0 ; i < cells.length ; i++){
		cells[i].style.removeProperty('background-color');
		cells[i].innerText = '';
		cells[i].addEventListener('click',allowClick,false);
	}
}

function allowClick(cellInBoard){

	if(typeof gameBoard[cellInBoard.target.id] === 'number'){\

		turn(cellInBoard.target.id,player);

		if(gameTie() === false){
			turn(bestMove(),computerPlayer);
		}
	}
}

function vacantSquares(){

	let temp = gameBoard.filter( cellVal => typeof cellVal === 'number');
	return temp;
}

function checkWin(board,thePlayer){

	let plays = [];
	for(let i = 0 ; i < board.length ; i++){
		let temp = board[i];
		if(temp === thePlayer){
			plays = plays.concat(i);
		}
	}

	let gameWon = null;

	for(let [index,win] of winningCombinations.entries()){

		if(win.every(s => plays.indexOf(s) > -1)){
			gameWon = {index: index, player : thePlayer};
			break;
		}

	}
    return gameWon;	
}

function gameTie(){

	if(vacantSquares().length === 0){

		for(let i = 0 ; i < cells.length ; i++){
			cells[i].removeEventListener('click', allowClick, false);
		}

		declareResult("Game Tie!");
		return true;
	}

	return false;
}