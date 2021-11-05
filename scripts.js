var tabuleiro = {
	number_seeds: 4,
	number_cavities: 6, //COLUMNS
	total_cavities: 14,
	difficulty: 1,
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
	 
	 
	 
 }
 
 
 function clearSpace(){
	 document.getElementById('login') = "none";
	 document.getElementById('signup') = "none";
	 document.getElementById('tableContents') = "none";
	 document.getElementById('instructions') = "none";
 }
 
 function formButtonHandler() {
	const tableContents = document.getElementById("tableContent");
	document.getElementById("submit").addEventListener("click", (event) => {
    
		console.log(tableContents.elements['hollow_value'].value);
  
	});
 }

function onClickToggle(){
	var div =  document.getElementById('instructions');
	if(div.style.display==="block") div.style.display="none";
	else					div.style.display="block";
}

