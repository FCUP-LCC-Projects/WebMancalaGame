const COLORS = ["#f8f8f8", "#6d6d6d", "#eeeed2", "#565352", "#454443"];
/*Create Board Data Structure*/

function initTabuleiro(){

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

	const p1_text = document.createElement("h5");
	p1_text.className = "tooltiptext";
	p1_text.id = id;
	p1_text.innerHTML = tabuleiro.number_seeds;
	const p2_text = document.createElement("h5");
	p2_text.className = "tooltiptext";
	p2_text.id = (P2_index-1-id);
	p2_text.innerHTML = tabuleiro.number_seeds;

	column.appendChild(p2_text);

	column.appendChild(hole_p2);
	column.appendChild(hole_p1);

	column.appendChild(p1_text);

	addOnClick(hole_p1);

	initSeeds(hole_p2);
	initSeeds(hole_p1);
}

function initSeeds(hole){
	for(let i=1; i<=tabuleiro.number_seeds; i++){
		const seed = document.createElement("div");
		seed.className = "seed";
		generateStyle(seed, i);
		hole.appendChild(seed);
	}
}

function generateStyle(seed, numSeeds){
	let indexColor = numSeeds%COLORS.length;
	seed.style.backgroundColor = COLORS[indexColor];
	let top = (((Math.random()*120)));
	let left = (((Math.random()*55)));
	seed.style.marginTop = top+"%";
	seed.style.marginLeft = left+"%";
}

/*Event Listeners*/

function updateTooltip(idHole, board){
	const columns = document.getElementsByClassName("holeColumn");
	if(idHole > P1_index){
		let id = idHole--;
		let column = id%P1_index;
		columns[column].firstChild.innerHTML = board[P2_index-1-column];
	}//first tooltip
	else{
		let column = idHole%P1_index;
		columns[column].lastChild.innerHTML = board[idHole];
	}		//second tooltip

}

function addOnClick(hole){
	if(apiGame){
		hole.addEventListener("click", (event) => {
			apiGame.notifyPlay(hole.id);
		})
	}
	else {
		hole.addEventListener("click", (event) => {
			p1Move(hole.id);
		})
	}
}

/* Update values*/

function updateSeeds(state, seeds, mode, board){
	board[state++]  = 0;

	while(seeds > 1){
		if(state == P1_index && mode==="P2") state++;
		else if(state == P2_index && mode==="P1") state = 0;
		else{
			if(state>P2_index) state = 0; //in case it updated beyond the value

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
			generateStyle(seed, seedList.length);
			hole.appendChild(seed).focus();
		}
	}
}

 function updateBoard(board){
	const pits = document.getElementsByClassName("pit_hole"); //[0] - p1, [1] - 2
	generateSeeds(pits[1] , board[P1_index]); //update P1 pit
	generateSeeds(pits[0], board[P2_index]);

	const spacesP1 = document.getElementsByClassName("holeP1");
	const spacesP2 = document.getElementsByClassName("holeP2");
	for(i=0, k=(P1_index-1); i<P2_index; i++){
		if(i == P1_index) continue; //skip P1 pit
		else if(i < P1_index){
		generateSeeds(spacesP1[i], board[i]);
		updateTooltip(i, board);
		}
		else{
		generateSeeds(spacesP2[k--], board[i]);
		updateTooltip(i, board);
		}
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
	else{
		turnInfo.innerHTML = "It's a tie.";
		p2Wins++;
	}

	if(!loggedIn){
		let user = "Anon";
		ranking.addNewRanking({user, p1Wins});
	}
	else{
		let user = localStorage.getItem("username");
		ranking.addNewRanking({user, p1Wins});
	}
	ranking.renderRanking(true);

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
	 document.getElementById('give_up').style.display = "block";
	 document.getElementById('icon').onclick = instructionToggle;
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

	document.getElementById('score-player1').innerHTML = 0;
	document.getElementById('score-player2').innerHTML = 0;
}
