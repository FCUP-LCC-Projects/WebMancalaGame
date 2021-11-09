var tabuleiro = {
	number_seeds: 4,
	number_cavities: 6, //COLUMNS
	total_cavities: 14,
	difficulty: 1,
	type: "CPU",
	//board [[(number_cavities p1)], P1 Buraco, [number_cavities p2], P2 Buraco]
}



/*
A FAZER:
METER BOARD NÃO GLOBAL
CERTIFICAR QUE QUANDO ACABA AS SEMETES NO BOARD SÃO RECOLHIDAS ANTES DA CONTAGEM
SHOW RANKING
CONFIRMAR SE MINMAX TA BEM
*/


var mode = "P1";
var choice, P1_index, P2_index, p1Wins = 0, p2Wins = 0;

function newGame(){
	let turnInfo = document.getElementById("turn_info");
	if(mode==="P2"){
		turnInfo.innerHTML = tabuleiro.type + " turn";
		cpuMove();
	}
	else{
		turnInfo.innerHTML = "Player 1's turn";
	}
}

function updateSeeds(state, seeds, mode, board){
	board[state++]  = 0;
	
	while(seeds > 1){
		if(state == P1_index && mode==="P2") state++;
		else if(state == P2_index && mode==="P1") state = 0;
		else{
			
			board[state++]++; // certificar se não atualiza o state antes de atualizar o valor de board[state]
			seeds--;
		}
		if(state == tabuleiro.total_cavities) state = 0;
	}
	
	if(mode==="P1" && state==P1_index) {board[state++]++; seeds--;} //+1 turn P1
	else if(mode==="P2" && state==P2_index) {board[state++]++; seeds--;} //+1 turn P2
	else if(board[state]==0){
		seeds--;
		board[state] += 1 + board[P2_index - 1 - state]; //estado atual + ultima semente + semente do lado oposto
		board[P2_index - 1 - state] = 0;
	}
	else{
		board[state++]++; 
		seeds--;
	}
	return board;
}


function p1Move(state){
	if(tabuleiro.board[state]!=0 ){
		updateSeeds(state, tabuleiro.board[state], "P1", tabuleiro.board);
		updateBoard();
		if(!checkForOver(tabuleiro.board)){
			//p2 turn
			mode = "P2";
			cpuMove();
		}
		else{
			tabuleiro.board[P1_index] += totalPoints(tabuleiro.board,0,P1_index);
			tabuleiro.board[P2_index] += totalPoints(tabuleiro.board,(+P1_index+1),P2_index);
			showRecords();
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
	choice = []
	mode = "P1";
	if(!checkForOver(tabuleiro.board)){
		turnInfo.innerHTML = "Player 1's turn";
	}
	else{
		tabuleiro.board[P1_index] += totalPoints(tabuleiro.board,0,P1_index);
		tabuleiro.board[P2_index] += totalPoints(tabuleiro.board,(+P1_index+1),P2_index);
		showRecords();
	}
}

function totalPoints(board, start, end){
	let result=0;
	for(i=start; i<end; i++)
		result = result+1*board[i]; //1*board to force addition not concatenation
	return result;
}

function checkForOver(board){
	let resultP1=totalPoints(board,0,P1_index);
	let resultP2=totalPoints(board,(+P1_index+1), P2_index);
	
	if(resultP1==0 || resultP2==0) return true;
	return false;
}

function showRecords(){
	var score = gameOver(tabuleiro.board);
	var turnInfo = document.getElementById('turn_info');
	if(score==1){
		turnInfo.innerHTML = tabuleiro.type + " wins. Better luck next time!";
		p2Wins++;
	}
	else if(score==2){
		turnInfo.innerHTML = "You won! Congratulations!";
		p1Wins++;
	}
	else	turnInfo.innerHTML = "It's a tie.";
	
	//add score to rankings which should be a pre-set table to which you only add a tr with createelement or whatever 
	const rankings = document.getElementById('ranking');
	rankings.style.display="block";
	const row = rankings.insertRow(-1);
	var p1Score = row.insertCell(0);
	var p2Score = row.insertCell(1);
	var wins = row.insertCell(2);
	
	p1Score.innerHTML = tabuleiro.board[P1_index];
	p2Score.innerHTML = tabuleiro.board[P2_index];
	wins.innerHTML = p1Wins + " - " + p2Wins;
	clearTable();
}

function gameOver(board){
	if(board[P1_index] < board[P2_index]) return 1; //P2 wins 
	else if(board[P1_index] > board[P2_index]) return 2; //P1 wins
	else return 3; //Tie
}

function getNewState(move, tempBoard){
	const board = updateSeeds(move, tempBoard[move], mode, tempBoard);
	changeMode();
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
	var score = gameOver(board);
	if(score==1) return 10-depth;
	else if(score==2) return depth-10;
	else		return 0;
}

function minimax(board, depth){
	if(checkForOver(board))	return scoreMinMax(board, depth);
	
	var scores = new Array();
	var moves = new Array();
	var possible_board, move;
	depth++;
	for(i=0; i<tabuleiro.number_cavities; i++){
		move = legalMove(i, board);
		if(move==-1) continue;
		possible_board = getNewState(move, board);
		scores.push(minimax(possible_board, depth));
		moves.push(move);	
	}
	
	var max_score, max_score_state, min_score, min_score_state;
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

