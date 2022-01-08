function doGetRequest(url, request, response, state){
  switch (parsedUrl.pathname) {
    case '/update':
      doUpdate(url, request, response, state)
      break;

    default:
      response.writeHead(404);
      response.end(`GET inválido '${url.pathname}'`);
    }
}

doUpdate(url, request, response, state){
  const field = new URLSearchParams(url.search);
  let gameHash;

  request.on('close', () => {
    console.warn(`Closing game '${gameHash}'`)
    response.end();
  });
}
