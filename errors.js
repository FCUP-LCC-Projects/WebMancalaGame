class Errors{

  constructor(){}

  callBack(message){
    console.log(message);
    this.createMessage(message.error);
  }

  createMessage(message){
    const window = document.createElement('div');
    window.class = "error";
    window.textContent = message;
    document.body.appendChild(window);

    setTimeout(function() {
      window.remove();
    }, 6000);
  }

}
