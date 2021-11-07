var tabuleiro = {
	number_seeds: 4,
	number_cavities: 6, //COLUMNS
	total_cavities: 14,
	difficulty: 1,
	mode: "1P",
}

window.onload = function(){  //prevent script from loading before html page
	formButtonHandler();
}

function loginSignToggle(){
	const visibilityLogin = document.getElementById('login');
		const visibilitySign = document.getElementById("signup");
		if(visibilityLogin.style.display==="block"){
			visibilityLogin.style.display = "none";
			visibilitySign.style.display = "block";
		}
		else{
			visibilityLogin.style.display = "block";
			visibilitySign.style.display = "none";
		}
}
 
 
 function beginGame(){
	 clearSpace();
	 initTabuleiro(tabuleiro);
	 initBoard();
	 document.getElementById('turn_info').style.visibility= 'visible';
	 
 }
 
 
 function clearSpace(){
	 document.getElementById('login').style.display = "none";
	 document.getElementById('signup').style.display  = "none";
	 //document.getElementById('tableContents').style.display  = "none";
	 //document.getElementById('instructions').style.display  = "none";
 }
 
 function formButtonHandler() {
	const tableContents = document.getElementById("tableContent");
	document.getElementById("submit").addEventListener("click", (event) => {
		tabuleiro.number_cavities = document.querySelector('input[name="hollows"]:checked').value;
		tabuleiro.number_seeds = document.querySelector('input[name="seeds"]:checked').value;
		tabuleiro.difficulty = document.querySelector('input[name="cpu_level"]:checked').value;
		tabuleiro.total_cavities = (tabuleiro.number_cavities*2 + 2);
		tabuleiro.type = "CPU"; //alterar para o query na segunda entrega
	});
 }

function onClickToggle(){
	var div =  document.getElementById('instructions');
	if(div.style.display==="block") div.style.display="none";
	else					div.style.display="block";
}

