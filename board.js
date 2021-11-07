var tabuleiro = {
	number_seeds: 4,
	number_cavities: 6, //COLUMNS
	total_cavities: 14,
	difficulty: 1,
	type: "CPU"
	//board [[(number_cavities p1)], P1 Buraco, [number_cavities p2], P2 Buraco]
}

var mode = "P1";
var choice, P1_index, P2_index, p1Wins = 0, p2Wins = 0;

function newGame(){
	var turnInfo = document.getElementById("turn_info");
	initBoard();
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
}

function updateBoard(){
	const pits = document.getElementsByClassName("pit_hole"); //[0] - p1, [1] - 2
	generateSeeds(pits[0] , tabuleiro.board[P1_index]); //update P1 pit
	generateSeeds(pits[1], tabuleiro.board[tabuleiro.total_cavities-1]);

	const spacesP1 = document.getElementsByClassName("holeP1");
	const spacesP2 = document.getElementsByClassName("holeP2");
	for(i=0, k=0; i<tabuleiro.total_cavities-1; i++){
		if(i == P1_index) continue; //skip P1 pit
		else if(i < P1_index)
		generateSeeds(spacesP1[i], tabuleiro.board[i]);
		else
		generateSeeds(spacesP2[k++], tabuleiro.board[i]);
	}
}

function generateSeeds(hole, number_seeds){
	const seedList = hole.childNodes;

	while(seedList.length != number_seeds){
		if(seedList.length > number_seeds){ //remove
			hole.removeChild(seedList.item(seedList.length-1));
		}
		if(seedList.length < number_seeds){ //append
			const seed = document.createElement("div");
			seed.className = "seed";
		
			hole.appendChild(seed);
		}
	}
}

function initTabuleiro(stats){

	tabuleiro.number_seeds = stats.number_seeds;
	tabuleiro.number_cavities = stats.number_cavities;
	tabuleiro.total_cavities = stats.total_cavities;
	mode = stats.mode;
	tabuleiro.board = new Array(tabuleiro.total_cavities);
	
	for(let i=0; i<tabuleiro.total_cavities-1; i++){
		tabuleiro.board[i] = tabuleiro.number_seeds;
	}
	
	P1_index = tabuleiro.number_cavities;
	P2_index = tabuleiro.total_cavities-1;
	
	tabuleiro.board[P1_index] = 0;
	tabuleiro.board[tabuleiro.total_cavities-1] = 0;
}

function initBoard(){
	holeSpace = document.getElementById("holes_space");
	for(i=0;i<tabuleiro.number_cavities; i++){
		initHoleColumns(holeSpace, i);
	}
}

function initHoleColumns(holes_space, id){
	const column =  document.createElement("div");
	column.className = "holeColumn";
	
	holes_space.appendChild(column);
	initHole(column, id);
}

function initHole(column, id){
	const hole_p1 = document.createElement("div");
	hole_p1.className = "holeP1";
	hole_p1.id = id;
	const hole_p2 = document.createElement("div");
	hole_p2.className = "holeP2";
	hole_p2.id = (P2_index-1-id);
	
	hole_p1.onClick = updateOnClick;
	
	column.appendChild(hole_p1);
	column.appendChild(hole_p2);
	initSeeds(hole_p1);
	initSeeds(hole_p2);
}

function updateOnClick(id){
		p1Move(id);
}

function initSeeds(hole){
	for(let i=1; i<=tabuleiro.number_seeds; i++){
		const seed = document.createElement("div");
		seed.className = "seed";
		
		hole.appendChild(seed);
	}
}


function p1Move(state){
	if(!checkForOver(tabuleiro.board)){
		updateSeeds(state, tabuleiro.board[state], "P1", tabuleiro.board);
		updateBoard();
		if(!checkForOver(tabuleiro.board)){
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
	updateBoard();
	choice = []
	mode = "P1";
	if(!checkForOver(tabuleiro.board)){
		turnInfo.innerHTML = "Player 1's turn";
	}
}

function checkForOver(board){
	for(i=0; i<board.length - 1; i++){
		if(i==tabuleiro.number_cavities) continue;
		if(board[i]!=0) return false;
	}
	showRecords();
	return true;
}

function showRecords(){
	var score = gameOver(board);
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
	const row = rankings.insertRow(-1);
	var p1Score = row.insertCell(0);
	var p2Score = row.insertCell(1);
	var wins = row.insertCell(2);
	
	p1.innerHTML(tabuleiro.board[P1_index]);
	p2.innerHTML(tabuleiro.board[P2_index]);
	wins.innerHTML(p1Wins + " - " + p2Wins);
}

function gameOver(board){
	if(board[P1_index] < board[P2_index]) return 1; //P2 wins 
	else if(board[P1_index] > board[P2_index]) return 2; //P1 wins
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
	if(checkForOver(board))	return scoreMinMax(board, depth);
	
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

