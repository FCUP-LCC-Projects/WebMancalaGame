
doGetRequest = function(url, request, response, state){
  switch (url.pathname) {
    case '/update':
      doUpdate(url, request, response, state)
      break;
    default:
      response.writeHead(404);
      response.end(`GET inválido '${url.pathname}'`);
    }
}

doUpdate = (url, request, response, games) =>{
  const field = new URLSearchParams(url.search);
  let headers = {
    'Content-Type': 'text/event-stream',
    'Access-Control-Allow-Origin': '*',
    'Cache-Control' : 'no-cache',
    'Transfer-Encoding' : 'chunked',
    'Connection': 'keep-alive'
  };

  response.writeHeader(200, headers);

  let gameHash;
  if(field.has('game') && field.has('nick')){
    gameHash = field.get('game');
    let nick = field.get('nick')
    if(!games.playing[gameHash] && games.waiting[gameHash]){
      games.waiting[gameHash].response = {[nick] : response};
    }

    else if(games.playing[gameHash]){
      if(!games.playing[gameHash].responses[nick])
        games.playing[gameHash].responses.push({[nick] : response});
      }
  }
  if(games.playing[gameHash]){
      let board = games.playing[gameHash]['board'];

      games.playing[gameHash].responses.forEach(objectInside => {
        for(let user in objectInside){
          objectInside[user].write(`data : ${JSON.stringify({
              board : board
            })}\n\n`);
          }
      });
  }

  request.on('close', () => {
    console.warn(`Closing game '${gameHash}'`)
    response.end();
  });
}
