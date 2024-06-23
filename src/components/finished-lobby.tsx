import { Room } from "@/models/room";
import { Button } from "./ui/button";
import { backToLobby } from "@/data/services";
import { useAuth } from "@/hoooks/auth";
import { useNavigate } from "react-router";
import { closeRoomWS } from "@/data/websocket";

interface Props {
  game: Room;
}
export function FinishedLobby({ game }: Props) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const handleBackToLob = async () => {
    await backToLobby(game.id, user!.id);
    closeRoomWS(game.id)
    navigate("/home");
  };

  return (
    <div className="flex-[1.2] flex justify-center flex-col items-center text-center border-r space-y-6">
      <h2 className="text-5xl">Parabéns, temos um vencedor!</h2>

      <div className="space-y-6 text-center">
        <p className="text-4xl">{game.winner?.name || game.players[0].name}</p>

        <Button onClick={handleBackToLob}>Voltar ao lobby</Button>
      </div>
    </div>
  );
}
