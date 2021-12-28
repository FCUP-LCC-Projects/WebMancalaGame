

function beginApiGame(config){
  clearSpace();

  api.join({
    "group": '222222222',
    "nick": config.username,
    "password": localStorage.getItem(`password_${config.username}`),
    "size": config.cavities,
    "initial": config.seeds
  }, (response) => {
  config.gameHash = response.game;

  api.defineURL(config);
  api.startEvent();

  apiGame = new APIGame(config);
  document.getElementById("give_up").onclick = apiGame.giveUp;

  apiGame.startGame();
  }, (response) => {
  console.log(response);
  });
}

class APIGame{
  board;
  config;

  constructor(config){
    console.log("api game config: "+config.username+" "+config.cavities+" "+config.seeds);
    this.config = config;
    P1_index = config.cavities;
    P2_index = config.cavities*2+1;
    this.board = new Array(P2_index+1);
  }

  startGame(){
    document.getElementById('give_up').onclick = this.giveUp;
    initTabuleiro();
    initBoard();
    api.update(
      (response) => this.successCallback(response)
    )
  }

  notifyPlay(move){
    console.log(move);
    api.notify({
        "nick": this.config.username,
        "password": localStorage.getItem(`password_${this.config.username}`),
        "game": this.config.gameHash,
        "move": move
    });
  } //move é só o id da cavidade a semer [0, end]

  convertBoard(response){
    let key = response['sides'];
    let fstUser, sndUser;

    for(const v in key){
      if(v === this.config.username){
        fstUser = key[v];
      }
      else{
        sndUser = key[v];
      }
    }


    this.board[P1_index] = fstUser.store; //isto pode nao ser a maneira correta de aceder
    for(let i=0; i<this.config.cavities; i++){
        this.board[i] = fstUser.pits[i];
    }
    for(let i=0; i<this.config.cavities; i++){
        this.board[i+1+P1_index] = sndUser.pits[i];
    }
    this.board[P2_index] = sndUser.store;
  }

  successCallback(response){
    console.log(response);
    if(response.board){
      this.convertBoard(response.board);
      updateBoard(this.board);
    }

    if(response.winner){
      if(response.winner===this.config.username){
        document.getElementById('turn_info').innerHTML = "You win!";
        this.endGame();
      }
      else{
        document.getElementById('turn_info').innerHTML = "You lost!";
        this.endGame();
      }
    }
    else if(response.winner=== null){
      document.getElementById('turn_info').innerHTML = "It's a tie!";
      this.endGame();
    }
    else{
      if(response.board.turn === this.config.username){
        document.getElementById('turn_info').innerHTML = "Your turn";
      }
      else{
        document.getElementById('turn_info').innerHTML = response.board.turn + "'s turn";
      }
    }
  }

  endGame(){
    ranking.renderRanking(false);
    api.closeEvent();
    clearTable();
  }

  giveUp(){
    this.unpair();
    this.endGame();
  }

  unpair() {
    api.leave(
      {
        game: this.config.gameHash,
        nick: this.config.username,
        pass: localStorage.getItem(`password_${this.config.username}`)
      },
      () => {}
    );
  }
}