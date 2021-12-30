var tabuleiro = {
	number_seeds: 4,
	number_cavities: 6, //COLUMNS
	total_cavities: 14,
	difficulty: 1,
	mode: "P1",
	type: "CPU",
}

let api = new API();
let ranking = new Ranking();
let apiGame;
let error = new Errors();

const difficulties = [10, 20, 10000];

/*Display togglers*/
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

function instructionToggle(){
	const div =  document.getElementById('instructions');
	if(div.style.display==="block"){
		div.style.display="none";
		document.getElementById('turn_info').style.display = "block";
		document.getElementById('give_up').style.display = "block";
	}
	else	{
		div.style.display="block";
		document.getElementById('turn_info').style.display = "flow-root";
		document.getElementById('give_up').style.display = "flow-root";
	}
}

function settingsToggle(){
	const div =  	document.getElementById('tableContent');
	if(div.style.display==="none") div.style.display="contents";
	else					div.style.display="none";
}

function rulesToggle(){
	const div = document.getElementById('instructions');
	if(div.style.display==="block"){
		div.style.display="none";
		document.getElementById('rules_text').style.display = "flex";
		document.getElementById('tableContent').style.display = "contents";
	}
	else	{
		div.style.display="block";
		document.getElementById('rules_text').style.display = "none";
		document.getElementById('tableContent').style.display = "inline-block";
	}
}

 /*Begin Mancala game event*/

 function beginGame(){
	 clearSpace();
	 initTabuleiro();
	 initBoard();
	 newGame();
 }
