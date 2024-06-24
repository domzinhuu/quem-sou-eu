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
    <div className="relative flex-[1.2] flex justify-center flex-col items-center text-center border-r space-y-6 overflow-hidden">
      <h2 className="text-5xl">Parabéns, temos um vencedor!</h2>
      <div className="absolute top-0">
          <Lottie animationData={animationData} />
        </div>
      <div className="space-y-6 text-center z-50">
        <p className="text-4xl">{game.winner?.name || game.players[0].name}</p>
        <Button onClick={handleBackToLob}>Voltar ao lobby</Button>
       
      </div>
    </div>
  );
}
