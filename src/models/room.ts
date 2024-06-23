import { Player } from "./player";

export type Room = {
  id: string;
  name: string;
  capacity: number;
  hostId: string;
  isSecure: boolean;
  queue: number;
  currentPlayer: Player;
  currentPlayerQuestion?: string;
  gameStatus: "stopped" | "running" | "finished";
  winner: Player;
  players: Player[];
  votes: { [key: string]: boolean };
};
