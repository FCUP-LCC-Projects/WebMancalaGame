let tabuleiro = {
	number_seeds: 4,
	number_cavities: 6, //COLUMNS
	total_cavities: 14,
	difficulty: 1,
	//board [[(number_cavities p1)], P1 Buraco, [number_cavities p2], P2 Buraco]
}

let P1_index = tabuleiro.number_cavities;
let P2_index = tabuleiro.total_cavities-1;

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

function initTabuleiro(){
	tabuleiro.board = new Array(tabuleiro.total_cavities);
	
	for(let i=0; i<tabuleiro.total_cavities-1; i++){
		tabuleiro.board[i] = tabuleiro.number_seeds;
	}
	
	tabuleiro.board[P1_index] = 0;
	tabuleiro.board[tabuleiro.total_cavities-1] = 0;
}

function initBoard(){
	holeSpace = document.getElementById("holes_space");
	for(i=1;i<=tabuleiro.number_cavities; i++){
		initHoleColumns(holeSpace);
	}
}

function initHoleColumns(holes_space){
	const column =  document.createElement("div");
	column.className = "holeColumn";
	
	holes_space.appendChild(column);
	initHole(column);
}

function initHole(column){
	const hole_p1 = document.createElement("div");
	hole_p1.className = "holeP1";
	const hole_p2 = document.createElement("div");
	hole_p2.className = "holeP2";
	
	column.appendChild(hole_p1);
	column.appendChild(hole_p2);
	initSeeds(hole_p1);
	initSeeds(hole_p2);
}

function initSeeds(hole){
	for(let i=1; i<=tabuleiro.number_seeds; i++){
		const seed = document.createElement("div");
		seed.className = "seed";
		
		hole.appendChild(seed);
	}
}


