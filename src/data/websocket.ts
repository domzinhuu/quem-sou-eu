import { User } from "@/models/user";
import { socketIo } from "@/ws/socket.io";

export function newRoomCreatedWS() {
  socketIo.emit("new_room_created");
}

export function newPlayJoinedWS(roomId: string, user: User) {
  socketIo.emit("player_joined", { roomId, user });
}

export function gameChangedWS(roomId: string) {
  socketIo.emit("game_changed", roomId);
}

export function emitWhoAmIWS(roomId: string) {
  socketIo.emit("emit_who_am_i", roomId);
}

export function sendCurrentQuestionWS(
  roomId: string,
  playerId: string,
  question: string
) {
  socketIo.emit("emit_current_question", { roomId, playerId, question });
}

export function sendVoteWS(roomId: string, playerId: string, vote: boolean) {
  socketIo.emit("emit_vote", { roomId, playerId, vote });
}

export function giveATryWS(roomId: string, whoAmI: string) {
  socketIo.emit("emit_giveAtry", { roomId, whoAmI });
}

export function closeRoomWS(roomId: string) {
  socketIo.emit("emit_close_room", { roomId });
}
