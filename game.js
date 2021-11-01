var mode = "P1";
var choice;

let tabuleiro = {
	number_seeds: 4,
	number_cavities: 6, //COLUMNS
	total_cavities: 14,
	difficulty: 1,
	//board [[(number_cavities p1)], P1 Buraco, [number_cavities p2], P2 Buraco]
}

let P1_index = tabuleiro.number_cavities;
let P2_index = tabuleiro.total_cavities-1;

function p1Move(state){
	if(!gameOver(tabuleiro.board)){
		updateSeeds(state, tabuleiro.board[state], "P1", tabuleiro.board);
		updateBoard();
		if(!gameOver(tabuleiro.board)){
			//p2 turn
			mode = "P2";
			cpuMove();
		}
	}
}

function cpuMove(){
	minimax(tabuleiro.board, 0);
	var state = choice;
	updateSeeds(state, tabuleiro.board[state], "P2", tabuleiro.board);
	choice = []
	mode = "P1";
	if(!gameOver(tabuleiro.board)){
		//p1 turn
	}
}

function checkForWinner(board){
	for(i=0; i<board.length - 1; i++){
		if(i==tabuleiro.number_cavities) continue;
		if(board[i]!=0) return false;
	}
	return true;
}

function gameOver(board){
	var P1 = tabuleiro.number_cavities;
	var P2 = tabuleiro.total_cavities-1;
	if(board[P1] < board[P2]) return 1; //P2 wins 
	else if(board[P1] > board[P2]) return 2; //P1 wins
	else return 3; //Tie
}

function getNewState(move, tempBoard){
	updateSeeds(move, tempBoard[move], mode, tempBoard);
	mode = changeMode();
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
	if(checkForWinner(board))	return scoreMinMax(board, depth);
	
	var scores = new Array();
	var moves = new Array();
	var tempBoard;
	depth++;
	for(i=1; i<=tabuleiro.number_cavities; i++){
		tempBoard = [...board];
		possible_board = getNewState(i+tabuleiro.number_cavities, tempBoard);
		scores.push(minimax(possible_board, depth));
		moves.push(i+tabuleiro.number_cavities);	
	}
	
	var max_score, max_score_state, min_score, min_score_state;
	if(mode=="P2"){
		max_score = Math.apply.max(Math, scores);
		max_score_state = scores.indexOf(max_score);
		choice = moves[max_score_state];
		return max_score;
	}
	else{
		min_score = Math.apply.min(Math, scores);
		min_score_state = scores.indexOf(min_score);
		choice = moves[min_score_state];
		return min_score;
	}
}

function initTabuleiro(){
	tabuleiro.board = new Array(tabuleiro.total_cavities);
	
	for(let i=0; i<tabuleiro.total_cavities-1; i++){
		tabuleiro.board[i] = tabuleiro.number_seeds;
	}
	
	tabuleiro.board[P1_index] = 0;
	tabuleiro.board[tabuleiro.total_cavities-1] = 0;
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
}

