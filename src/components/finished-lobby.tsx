import { Room } from "@/models/room";
import { Button } from "./ui/button";
import { backToLobby } from "@/data/services";
import { useAuth } from "@/hoooks/auth";
import { useNavigate } from "react-router";
import { closeRoomWS } from "@/data/websocket";
import { useToast } from "./ui/use-toast";
import { useEffect } from "react";
import { socketIo } from "@/ws/socket.io";
import applause from "@/assets/aplausos.mp3";
import Lottie from "lottie-react";
import animationData from "@/assets/winner.json";

interface Props {
  game: Room;
}
export function FinishedLobby({ game }: Props) {
  const { user } = useAuth();
  const { toast } = useToast();
  const audio = new Audio(applause);

  const navigate = useNavigate();
  const handleBackToLob = async () => {
    await backToLobby(game.id, user!.id);
    closeRoomWS(game.id, user?.name);
    navigate("/home");
  };

  useEffect(() => {
    audio.play();
    socketIo.on("player_leave_room", ({ playerName }) =>
      toast({
        variant: "destructive",
        description: `${playerName} saiu da sala!`,
      })
    );

    return () => {
      socketIo.off("player_leave_room");
    };
  }, []);

  return (
    <>
      <div className="relative min-h-[480px] lg:h-full justify-center flex flex-col text-center space-y-6 p-6">
        <h2 className="text-3xl px-6 lg:px-0 lg:text-5xl">
          Parabéns, temos um vencedor!
        </h2>

        <p className="text-4xl">{game.winner?.name || game.players[0].name}</p>
        <Button className="z-50" onClick={handleBackToLob}>
          Voltar ao lobby
        </Button>
        <div className="absolute left-0 top-0">
          <Lottie animationData={animationData} />
        </div>
      </div>
    </>
  );
}
