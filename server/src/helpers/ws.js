export function gameUpdate(io, roomId, data) {
  io.to(roomId).emit("game_updated", data);
}
