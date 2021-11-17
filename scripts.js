var tabuleiro = {
	number_seeds: 4,
	number_cavities: 6, //COLUMNS
	total_cavities: 14,
	difficulty: 1,
	mode: "P1",
	type: "CPU",
}

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

function onClickToggle(){
	var div =  document.getElementById('instructions');
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
	var div =  	document.getElementById('tableContent');
	if(div.style.display==="none") div.style.display="block";
	else					div.style.display="none";
}

/*Form handler*/
 
  function formButtonHandler() {
	tabuleiro.number_cavities = document.querySelector('input[name="hollows"]:checked').value;
	tabuleiro.number_seeds = document.querySelector('input[name="seeds"]:checked').value;
	tabuleiro.difficulty = document.querySelector('input[name="cpu_level"]:checked').value;
	tabuleiro.mode = document.querySelector('input[name="game_mode"]:checked').value;
	tabuleiro.total_cavities = (tabuleiro.number_cavities*2 + 2);
	tabuleiro.type = "CPU"; //alterar para o query na segunda entrega
	beginGame();
 }

 /*Begin Mancala game event*/
 
 function beginGame(){
	 clearSpace();
	 initTabuleiro(tabuleiro);
	 initBoard();
	 newGame();
 }
 
 /*Player gives up*/
 
 function giveUp(){
	 showRecords(1);
 }

 
