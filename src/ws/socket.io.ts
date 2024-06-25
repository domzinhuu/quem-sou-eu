import { io } from "socket.io-client";
const url = import.meta.env.VITE_WS_URL || "http://localhost:3334";

export const socketIo = io(url,{
  path: "/ws/",
});
