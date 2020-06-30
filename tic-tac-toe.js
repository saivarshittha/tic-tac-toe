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

	if(typeof gameBoard[cellInBoard.target.id] === 'number'){

		turn(cellInBoard.target.id,player);

		if(gameTie() === false){
			turn(findBestSpot(),computerPlayer);
		}
	}
}

function turn(cellId,thePlayer){
		gameBoard[cellId] = thePlayer;
		document.getElementById(cellId).innerText = thePlayer;
		let isGameWon = checkWin(gameBoard,thePlayer);
		if(isGameWon) gameFinished(gameWon);

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

function gameFinished(gameWon){
	// have to add code to set the background color based on who won the game
	let bestMove;

	for(let i = 0 ; i < cells.length ; i++){
		cells[i].removeEventListener('click',allowClick,false);
	}

	if(gameWon.player === player)
	{
		
		 document.querySelector(".endgame").style.display = "block";
  		 document.querySelector(".endgame .text").innerText = "You won";
	}
	else
		{

		 document.querySelector(".endgame").style.display = "block";
  		 document.querySelector(".endgame .text").innerText = "You lose";

		}
}
/*function evaluate(board,thePlayer,emptySlots){

	if(checkWin(board,thePlayer)){
		return -10;
	} else if(checkWin(board,computerPlayer)){
		return 10;
	} else if(emptySlots.length === 0){
		return 0;
	}
}*/

function findBestSpot(){
	return minimax(gameBoard,computerPlayer).index;
}
function minimax(board,thePlayer){

	let scoresOfMoves = [];

	let emptySlots = vacantSquares(board);

	//let score = evaluate(board,thePlayer,emptySlots);
	if(emptySlots.length === 0 || !checkWin(board,player) || !checkWin(board,computerPlayer))
	{
		return{score : 0}
	}
	else
	{
		if(checkWin(board,thePlayer)) return{score : -10};
		else if(checkWin(board.computerPlayer)) return{score : 10};
		/*checkWin(board,thePlayer)? return{score: -10} : return{score : 10};*/
	}
	

	for(let i = 0 ; i < emptySlots.length ; i++){

		let tempMove = {};
		tempMove.index = board[emptySlots[i]];
		board[emptySlots[i]] = theplayer;

		if(thePlayer === player){

			let result = minimax(board,computerPlayer);
			tempMove.score = result.score;
		}else if(player === computerPlayer){
			let result = minimax(board,computerPlayer);
			tempMove.score = result.score;
		}

		board[emptySlots[i]] = tempMove.index;
		scoresOfMoves.push(tempMove);
	}
	
	if(player === computerPlayer){
		let bestScore = -999999;
		for(let i = 0 ; i < scoresOfMoves.length ; i++){
			if(scoresOfMoves[i].score > bestScore ){
				bestScore = scoresOfMoves[i].score;
				bestMove = i ;
			}

		}
	} else {
		let bestScore = 999999;
		for(let i = 0 ; i < scoresOfMoves.length ; i++){
			if(scoresOfMoves[i].score < bestScore){
				bestScore = scoresOfMoves[i].score;
				bestMove = i;
			}
		}
	}
	
	return scoresOfMoves[bestMove];
}
