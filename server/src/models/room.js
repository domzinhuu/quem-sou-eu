export class Room {
  constructor(data) {
    this.id = data.id || crypto.randomUUID();
    this.gameStatus = "stopped";
    this.name = data.roomName;
    this.capacity = data.capacity[0];
    this.hostId = data.hostId;
    this.isSecure = data.isSecure;
    this.password = data.password;
  }
}
