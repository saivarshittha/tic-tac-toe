let gameBoard; //Array that puts track of what is present in each cell.
let computerPlayer = 'O';
let humanPlayer = 'X';
let player1 = 'o';
let player2 = 'x';
let flag = 1;
let count = 0;
let lastTurned = 'x';
let winningCombinations = [ [0,3,6] , [1,4,7] , [2,5,8] , [0,1,2] , [3,4,5] , [6,7,8] , [6,4,2] , [0,4,8] ];
let undo = [];
const cells = document.querySelectorAll('.cell');

/*Function for single player game*/
function newGame() {
	undo = [];
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


/*Function for two player game*/
function twoPlayerGame(){
	undo = [];
	count = 0;
	flag = 2;
	document.querySelector(".endgame").style.display = "none";
	gameBoard = [0, 1, 2, 3, 4, 5, 6, 7, 8]; //Initialising gameBoard
	let i = 0 ;
	while(i < cells.length){
		cells[i].style.removeProperty('background-color');
		cells[i].innerText = '';
		cells[i].addEventListener('click', allowClick, false);
		i++;
	}

}

/*Defining allowClick function*/
function allowClick(cellInBoard) {
	if (typeof gameBoard[cellInBoard.target.id] == 'number'&& flag === 1) {
		turn(humanPlayer,cellInBoard.target.id);
		if (!gameTie() && !checkWin(gameBoard, humanPlayer))
		 turn(computerPlayer,minimax(gameBoard, computerPlayer).index);
	}
	else if (typeof gameBoard[cellInBoard.target.id] == 'number' && flag === 2 && count < cells.length){
		if(lastTurned === 'x'){
			gameTie();
			if(!gameTie() && !checkWin(gameBoard,player1))turn(player1,cellInBoard.target.id);
			lastTurned = 'o';			
		}else if(lastTurned === 'o'){
			gameTie();
			if(!gameTie() && !checkWin(gameBoard,player1))turn(player2,cellInBoard.target.id);			
			lastTurned = 'x';
		}
		count++;	
		if(checkWin(gameBoard,player1)){
		document.querySelector(".endgame").style.display = "block";
		document.querySelector(".endgame .text").innerText = "Player1 won!!";
		}else if(checkWin(gameBoard,player1)){
		document.querySelector(".endgame").style.display = "block";
		document.querySelector(".endgame .text").innerText = "Player2 won!!";
		}else gameTie();


	}
}
function hint(){
	if (flag ===1 && !gameTie() && !checkWin(gameBoard, computerPlayer)){
		let x = minimax(gameBoard, humanPlayer).index;
		alert(x);
	}/*else if(flag === 2 && !gameTie()){
		if(count % 2 === 0 &&  !checkWin(gameBoard,player2)){
			let x =  minimax(gameBoard, player1).index;
			alert(x);
		}else if(count % 2 === 1 &&  !checkWin(gameBoard,player1)){
			let x =  minimax(gameBoard, player2).index;
			alert(x);
		}

	}*/		
}

/*Defining turn function*/
function turn(player,cellId) {
	gameBoard[cellId] = player;
	undo.push([player,cellId]);
	document.getElementById(cellId).innerText = player;
	let isGameWon = checkWin(gameBoard, player)
	if (isGameWon) gameFinished(isGameWon)
}
function check(){
	if(flag === 1){
		if(!gameTie() && !checkWin(gameBoard,humanPlayer) && !checkWin(gameBoard,computerPlayer)) return true;
	}else if(flag === 2){
		if(!gameTie() && !checkWin(gameBoard,player1) && !checkWin(gameBoard,player2)) return true;
	}
	return false;
}
function undo_func(){
	if(check()){
		document.querySelector(".endgame").style.display = "none";
		if(flag === 1){
			let lastPlayer = undo.pop();
			let x = lastPlayer[1]; 
			cells[x].innerText = '';
			gameBoard[x] = Number(x);	
			cells[x].addEventListener('click', allowClick, false);

			let lastButOnePlayer = undo.pop();
			let y = lastButOnePlayer[1];
			cells[y].innerText = '';
			gameBoard[y] = Number(y);					
			cells[y].addEventListener('click', allowClick, false);	
   
		}
		else if(flag == 2){
			let lastPlayer = undo.pop();
			count--;
			let x = lastPlayer[1];
			let y = lastPlayer[0];
			/*alert(y);
			alert(typeof y);*/
			if(y=="o")lastTurned='x';
				else lastTurned='o';
			cells[x].innerText = '';
			gameBoard[x] = Number(x);
		    cells[x].addEventListener('click', allowClick, false);	
		}
	}

}


/*Function to check if a player has won*/
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

/*Function to check if there is a tie in game*/
function gameTie() {
	if (vacantSquares().length == 0) {
		for (let i = 0; i < cells.length; i++) {
			cells[i].style.backgroundColor = " #ffccff";
			cells[i].removeEventListener('click', allowClick, false);
		}
		document.querySelector(".endgame").style.display = "block";
		document.querySelector(".endgame .text").innerText = "Game Tie.";
		return true;
	}
	return false;
}

/*Function to check if Game is over*/
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

/*This function filters all the vacant cells out*/
function vacantSquares() {
	let filteredList = gameBoard.filter(elem => typeof elem == 'number');
	return filteredList;
}

/*Minimax algorithm*/
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

function on() {
   document.getElementById("overlay").style.display = "block";
}

function off() {
    document.getElementById("overlay").style.display = "none";
}