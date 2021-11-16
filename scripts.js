var tabuleiro = {
	number_seeds: 4,
	number_cavities: 6, //COLUMNS
	total_cavities: 14,
	difficulty: 1,
	mode: "1P",
	type: "CPU",
}

const difficulties = [10, 20, 10000];

function loginSignToggle(){
	const visibilityLogin = document.getElementById('login');
		const visibilitySign = document.getElementById("signup");
		if(visibilityLogin.style.display==="inline-block"){
			visibilityLogin.style.display = "none";
			visibilitySign.style.display = "inline-block";
		}
		else{
			visibilitySign.style.display = "none";
			visibilityLogin.style.display = "inline-block";
		}
}
 
 function giveUp(){
	 showRecords(1);
 }
 
 
 
 function beginGame(){
	 clearSpace();
	 initTabuleiro(tabuleiro);
	 initBoard();
	 newGame();
 }
 
 
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
 }
 
 function formButtonHandler() {
	tabuleiro.number_cavities = document.querySelector('input[name="hollows"]:checked').value;
	tabuleiro.number_seeds = document.querySelector('input[name="seeds"]:checked').value;
	tabuleiro.difficulty = document.querySelector('input[name="cpu_level"]:checked').value;
	tabuleiro.total_cavities = (tabuleiro.number_cavities*2 + 2);
	tabuleiro.type = "CPU"; //alterar para o query na segunda entrega
	beginGame();
 }

function onClickToggle(){
	var div =  document.getElementById('instructions');
	if(div.style.display==="block") div.style.display="none";
	else					div.style.display="block";
}

function updateBoard(){
	const pits = document.getElementsByClassName("pit_hole"); //[0] - p1, [1] - 2
	generateSeeds(pits[1] , tabuleiro.board[P1_index]); //update P1 pit
	generateSeeds(pits[0], tabuleiro.board[tabuleiro.total_cavities-1]);

	const spacesP1 = document.getElementsByClassName("holeP1");
	const spacesP2 = document.getElementsByClassName("holeP2");
	for(i=0, k=(P1_index-1); i<tabuleiro.total_cavities-1; i++){
		if(i == P1_index) continue; //skip P1 pit
		else if(i < P1_index)
		generateSeeds(spacesP1[i], tabuleiro.board[i]);
		else
		generateSeeds(spacesP2[k--], tabuleiro.board[i]);
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


function clearTable(){
	document.getElementById('board').style.display='none';
	document.getElementById('give_up_text').style.display = 'none';
	
	const pits = document.getElementsByClassName('pit_hole');
	for(i=0; i<2; i++)
		while(pits[i].firstChild)
			pits[i].removeChild(pits[i].lastChild);
	
	const holeSpace = document.getElementById('holes_space');
	while(holeSpace.firstChild)
		holeSpace.removeChild(holeSpace.lastChild);
}


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
	
	hole_p1.onclick = updateOnClick;
	
	column.appendChild(hole_p2);
	column.appendChild(hole_p1);
	initSeeds(hole_p2);
	initSeeds(hole_p1);
}

function updateOnClick(){
		p1Move(this.id);
}

function initSeeds(hole){
	for(let i=1; i<=tabuleiro.number_seeds; i++){
		const seed = document.createElement("div");
		seed.className = "seed";
		
		hole.appendChild(seed);
	}
}