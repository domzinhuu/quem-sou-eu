export class Player {
  constructor(data) {
    this.id = data.id || crypto.randomUUID();
    this.socketId = data.socketId;
    this.name = data.name;
    this.life = 5;
    this.whoAmI = "";
    this.questions = [];
  }
}
