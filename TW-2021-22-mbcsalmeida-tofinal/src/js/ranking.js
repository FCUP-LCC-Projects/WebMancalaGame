class Ranking{
  ranking = [];

  constructor(){
      const storedRanking = localStorage.getItem("ranking");
      if(storedRanking){
        this.ranking = JSON.parse(storedRanking);
      }
  }

  addNewRanking(user){
    const index = this.ranking.findIndex( (i) => i.username === user);

    if(index >=0){
      this.ranking[index] = {username: user, points: this.ranking[index].points+1, games: this.ranking[index].games+1};
    }
    else{
      this.ranking.push({username: user.user, points: 1, games: 1});
    }

    this._sortRanking();
  }

  renderRanking(localRanking){
    if(!localRanking){
      api.ranking(
        (response) => {
          response.ranking.forEach((entry) => {
            this.ranking.push({username: entry.nick, points: entry.victories, games: entry.games});
          }
        )
      });
    }
    console.log(this.ranking);
    this._sortRanking();
    this._renderRanking();
  }

  _sortRanking(){
    this.ranking.sort((a,b) => {
      return b.points - a.points;
    })
  }

  _renderRanking(){
    localStorage.setItem("ranking", JSON.stringify(this.ranking));
    const rankings = document.getElementById('ranking');
    rankings.style.display="table";

    this.ranking.forEach((line, index) => {
        if(index>=10) return;
        let row = rankings.insertRow(-1);
        row.insertCell(0).innerHTML = index+1;
        row.insertCell(1).innerHTML = line.username; //userScore
        row.insertCell(2).innerHTML = line.points; //Wins
        row.insertCell(3).innerHTML = line.games; //Games
    });
  }

  clearTable(){
    const table = document.getElementById("ranking");
    for(let i=table.rows.length-1; i>1; i--){
      table.deleteRow(i);
    }
  }
}
