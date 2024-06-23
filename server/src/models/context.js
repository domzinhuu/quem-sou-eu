export class Context {
  constructor(data) {
    this.id = data.id;
    this.gameStatus = data.gameStatus;
    this.name = data.name;
    this.capacity = data.capacity;
    this.hostId = data.hostId;
    this.isSecure = data.isSecure;
    this.currentPlayer = data.currentPlayer;
    this.currentPlayerQuestion = data.currentPlayerQuestion || "";
    this.players = data.players;
    this.votes = data.votes = {};
    this.winner = data.winner || null;
    this.queue = data.queue || -1;
  }

  setCurrentPlayer() {
    let currentIndex = this.currentPlayer
      ? this.players.indexOf(this.currentPlayer) + 1
      : 0;

    if (currentIndex === this.players.length) {
      this.currentPlayer = this.players[0];
    } else {
      this.currentPlayer = this.players[currentIndex];
    }
  }

  setPlayerVote(playerId) {
    this.votes[playerId] = true;
  }

  resetVotes() {
    this.votes = {};
  }
}
