import { socketIo } from "@/ws/socket.io";
import { PropsWithChildren, createContext, useEffect } from "react";

export const GameContext = createContext({});

export function GameProvider({ children }: PropsWithChildren) {
  useEffect(() => {
    socketIo.on("update_game", ({ data }) => console.log(JSON.stringify(data)));

    return () => {
      socketIo.off("update_game");
      socketIo.off("connect");
    };
  }, []);
  return <GameContext.Provider value={{}}>{children}</GameContext.Provider>;
}
