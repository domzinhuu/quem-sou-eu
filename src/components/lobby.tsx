import { startGame } from "@/data/services";
import { Button } from "./ui/button";
import { gameChangedWS } from "@/data/websocket";
import { useAuth } from "@/hoooks/auth";
interface Props {
  isHost: boolean;
  roomId: string;
}
export function Lobby({ isHost, roomId }: Props) {
  const { user } = useAuth();

  const handleStartGame = async () => {
    const res = await startGame(roomId, user!.id);

    if (res.ok) {
      gameChangedWS(roomId);
    }
  };

  return (
    <div className="flex items-center justify-around flex-col border-r p-6">
      <div className="max-w-[560px] w-full text-center space-y-4">
        <h2 className="text-3xl">Aguarde todos entrar na sala.</h2>
        <p>
          Caso inicie a partida, quem NÃO estiver na sala ficará de fora da
          rodada.
        </p>
      </div>
      {isHost && (
        <Button onClick={handleStartGame} size={"lg"} variant={"success"}>
          Iniciar Partida
        </Button>
      )}
    </div>
  );
}
