import { User } from "@/models/user";
import { defaultFetchOptions } from "@/utils/request.helper";
import { socketIo } from "@/ws/socket.io";

const baseUrl = import.meta.env.VITE_URL_API;

export function doLogin(username: string): User {
  const user: User = {
    id: crypto.randomUUID(),
    socketId: socketIo.id,
    name: username,
  };
  sessionStorage.setItem("user", JSON.stringify(user));
  return user;
}

export function updateSession(user: User) {
  sessionStorage.setItem("user", JSON.stringify(user));
}

export function getSession(): User | null {
  const user = sessionStorage.getItem("user");
  if (!user) return null;

  return JSON.parse(user);
}

export function clearSession() {
  sessionStorage.removeItem("user");
}

export async function createNewRoom(
  data: {
    roomName: string;
    capacity: number[];
    isSecure: boolean;
    password: string;
  },
  user: User
) {
  const options = {
    ...defaultFetchOptions,
    method: "POST",
    body: JSON.stringify({ data, user }),
  };

  const response = await fetch(`${baseUrl}/createRoom`, options);
  const result = await response.json();

  return result;
}

export async function enterRoom(data: { room: string; password: string }) {
  const options = {
    ...defaultFetchOptions,
    method: "POST",
    body: JSON.stringify(data),
  };

  const response = await fetch(`${baseUrl}/enterRoom`, options);

  return response.json();
}

export async function getGameSession(userId: string, roomName: string) {
  const url = `${baseUrl}/getGameSession?userId=${userId}&room=${roomName}`;
  const response = await fetch(url, defaultFetchOptions);

  if (!response.ok) {
    throw new Error("some error occur");
  }

  return response.json();
}

export async function getRoomList() {
  const response = await fetch(`${baseUrl}/roomList`, defaultFetchOptions);
  return response.json();
}

export async function startGame(roomId: string, userId: string) {
  const options = {
    ...defaultFetchOptions,
    method: "POST",
    body: JSON.stringify({ roomId, playerId: userId }),
  };

  const response = await fetch(`${baseUrl}/startGame`, options);

  return response.json();
}

export async function backToLobby(roomId: string, playerId: string) {
  const options = {
    ...defaultFetchOptions,
    method: "POST",
    body: JSON.stringify({ roomId, playerId }),
  };

  const response = await fetch(`${baseUrl}/removePlayerFromMatch`, options);

  return response.json();
}

export async function nextTurn(roomId: string) {
  const options = {
    ...defaultFetchOptions,
    method: "POST",
    body: JSON.stringify({ roomId }),
  };

  const response = await fetch(`${baseUrl}/nextTurn`, options);

  return response.json();
}
