
/*
HTML

<canvas id=tela width= 150 height=150 >

*/

/*
CSS

body{
	font-family: "Ubuntu";
	font-size: 18px;
	background: #312E2B fixed;
	color: #ffffff;

}

#tela{
  background-color:#1d1e22;
  border-radius: 5px;
 
}


*/

/* Didn't put in a class cuz idk how to do that but everything is working
Should be rather easy to do that 
*/
function getRadianAngle(degreeValue) {
    return degreeValue * Math.PI / 180;
} 

var tela = document.querySelector('canvas');
  tela.style.position = 'absolute';
  tela.style.top = "100px";
  tela.style.left = "850px";
  d = tela.width = tela.height;
  const gc = tela.getContext('2d')


  
function hourglass(){
gc.beginPath();
gc.moveTo(8,10);   // 0
gc.lineTo(142,10);  // 1
gc.lineWidth= 9;
gc.closePath();
gc.stroke();


gc.beginPath();
gc.moveTo(8,140);   // 0
gc.lineTo(142,140);  // 1
gc.lineWidth= 9;
gc.closePath();
gc.stroke();


gc.beginPath();
gc.moveTo(15,10);
gc.lineTo(65,70);
gc.lineWidth= 7;
gc.closePath();
gc.stroke();
gc.fill();

gc.beginPath();
gc.moveTo(135,10);
gc.lineTo(85,70);
gc.lineWidth= 7;
gc.closePath();
gc.stroke();
gc.fill();

gc.beginPath();
gc.moveTo(64,68);
gc.lineTo(64,85);
gc.lineWidth= 7;
gc.closePath();
gc.stroke();

gc.beginPath();
gc.moveTo(86,68);
gc.lineTo(86,85);
gc.lineWidth= 7;
gc.closePath();
gc.stroke();

gc.beginPath();
gc.moveTo(64,83);
gc.lineTo(15,137);
gc.lineWidth= 7;
gc.closePath();
gc.stroke();

gc.beginPath();
gc.moveTo(86,83);
gc.lineTo(135,137);
gc.lineWidth= 7;
gc.closePath();
gc.stroke();



gc.beginPath();
gc.moveTo(25,15);   // 0
gc.lineTo(130,15);  // 1
gc.lineTo(25,15);
gc.lineTo(68,67);
gc.lineTo(68,75);
gc.lineTo(82,75);
gc.lineTo(82,67);
gc.lineTo(125,15);
gc.closePath();
gc.fillStyle= 'grey'
gc.fill();

}


function rotation(a){
 a= a % 4
    switch(a) {
      case 0:
        this.tela.width = this.tela.width
        hourglass();
        
        break;
        
      case 1:
        this.tela.width = this.tela.width
        gc.translate(tela.width, tela.height/200);
        gc.rotate(getRadianAngle(90));
        hourglass();
        break;
        
      case 2:
        this.tela.width = this.tela.width
        gc.translate(tela.width, tela.height);
        gc.rotate(getRadianAngle(180));
        hourglass();
        break;
        
      case 3:
        this.tela.width = this.tela.width
        gc.translate(tela.width/200, tela.height);
        gc.rotate(getRadianAngle(270));
        hourglass();
        break;
    }    
     
   
        

}
var i = -1;
function repeat(){
  
  setTimeout(function(){
  rotation(i);
  i++;
  if (i>0){
    repeat();
  }
  
},1000)
  
}
var i=0;
setInterval(repeat() , 1000 );