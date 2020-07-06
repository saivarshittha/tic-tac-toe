let gameBoard;
let computerPlayer = 'O';
let humanPlayer = 'X';
let player1 = 'o';
let player2 = 'x';
let flag = 1;
let flag1 =1;
let count = 0;
let winningCombinations = [ [0,3,6] , [1,4,7] , [2,5,8] , [0,1,2] , [3,4,5] , [6,7,8] , [6,4,2] , [0,4,8] ];
const cells = document.querySelectorAll('.cell');
function twoPlayerGame(){
	count = 0;
	flag = 2;
	document.querySelector(".endgame").style.display = "none";
	gameBoard = [0, 1, 2, 3, 4, 5, 6, 7, 8];
	let i = 0 ;
	while(i < cells.length){
		cells[i].style.removeProperty('background-color');
		cells[i].innerText = '';
		cells[i].addEventListener('click', allowClick, false);
		i++;
	}
	
}
function newGame() {
	//alert("x");
	flag = 1;
	document.querySelector(".endgame").style.display = "none";
	gameBoard = [0, 1, 2, 3, 4, 5, 6, 7, 8];
	let i = 0 ;
	while(i < cells.length){
		cells[i].style.removeProperty('background-color');
		cells[i].innerText = '';
		cells[i].addEventListener('click', allowClick, false);
		i++;
	}
}

function allowClick(cellInBoard) {
	if (typeof gameBoard[cellInBoard.target.id] == 'number' && flag === 1) {
		turn(humanPlayer,cellInBoard.target.id);
		if (!gameTie() && !checkWin(gameBoard, humanPlayer))
		 turn(computerPlayer,minimax(gameBoard, computerPlayer).index);
	}
	else if (typeof gameBoard[cellInBoard.target.id] == 'number' && flag === 2 && count < cells.length){
		if(count % 2 === 0){
			if(!gameTie())turn(player1,cellInBoard.target.id);
			gameTie();
		}
		else{

			if(!gameTie())turn(player2,cellInBoard.target.id);
			gameTie();
		}
		count++;		
	 
	}
}

function turn(player,cellId) {
	gameBoard[cellId] = player;
	document.getElementById(cellId).innerText = player;
	let isGameWon = checkWin(gameBoard, player)
	if (isGameWon) gameFinished(isGameWon)
}

function checkWin(board, player) {
	let plays = board.reduce((a, e, i) =>
		(e === player) ? a.concat(i) : a, []);
	let gameWon = null;
	for (let [index, win] of winningCombinations.entries()) {
		if (win.every(s => plays.indexOf(s) > -1)) {
			gameWon = {index: index, player: player};
			break;
		}
	}
	return gameWon;
}

function gameTie() {
	if (vacantSquares().length == 0) {
		for (let i = 0; i < cells.length; i++) {
			cells[i].style.backgroundColor = "green";
			cells[i].removeEventListener('click', allowClick, false);
		}
		document.querySelector(".endgame").style.display = "block";
		document.querySelector(".endgame .text").innerText = "Game Tie.";
		return true;
	}
	return false;
}

function gameFinished(gameWon) {
	for (let index of winningCombinations[gameWon.index]) {
			if(gameWon.player == humanPlayer){
				document.getElementById(index).style.backgroundColor = "red";
			} else if (gameWon.player == computerPlayer){
				document.getElementById(index).style.backgroundColor = "blue";
			}
	}
	let i = 0 ;
	while(i < cells.length){
		cells[i].removeEventListener('click', allowClick, false);
		i++;
	}
	if(gameWon.player == humanPlayer){
		document.querySelector(".endgame").style.display = "block";
		document.querySelector(".endgame .text").innerText = "You Won!";
	} else if(gameWon.player == computerPlayer) {
		document.querySelector(".endgame").style.display = "block";
		document.querySelector(".endgame .text").innerText = "You lose..";
	}else if(gameWon.player == player1){
		document.querySelector(".endgame").style.display = "block";
		document.querySelector(".endgame .text").innerText = "Player1 won!!";		
	} else if(gameWon.player == player2){
		document.querySelector(".endgame").style.display = "block";
		document.querySelector(".endgame .text").innerText = "Player2 won!!";
	}

}

function vacantSquares() {
	let filteredList = gameBoard.filter(elem => typeof elem == 'number');
	return filteredList;
}

function minimax(board, player) {
	let emptySlots = vacantSquares();
	let scoresOfMoves = [];
	let bestMove;

	if (checkWin(board,computerPlayer)) {
		return {score: 10};
	} else if (checkWin(board, humanPlayer)) {
		return {score: -10};
	} else if (emptySlots.length === 0) {
		return {score: 0};
	}

	for (let i = 0; i < emptySlots.length; i++) {
		let tempMove = {};
		tempMove.index = board[emptySlots[i]];
		board[emptySlots[i]] = player;

		if (player == computerPlayer) {
			let result = minimax(board, humanPlayer);
			tempMove.score = result.score;
		} else {
			let result = minimax(board, computerPlayer);
			tempMove.score = result.score;
		}

		board[emptySlots[i]] = tempMove.index;
		if((player === computerPlayer && tempMove.score === 10) || (player === humanPlayer && tempMove.score === -10))
			return tempMove;
		else
		scoresOfMoves.push(tempMove);
	}

	if(player === computerPlayer) {
		let bestScore = -99999;
		for(let i = 0; i < scoresOfMoves.length; i++) {
			if (scoresOfMoves[i].score > bestScore) {
				bestScore = scoresOfMoves[i].score;
				bestMove = i;
			}
		}
	} else {
		let bestScore = 99999;
		for(let i = 0; i < scoresOfMoves.length; i++) {
			if (scoresOfMoves[i].score < bestScore) {
				bestScore = scoresOfMoves[i].score;
				bestMove = i;
			}
		}
	}

	return scoresOfMoves[bestMove];
}
