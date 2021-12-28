class Ranking{
  ranking = [];

  constructor(){
      const storedRanking = localStorage.getItem("ranking");
      if(storedRanking){
        this.ranking = JSON.parse(storedRanking);
      }
  }

  addNewRanking(user){
    const index = this.ranking.findIndex( (i) => i.username === user.user);

    if(index >=0){
      this.ranking[index] = {username: user.user, points: user.p1Wins, games: this.ranking[index].games+1};
    }
    else{
      this.ranking.push({username: user.user, points: 1, games: 1});
    }
  }

  renderRanking(localRanking){
    if(!localRanking){
      api.ranking(
        (response) => {
          response.ranking.forEach((entry) => {
            this.ranking.push({username: entry.username, points: entry.victories, games: entry.games});
          }
        )
      });
    }
    this._renderRanking();
  }

  _renderRanking(){
    localStorage.setItem("ranking", JSON.stringify(this.ranking));
    const rankings = document.getElementById('ranking');
    rankings.style.display="table";

    this.ranking.forEach((line, index) => {
        if(index>=10) return;
        let row = rankings.insertRow(-1);
        row.insertCell(0).innerHTML = index;
        row.insertCell(1).innerHTML = line.username; //userScore
        row.insertCell(2).innerHTML = line.points; //Wins
        row.insertCell(3).innerHTML = line.games; //Games
    });
  }

}
