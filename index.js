
const config = require('./server/config.js');
const post = require('./server/post.js')
const get = require('./server/get.js')
const http = require('http');
const fs = require('fs');
const url = require('url');

const apiUrl = '/server';

let games = {
  awaitingGameHash : [],
  waiting: [],
  playing: []
}

const server = http.createServer(function (request, response) {
  const parsedUrl = url.parse(request.url, true);

  if(request.url.startsWith('/server/')){

    parsedUrl.pathname = parsedUrl.pathname.replace(apiUrl, "");
      switch(request.method){
        case 'POST':
          //console.log("POST REQUEST");
          doPostRequest(parsedUrl, request, response, games);
          break;
        case 'GET':
        console.log("GET REQUEST");
          doGetRequest(parsedUrl, request, response, games);
          break;
        default:
          response.writeHead(501);
          response.end("Não conseguimos responder o seu pedido.\n");
      }
  }
  else{
    fs.readFile(__dirname + (request.url === '/' ? '/index.html' : request.url), (error,data) =>{
      if(error){
        console.log("NO FILE");
        response.writeHead(404, {"Content-Type" : "text/plain; charset=utf-8"});
        response.end("Path not found");
        return;
      }
      const headers = {};
      if(request.url.endsWith('.css')){
        headers['Content-Type'] = 'text/css';
      }else if(request.url.endsWith('.js')){
        headers['Content-Type'] = 'text/javascript';
      }else if(request.url.endsWith('.png')){
        headers['Content-Type'] = 'image/png';
      }
      response.writeHead(200, headers);
      response.end(data);
    })
  }

  response.on('finish', () => {
    console.log(`[${request.method}] [${response.statusCode}] ${parsedUrl.pathname}`);
  })
}).listen(8118);
