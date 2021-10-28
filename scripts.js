window.onload = function(){  //prevent script from loading before html page
	formButtonHandler();
}
 
 
 
 function formButtonHandler() {
	const tableContents = document.getElementById("tableContent");
	document.getElementById("submit").addEventListener("click", (event) => {
    
		console.log(tableContents.elements['hollow_value'].value);
  
	});
 }


