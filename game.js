/*Variáveis de jogo*/
var mode,
	choice = 7, 
	P1_index, P2_index, 
	p1Wins = 0, 
	p2Wins = 0, 
	extraTurn=false;


/*Initiate game*/

function newGame(){
	mode = tabuleiro.mode;
	let turnInfo = document.getElementById("turn_info");
	if(mode==="P2"){
		turnInfo.innerHTML = tabuleiro.type + " turn";
		cpuMove();
	}
	else{
		turnInfo.innerHTML = "Player 1's turn";
	}
}

function checkForOver(board){
	let resultP1=totalPoints(board,0,P1_index);
	let resultP2=totalPoints(board,(+P1_index+1), P2_index);
	
	if(resultP1==0 || resultP2==0) return true;
	return false;
}

/*Player turn events*/

function p1Move(state){

	if(tabuleiro.board[state]!=0 ){
		updateSeeds(state, tabuleiro.board[state], "P1", tabuleiro.board);
		updateBoard();
		document.getElementById('score-player1').innerHTML = tabuleiro.board[P1_index];
		if(!checkForOver(tabuleiro.board)){
			if(!extraTurn){
			//p2 turn
			mode = "P2";
			cpuMove();
			}
			extraTurn = false;
		}
		else{
			tabuleiro.board[P1_index] += totalPoints(tabuleiro.board,0,P1_index);
			tabuleiro.board[P2_index] += totalPoints(tabuleiro.board,(+P1_index+1),P2_index);
			showRecords(gameOver(tabuleiro.board));
		}
	}
}

function cpuMove(){

	let turnInfo = document.getElementById("turn_info");
	turnInfo.innerHTML = "Player 2's turn";
	tempBoard = [...tabuleiro.board];
	minimax(tempBoard, 0);
	
	var state = choice;
	

	updateSeeds(state, tabuleiro.board[state], "P2", tabuleiro.board);

	updateBoard();

	
	document.getElementById('score-player2').innerHTML = tabuleiro.board[P2_index];
	
	if(!checkForOver(tabuleiro.board)){
		if(!extraTurn){
			mode = "P1";
			turnInfo.innerHTML = "Player 1's turn";
		}
		else{
			mode = "P2";
			extraTurn = false;
			cpuMove();
		}
	}
	else{
		tabuleiro.board[P1_index] += totalPoints(tabuleiro.board,0,P1_index);
		tabuleiro.board[P2_index] += totalPoints(tabuleiro.board,(+P1_index+1),P2_index);
		showRecords(gameOver(tabuleiro.board));
	}
}


/*Minmax algorithm*/

function minimax(board, depth){
	if(checkForOver(board) || depth>=tabuleiro.difficulty)	return scoreMinMax(board, depth);
	
	let scores = new Array();
	let moves = new Array();
	let possible_board, move;
	depth++;
	for(i=0; i<tabuleiro.number_cavities; i++){
		move = legalMove(i, board);
		if(move==-1) continue;
		possible_board = getNewState(move, board);
		scores.push(minimax(possible_board, depth));
		moves.push(move);	
	}
	
	let max_score, max_score_state, min_score, min_score_state;
	if(mode==="P2"){
		max_score = Math.max.apply(Math, scores);
		max_score_state = scores.indexOf(max_score);
		choice = moves[max_score_state];
		return max_score;
	}
	else{
		min_score = Math.min.apply(Math, scores);
		min_score_state = scores.indexOf(min_score);
		choice = moves[min_score_state];
		return min_score;
	}
}

function getNewState(move, tempBoard){
	const board = updateSeeds(move, tempBoard[move], mode, tempBoard);
	if(!extraTurn) changeMode();
	extraTurn = false;
	return board;
}

function legalMove(move, board){
	if(mode=="P2") move = 1*i+1*P1_index+1;
	else					move = i;
	
	if(board[move]==0 || move==P1_index || move==P2_index) return -1;
	return move;
	
}

function changeMode(){
	if(mode==="P1") mode="P2";
	else			mode="P1";
}
	
function scoreMinMax(board, depth){
	const score = gameOver(board);
	console.log("depth: "+depth);
	if(score==1) return 10-depth;
	else if(score==2) return depth-10;
	else		return 0;
}

/*Finish game event*/

function totalPoints(board, start, end){
	let result=0;
	for(i=start; i<end; i++)
		result = result+1*board[i]; //1*board to force addition not concatenation
	return result;
}

function gameOver(board){
	if(board[P1_index] < board[P2_index]) return 1; //P2 wins 
	else if(board[P1_index] > board[P2_index]) return 2; //P1 wins
	else return 3; //Tie
}

