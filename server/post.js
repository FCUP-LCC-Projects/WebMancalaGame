const fs = require('fs');
const crypto = require('crypto');

const game = require('./game.js')
const config = require('./config.js');
const group = 18;

doPostRequest = function(url, request, response, state){
  let data = "";
  let query = "";

  request.on("data", chunk =>{
    data += chunk;
  });
  request.on("end", ()=>{
    query = data ? JSON.parse(data) : {};
    response.setHeader('Access-Control-Allow-Origin', '*');

    switch(url.pathname){
      case '/register':
        register(request, response, query);
        break;
      case '/ranking':
        ranking(request, response);
        break;
      case '/join':
        join(request, response, query, state);
        break;
      case '/leave':
        leave(request, response, query, state);
        break;
      case '/notify':
        notify(request, response, query, state);
        break;
      default:
        response.writeHead(404);
        response.end(`POST invalido '${url.pathname}'\n`);
        break;
    }
  });

  request.on("error", (err) =>{
    response.writeHead(400);
    response.end();
  });
}

async function ranking(request, response){
  const path = config.createFile('ranking.json', []);
  let rankingFile;

  const content = fs.readFileSync(path);
  rankingFile = JSON.parse(content);


  response.writeHead(200, {'Content-Type':'application/json'});
  response.end(`${JSON.stringify({"ranking":rankingFile})}\n\n`);
}

async function register(request, response, data){
  const path = config.createFile('register', []);

  const password = crypto
    .createHash('md5')
    .update(data.password)
    .digest('hex');

  let user = {"nick": data.nick, "password": password};

  fs.readFile(path, (err, stats) =>{
    if(!err){
      let dados =  JSON.parse(stats.toString());
      let registered = false;

      for(let listUser of dados){
        if(listUser.nick === user.nick){
          registered = true;

          if(listUser.password === password){
            response.writeHead(200, {'Content-Type' : 'application/json'});
            response.end(`${{}.toString()}\n\n`);
            return;
          }
          else{
            response.writeHead(401, {'Content-Type' : 'application/json'});
            response.end(`${{error: "Utilizador registado com outra password"}.toString()}\n\n`);
            return;
          }
        }
      }

      if(!registered){
        dados.push(user);

        fs.writeFile(path, JSON.stringify(dados), (err) =>{
          if(!err){
            response.writeHead(200, {'Content-Type' : 'application/json'});
            response.end(`${{}.toString()}\n\n`);
            return;
          }
        });
      }
      else{
        response.writeHead(400, {'Content-Type' : 'application/json'});
        response.end("Registo nao processado de momento.\n");
        return;
      }
    }
  });
}

async function leave(request, response, data, games){
  let userVerified = false;
  try{
    userVerified = await userVerification(data);
  }
  catch(e){ console.log(e);}

  if(!userVerified){
      response.writeHead(401);
      response.end("Registo invalido.\n");
      return;
  }

  const gameHash = data.game;
  let key;

  //leave game
  if(games.playing[gameHash]){
  key = games.playing[gameHash].board.sides;

  let fstUser, sndUser;
  for(const v in key){
    if(v === data.nick){
      fstUser = key[v];
    }
    else{
      sndUser = key[v];
    }
  }
  if(data.nick === fstUser)
    games.playing[gameHash].winner = sndUser;
  else if(data.nick == sndUser)
    games.playing[gameHash].winner = fstUser;

    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end(`${{}.toString()}\n\n`);

    results(games, gameHash);
    games.playing.splice(gameHash);
  }
  else{
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end(`${{}.toString()}\n\n`);
  }
}

async function notify(request, response, data, games){
  let userVerified = false;
  try{
    userVerified = await userVerification(data);
  }
  catch(e){ console.log(e);}

  if(!userVerified){
      response.writeHead(401);
      response.end("Registo invalido.\n");
      return;
  }

  const gameHash = data.game;
  if(!games.playing[gameHash]){
    response.writeHead(400);
    response.end("Jogo invalido.\n");
    return;
  }

  if(data.move){
    games.playing[gameHash].board = game.processMove(games, data);
  }

  games.playing[gameHash].board.turn = game.decideTurn(games.playing[gameHash].board, data);
  games.playing[gameHash].winner = game.getWinner(games, data);

  response.writeHead(200, { 'Content-Type': 'application/json' });
  response.end(`${{}.toString()}\n\n`);

  if(games.playing[gameHash].winner === "tie"){
    games.playing[gameHash].winner = null;
    results(games, gameHash);
  }
  else if(games.playing[gameHash].winner)
    results(games, gameHash);
  else {
    update(games, gameHash);
  }
}

async function join(request, response, data, games){

  if(data.group != group){
    response.writeHead(401);
    response.end("Grupo errado.\n");
    return;
  }

  let userVerified = false;
  try{
    userVerified = await userVerification(data);
  }
  catch(e){ console.log("Unverified "+e);}

  if(!userVerified){
      response.writeHead(401);
      response.end("Registo invalido.\n");
      return;
  }

  let game = games.waiting[games.awaitingGameHash.shift()];

  if(!game){
    let gameHash = config.createHash(data.size, data.inital);
    game = {
      "gameHash" : gameHash,
      "nick" : data.nick,
      "size" : data.size,
      "initial" : data.initial
    };
    games.waiting[gameHash] = game;
    games.awaitingGameHash.push(gameHash);
  }
  else{
    games.playing[game.gameHash] = {
      "initial" : game.initial,
      "size" : game.size,
      "board" : {
        "turn" : game.nick,
        "sides" : {
            [game.nick] : {
              "store" : 0,
              "pits" : new Array(game.size).fill(game.initial)
            },
            [data.nick] : {
              "store" : 0,
              "pits" : new Array(game.size).fill(game.initial)
            }
          }
      }
    };
    games.playing[game.gameHash].responses = [];
    games.playing[game.gameHash].responses.push(games.waiting[game.gameHash].response);
    delete games.waiting[game.gameHash];
  }

  response.writeHead(200, { 'Content-Type': 'application/json' });
  response.end(`${JSON.stringify({ game: game.gameHash})}\n\n`);
}

function update(state, gameHash){
  let board = state.playing[gameHash].board;
  state.playing[gameHash].responses.forEach(objectInside => {
    for(let user in objectInside){
      console.log(user);
      objectInside[user].write(`data : ${JSON.stringify({
          board : board
        })}\n\n`);
      }
  });
}

function results(state, gameHash){
  state.playing[gameHash].responses.forEach(objectInside => {
    for(let user in objectInside){
      console.log(user);
      objectInside[user].write(`data : ${JSON.stringify({
          board : board
        })}\n\n`);
      }
  });
}

function userVerification(user){
  const path = config.createFile("register", []);

  const password = crypto
    .createHash("md5")
    .update(user.password)
    .digest("hex");

  let verify = new Promise((resolve, reject) => {
    fs.readFile(path, (err, stats) =>{
      if(!err){
        let data = JSON.parse(stats.toString());
        for(let listUser of data){
          if(listUser.nick === user.nick){
            //console.log("PAST NICK VERIFICAITON");
            if(listUser.password === password){
              //console.log("PASSWORD VERIFICAITON");
              resolve(true);
              break;
            }
            else{
              //console.log("NO PASSWORD VERIFICAITON");
              resolve(false);
              break;
            }
          }
        }
        resolve(false);
      }
      else {
        reject(false);
      }
    });
  });
  return verify;
}
