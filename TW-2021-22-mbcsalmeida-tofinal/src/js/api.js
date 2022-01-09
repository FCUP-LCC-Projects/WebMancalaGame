class API{
  baseURL = "http://twserver.alunos.dcc.fc.up.pt:8008";
  //baseURL = "http://twserver.alunos.dcc.fc.up.pt:8118/server";
  updatedURL;
  eventSource;

  constructor(){}

  makeURL(config){
    let queryString;
    const command = "update";

    const queryFields = new URLSearchParams({ nick: config.username, game: config.gameHash});

    queryString = `?${queryFields.toString()}`;
    const url = `${this.baseURL}/${command}${queryString}`

    this.updatedURL = url;
  }

  startEvent(){
    this.eventSource = new EventSource(this.updatedURL);
  }

  closeEvent(){
    this.eventSource.close();
  }

  post(command, data, successCallback, errorCallback = null){
    const postURL = `${this.baseURL}/${command}`;

    fetch(postURL, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {"Content-type" : "application/x-www-form-urlencoded; charset=UTF-8"}
    }).then(function(response){
      if(response.ok){
        console.log(response);
        if(command=="register" || command=="leave" || command=="notify"){
          successCallback();
        }
        else
          response.json().then(successCallback);
      }
      else{
        response.json().then(errorCallback);
      }
    }).catch(() => typeof errorCallback === 'function' ? console.log("error") : null);
  }

  register(data, successCallback, errorCallback = null){
        this.post("register", data, successCallback, errorCallback);
    }

  join(data, successCallback, errorCallback = null){
      this.post("join", data, successCallback, errorCallback);
    }

  leave(data, successCallback, errorCallback = null){
      this.post("leave", data, successCallback, errorCallback);
    }

  notify(data, successCallback, errorCallback= null){
      this.post("notify", data, successCallback, errorCallback);
  }

  ranking(successCallback, errorCallback = null){
      this.post("ranking", {}, successCallback, errorCallback);
  }

  update(successCallback, errorCallback = null){
    this.eventSource.onmessage = function(event){
      const response = JSON.parse(event.data);
      successCallback(response);
    }
  }
}
