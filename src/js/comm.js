var loggedIn = false;

document.getElementById("cpu_vs_txt").addEventListener("click", (event) =>{
    beginGame();
});

document.getElementById("player_vs_txt").addEventListener("click", (event) =>{
  let username = document.querySelector('[display-username]').textContent;
  let cavities = 6;
  let seeds = 4;
  beginApiGame({username, seeds, cavities});
});

document.getElementById("give_up_text").addEventListener("click", (event) => {
  if(apiGame){
    apiGame.giveUp();
  }
  else{
    showRecords(1);
  }
});

document.getElementById("play_again_text").addEventListener("click", (event) => {
  document.getElementById("ranking").style.display="none";
  if(loggedIn){
    ranking.clearTable();
    let username = document.querySelector('[display-username]').textContent;
    let cavities = 6;
    let seeds = 4;
    beginApiGame({username, seeds, cavities});
  }
  else {
    ranking.clearTable();
    beginGame();
  }
});

document.querySelector("[login-form]").addEventListener("submit", (event) =>{
  registration();
});

document.querySelector("[signup-form]").addEventListener("submit", (event) =>{
  registration();
});

document.querySelector("[config-form]").addEventListener("submit", (event) =>{
    event.preventDefault();

	tabuleiro.number_cavities = document.querySelector('input[name="hollows"]:checked').value;
	tabuleiro.number_seeds = document.querySelector('input[name="seeds"]:checked').value;
	tabuleiro.difficulty = document.querySelector('input[name="cpu_level"]:checked').value;
	tabuleiro.mode = document.querySelector('input[name="game_mode"]:checked').value;
	tabuleiro.total_cavities = (tabuleiro.number_cavities*2 + 2);
	tabuleiro.type = document.querySelector('input[name="versus"]:checked').value; //alterar para o query na segunda entrega

  let username = document.querySelector('[display-username]').textContent;
  let seeds = tabuleiro.number_seeds;
  let cavities = tabuleiro.number_cavities;

  if(tabuleiro.type === "CPU")
    beginGame();
  else {
    beginApiGame({username, seeds, cavities});
  }
});

function registration(){
  event.preventDefault();

  const username = document.querySelector('input[name="username"]').value;
  const password = document.querySelector('input[name="password"]').value;


  const success_callback = () => {
    localStorage.setItem("username", username);
    localStorage.setItem(`password_${username}`, password);

    document.querySelector('[display-username]').textContent = username;
    document.getElementById("login").style.display="none";
    document.getElementById("signup").style.display="none";

    loggedIn = true;
    document.getElementById("cpu_vs_txt").textContent = "Versus CPU";
    document.getElementById("player_vs_txt").style.display = "inline-flex";
  }

  const error_callback = (response) => {
    error.callBack(response);
  }

  api.register({"nick":username, "password": password}, success_callback, error_callback);
}
