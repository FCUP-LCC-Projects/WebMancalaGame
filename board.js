/*Create Board Data Structure*/

function initTabuleiro(stats){
	
	tabuleiro.number_seeds = stats.number_seeds;
	tabuleiro.number_cavities = stats.number_cavities;
	tabuleiro.total_cavities = stats.total_cavities;
	tabuleiro.difficulty = difficulties[stats.difficulty];
	mode = stats.mode;
	tabuleiro.board = new Array(tabuleiro.total_cavities);
	
	for(let i=0; i<tabuleiro.total_cavities-1; i++){
		tabuleiro.board[i] = tabuleiro.number_seeds;
	}
	
	P1_index = tabuleiro.number_cavities;
	P2_index = tabuleiro.total_cavities-1;
	
	tabuleiro.board[P1_index] = 0;
	tabuleiro.board[P2_index] = 0;
}

/* Create UI */
function initBoard(){
	holeSpace = document.getElementById("holes_space");
	holeSpace.style.display='flex';
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
	
	const p1_text = document.createElement("span");
	p1_text.className = "tooltiptext";
	p1_text.id = id;
	const p2_text = document.createElement("span");
	p2_text.className = "tooltiptext";
	p2_text.id = (P2_index-1-id);
	
	column.appendChild(hole_p2);
	column.appendChild(hole_p1);
	
	column.appendChild(p2_text);
	column.appendChild(p1_text);
	
	hole_p1.onmouseover = updateOnHover;
	hole_p2.onmouseover = updateOnHover;
	
	hole_p1.onclick = updateOnClick;
	

	initSeeds(hole_p2);
	initSeeds(hole_p1);
}

function initSeeds(hole){
	for(let i=1; i<=tabuleiro.number_seeds; i++){
		const seed = document.createElement("div");
		seed.className = "seed";
		
		hole.appendChild(seed);
	}
}

/*Event Listeners*/

function updateOnHover(){
	let id = this.id;
	if(this.id > P1_index) id--;
	document.getElementsByClassName('tooltiptext')[id].innerHTML = tabuleiro.board[this.id];
}

function updateOnClick(){
		p1Move(this.id);
}

/* Update values*/

function updateSeeds(state, seeds, mode, board){
	board[state++]  = 0;
	
	while(seeds > 1){
		if(state == P1_index && mode==="P2") state++;
		else if(state == P2_index && mode==="P1") state = 0;
		else{
			
			board[state++]++; // certificar se não atualiza o state antes de atualizar o valor de board[state]
			seeds--;
		}
	}
	if(state == P1_index && mode==="P2") state++;
	else if(state == P2_index && mode==="P1") state = 0;
	
	if((mode==="P1" && state==P1_index) || (mode==="P2" && state==P2_index)) {board[state++]++; seeds--; extraTurn=true;} //+1 turn 
	else if(board[state]==0){
		board[state] += 1 + board[P2_index - 1 - state]; //estado atual + ultima semente + semente do lado oposto
		board[P2_index - 1 - state] = 0;
		seeds--;
	}
	else{
		board[state]++; 
		seeds--;
	}
	return board;
}


/*Update UI*/

function generateSeeds(hole, number_seeds){
	const seedList = hole.childNodes;

	while(seedList.length != number_seeds){
		if(seedList.length > number_seeds){ //remove
			hole.removeChild(hole.lastChild);
		}
		if(seedList.length < number_seeds){ //append
			const seed = document.createElement("div");
			seed.className = "seed";
		
			hole.appendChild(seed);
		}
	}
}

 function updateBoard(){
	const pits = document.getElementsByClassName("pit_hole"); //[0] - p1, [1] - 2
	generateSeeds(pits[1] , tabuleiro.board[P1_index]); //update P1 pit
	generateSeeds(pits[0], tabuleiro.board[P2_index]);

	const spacesP1 = document.getElementsByClassName("holeP1");
	const spacesP2 = document.getElementsByClassName("holeP2");
	for(i=0, k=(P1_index-1); i<P2_index; i++){
		if(i == P1_index) continue; //skip P1 pit
		else if(i < P1_index)
		generateSeeds(spacesP1[i], tabuleiro.board[i]);
		else
		generateSeeds(spacesP2[k--], tabuleiro.board[i]);
	}
}


/*Show ranking*/
function showRecords(result){
	var score = result;
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
	
	const rankings = document.getElementById('ranking');
	rankings.style.display="table";
	const row = rankings.insertRow(-1);
	var p1Score = row.insertCell(0);
	var p2Score = row.insertCell(1);
	var wins = row.insertCell(2);
	
	p1Score.innerHTML = tabuleiro.board[P1_index];
	p2Score.innerHTML = tabuleiro.board[P2_index];
	wins.innerHTML = p1Wins + " - " + p2Wins;
	
	document.getElementById('play_again_text').style.display = "initial";
	document.getElementById('settings_text').style.display = "initial";
	clearTable();
}

/*Reset UI*/

 function clearSpace(){
	 document.getElementById('board').style.display  = "flex";
	 document.getElementById('turn_info').style.visibility= 'visible';
	 document.getElementById('login').style.display = "none";
	 document.getElementById('signup').style.display  = "none";
	 document.getElementById('tableContent').style.display  = "none";
	 document.getElementById('instructions').style.display  = "none";
	 document.getElementById('begin_game_text').style.display = "none";
	 document.getElementById('play_again_text').style.display = "none";
	 document.getElementById('instruction_text').style.display = "initial";
	 document.getElementById('give_up_text').style.display = "initial";
	 document.getElementById('settings_text').style.display = "none";
 }
 
function clearTable(){
	document.getElementById('board').style.display='none';
	document.getElementById('give_up_text').style.display = 'none';
	document.getElementById('instruction_text').style.display = 'none';
	
	const pits = document.getElementsByClassName('pit_hole');
	for(i=0; i<2; i++)
		while(pits[i].firstChild)
			pits[i].removeChild(pits[i].lastChild);
	
	const holeSpace = document.getElementById('holes_space');
	while(holeSpace.firstChild)
		holeSpace.removeChild(holeSpace.lastChild);
}


