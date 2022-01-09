

const fs = require('fs');
const crypto = require('crypto');


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
        ranking(request, response, query);
        break;
      default:
        response.writeHead(404);
        response.end(`POST inválido '${url.pathname}'\n`);
        break;
    }
  });

  request.on("error", (err) =>{
    response.writeHead(400);
    response.end();
  });
}

async function ranking(request, response, data){
  const path = config.createFile('ranking.json');
  const content = "";
  fs.readFile(path, (err, data) => {
    if(err){
      response.writeHead(404);
      response.end("Couldn't read file");
    }
    else {
      content = data;
    }
  });

  const rankingFile = JSON.parse(content);
  const ranking = [];
  Object.keys(rankingFile).forEach((nick) =>{
    ranking.push({
      ...rankingData[nick],
      nick
    });
  });

  response.writeHead(200, {'Content-Type':'application/json'});
  response.end(`${JSON.stringify({"ranking":ranking})}\n\n`);
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
        response.end("Registo não processado de momento.\n");
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
  catch(){}

  if(!userVerified){
      response.writeHead(400);
      response.end("Registo inválido.\n");
  }

  const gameHash = data.game;
  games.playing.splice(gameHash);

}

async function join(request, response, data, games){
  if(data.group != group){
    response.writeHead(400);
    response.end("Grupo errado.\n");
    return;
  }

  let userVerified = false;
  try{
    userVerified = await userVerification(data);
  }
  catch(){}

  if(!userVerified){
      response.writeHead(400);
      response.end("Registo inválido.\n");
  }

  let game = games.waiting.pop();
  if(!game){
    let gameHash = createHash(data.size, data.inital);
    game = {
      "gameHash" : gameHash,
      "nick" : data.nick,
      "size" : data.size,
      "initial" : data.initial
    };
    games.waiting[gameHash] = game;
  }
  else{
    games.playing[game.gameHash] = {
      "game" : game.gameHash,
      "initial" : game.initial,
      "size" : game.size,
      "board" : {
        "sides" : {
            game.nick : {
              "store" : 0,
              "pits" : new Array(game.size).fill(game.initial)
            },
            data.nick : {
              "store" : 0,
              "pits" : new Array(game.size).fill(game.initial)
            }
          },
        "turn" : game.nick
      }
    });
  }

  response.writeHead(200, { 'Content-Type': 'application/json' });
  response.end(`${JSON.stringify({ game: game.gameHash})}\n\n`);
}

function userVerification(user){
  const path = config.createFile("register");

  const password = crypto
    .createHash("md5")
    .update(user.password)
    .digest("hex");

  let verify = new Promise((resolve, reject) => {
    fs.readFile(path, (err, stats) =>{
      if(err)
        reject(false);
      else{
        let data = JSON.parse(stats.toString());
        for(let listUser of data){
          if(listUser.nick === user.nick){
            if(listUser.password === password)
              resolve(true);
            else
              reject(false);
          }
          else
            reject(false);
        }
      }
    });
  }
  return verify;
}
