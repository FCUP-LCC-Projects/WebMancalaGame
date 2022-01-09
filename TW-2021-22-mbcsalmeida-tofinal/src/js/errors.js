class Errors{

  constructor(){}

  createLoginMessage(message){
    const window = document.getElementById("alert-window");
    window.textContent = message;

    window.style.right = "-20px";
    window.style.top = "85px";
    window.style.color = "crimson";
    window.style.textShadow = "0 0 3px black";
    window.style.backgroundColor = "";
    window.style.border = "";

    setTimeout(function() {
      window.style.display = "none";
    }, 4000);
  }

  createMessage(message){
    const window = document.getElementById("alert-window");
    window.textContent = message;

    window.style.display = "block";
    window.style.left = "14vw";
    window.style.bottom = "-20vh";

    setTimeout(function() {
      window.style.display = "none";
    }, 4000);
  }

}
