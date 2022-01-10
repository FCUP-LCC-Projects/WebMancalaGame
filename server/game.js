let extraTurn = false;

module.exports.processMove = function(state, data){
  let gameHash = data.game;
  extraTurn = false;
  let board = convertObjectToBoard(state.playing[gameHash].board, data.nick,
                                            state.playing[gameHash].size);
  board = updateSeeds(data.move, state.playing[gameHash].initial, "P1", board, state.playing[gameHash].size);

  return convertBoardToObject(board, state.playing[gameHash].board, data.nick, state.playing[gameHash].size);
}

module.exports.decideTurn = function(state, data){ //state == games.playing[gameHash].board
  let fstUser, sndUser;
  for(const user in state['sides']){
    if(user === data.turn)
      fstUser = user;
    else
      sndUser = user;
  }

  if(data.turn === fstUser){
    if(!extraTurn)
      return sndUser;
    else
      return fstUser;
  }
  if(data.turn === sndUser){
    if(!extraTurn)
      return fstUser;
    else
      return sndUser;
  }
  extraTurn = false;
}

module.exports.getWinner = function(state, data){
  let size = state.playing[gameHash].size;
  let P1_index = size;
  let P2_index = size*2+1;
  let board = convertObjectToBoard(state.playing[gameHash].board, data.nick, size);

  if(!checkForOver)
    return null;
  else{
    return gameOver(board);
  }
}

function checkForOver(board, P1_index, P2_index){
	let resultP1=totalPoints(board,0,P1_index);
	let resultP2=totalPoints(board,(+P1_index+1), P2_index);

	if(resultP1==0 || resultP2==0) return true;
	return false;
}

function totalPoints(board, start, end){
	let result=0;
	for(i=start; i<end; i++)
		result = result+1*board[i]; //1*board to force addition not concatenation
	return result;
}

function gameOver(board){
	if(board[P1_index] < board[P2_index]) return "lose"; //P2 wins
	else if(board[P1_index] > board[P2_index]) return "win"; //P1 wins
	else return "tie"; //Tie
}

function convertBoardToObject(board, response, turn, size){
  let P1_index = size;
  let P2_index = size*2+1;
  let fstUser, sndUser;
  for(const v in response['sides']){
    if(v === turn){
      response['sides'][v].store = board[P1_index];
      for(let i=0; i<size; i++)
        response['sides'][v].pits[i] = board[i];
    }
    else{
      response['sides'][v].store = board[P2_index];
      for(let i=P1_index+1; i<P2_index; i++)
        response['sides'][v].pits[i] = board[i];
    }
  }

  return response;
}

function convertObjectToBoard(response, turn, size){
    let P1_index = size;
    let P2_index = size*2+1;
    let board = new Array(size*2+2);
    let key = response['sides'];
    let fstUser, sndUser;

    for(const v in key){
      if(v === turn){
        fstUser = key[v];
      }
      else{
        sndUser = key[v];
      }
    }


    board[P1_index] = fstUser.store; //isto pode nao ser a maneira correta de aceder
    for(let i=0; i<size; i++){
        board[i] = fstUser.pits[i];
    }
    for(let i=0; i<size; i++){
        board[i+1+P1_index] = sndUser.pits[i];
    }
    board[P2_index] = sndUser.store;

    return board;
}

function updateSeeds(state, seeds, mode, board, size){
    let P1_index = size;
    let P2_index = size*2+1;
  	board[state++]  = 0;

  	while(seeds > 1){
  		if(state == P1_index && mode==="P2") state++;
  		else if(state == P2_index && mode==="P1") state = 0;
  		else{
  			if(state>P2_index) state = 0; //in case it updated beyond the value

  			board[state++]++; // certificar se não atualiza o state antes de atualizar o valor de board[state]
  			seeds--;

  		}
  	}
  	if(state == P1_index && mode==="P2") state++;
  	else if(state == P2_index && mode==="P1") state = 0;

  	if((mode==="P1" && state==P1_index) || (mode==="P2" && state==P2_index)) {board[state++]++; seeds--; extraTurn=true;} //+1 turn
  	else if(board[state]==0){
  		board[state] += 1 + board[P2_index - 1 - state]; //estado atual + ultima semente + semente do lado oposto
  		board[P2_index - 1 - state] = 0;
  		seeds--;
  	}
  	else{
  		board[state]++;
  		seeds--;
  	}
  	return board;
}
