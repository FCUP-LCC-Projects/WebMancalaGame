class Spinner{
  gc;
  tela;
  repeatCall;
  intervalId;

  constructor(){
    this.tela = document.querySelector('canvas');
    this.tela.style.position = 'absolute';
    this.tela.style.top = "400px";
    this.tela.style.left = "50%";
    this.gc = this.tela.getContext('2d');
    this.repeatCall = -1;
    this.intervalId = setInterval(this.repeat.bind(this) , 1000 );
  }

  getRadianAngle(degreeValue) {
    return degreeValue * Math.PI / 180;
  }

 hourglass(){
    this.gc.beginPath();
    this.gc.moveTo(8,10);   // 0
    this.gc.lineTo(142,10);  // 1
    this.gc.lineWidth= 9;
    this.gc.closePath();
    this.gc.stroke();

    this.gc.beginPath();
    this.gc.moveTo(8,140);   // 0
    this.gc.lineTo(142,140);  // 1
    this.gc.lineWidth= 9;
    this.gc.closePath();
    this.gc.stroke();

    this.gc.beginPath();
    this.gc.moveTo(15,10);
    this.gc.lineTo(65,70);
    this.gc.lineWidth= 7;
    this.gc.closePath();
    this.gc.stroke();
    this.gc.fill();

    this.gc.beginPath();
    this.gc.moveTo(135,10);
    this.gc.lineTo(85,70);
    this.gc.lineWidth= 7;
    this.gc.closePath();
    this.gc.stroke();
    this.gc.fill();

    this.gc.beginPath();
    this.gc.moveTo(64,68);
    this.gc.lineTo(64,85);
    this.gc.lineWidth= 7;
    this.gc.closePath();
    this.gc.stroke();

    this.gc.beginPath();
    this.gc.moveTo(86,68);
    this.gc.lineTo(86,85);
    this.gc.lineWidth= 7;
    this.gc.closePath();
    this.gc.stroke();

    this.gc.beginPath();
    this.gc.moveTo(64,83);
    this.gc.lineTo(15,137);
    this.gc.lineWidth= 7;
    this.gc.closePath();
    this.gc.stroke();

    this.gc.beginPath();
    this.gc.moveTo(86,83);
    this.gc.lineTo(135,137);
    this.gc.lineWidth= 7;
    this.gc.closePath();
    this.gc.stroke();


    this.gc.beginPath();
    this.gc.moveTo(25,15);   // 0
    this.gc.lineTo(130,15);  // 1
    this.gc.lineTo(25,15);
    this.gc.lineTo(68,67);
    this.gc.lineTo(68,75);
    this.gc.lineTo(82,75);
    this.gc.lineTo(82,67);
    this.gc.lineTo(125,15);
    this.gc.closePath();
    this.gc.fillStyle= 'grey'
    this.gc.fill();
  }

  rotation(a){
    a= a % 4;
    switch(a) {
        case 0:
          this.tela.width = this.tela.width;
          this.hourglass();
          break;

        case 1:
          this.tela.width = this.tela.width;
          this.gc.translate(this.tela.width, this.tela.height/200);
          this.gc.rotate(this.getRadianAngle(90));
          this.hourglass();
          break;

        case 2:
          this.tela.width = this.tela.width;
          this.gc.translate(this.tela.width, this.tela.height);
          this.gc.rotate(this.getRadianAngle(180));
          this.hourglass();
          break;

        case 3:
          this.tela.width = this.tela.width;
          this.gc.translate(this.tela.width/200, this.tela.height);
          this.gc.rotate(this.getRadianAngle(270));
          this.hourglass();
          break;
      }
  }

  repeat(){
    this.repeatCall++;
    this.rotation(this.repeatCall);
  }
}
