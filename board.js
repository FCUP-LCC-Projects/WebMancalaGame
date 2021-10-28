let tabuleiro = {
	number_seeds: 4,
	number_cavities: 2,
	total_cavities: 14,
	difficulty: 1,
	board: new Array(14) //[[(number_cavities p1)], P1 Buraco, [number_cavities p2], P2 Buraco]
}


function updateSeeds(state, seeds){
	board[state++]  = 0;
	
	while(seeds > 0){
		if(state == tabuleiro.total_cavities) state = 0;
		if(state == tabuleiro.number_cavities && mode.equals("P2")) state++;
		else if(state == (tabuleiro.total_cavities-1) && mode.equals("P1")) state = 0;
		else{
			
			board[state++]++; // certificar se não atualiza o state antes de atualizar o valor de board[state]
			seeds--;
		}
	}
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
	hole_p1.className = "hole";
	const hole_p2 = document.createElement("div");
	hole_p2.className = "hole";
	
	column.appendChild(hole_p1);
	column.appendChild(hole_p2);
	initSeeds(hole_p1);
	initSeeds(hole_p2);
}

function initSeeds(hole){
	for(i=1; i<=tabuleiro.number_seeds; i++){
		const seed = document.createElement("div");
		seed.className = "seed";
		
		hole.appendChild(seed);
	}
}