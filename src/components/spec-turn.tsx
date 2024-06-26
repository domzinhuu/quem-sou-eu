import { Loader2Icon, ThumbsDown, ThumbsUp } from "lucide-react";
import { Button } from "./ui/button";
import { Room } from "@/models/room";

import { sendVoteWS } from "@/data/websocket";
import { useAuth } from "@/hoooks/auth";

interface Props {
  game: Room;
  whoAmI: string;
}
export function SpecTurn({ game, whoAmI }: Props) {
  const { user } = useAuth();

  const handleVote = (vote: boolean) => {
    sendVoteWS(game.id, user!.id, vote);
  };

  return (
    <div className="flex-[1.2] gap-8 flex justify-evenly flex-col items-center border-r">
      <h2 className="text-3xl lg:text-5xl">Agora é a vez de...</h2>

      <div className="space-y-2 text-center">
        <p className="text-4xl">{game.currentPlayer?.name}</p>
        <p className="text-3xl font-thin">{whoAmI}</p>
      </div>

      {!game.currentPlayerQuestion ? (
        <div className="flex items-center gap-2 p-6">
          <Loader2Icon className="animate-spin" size={36} />
          <p>Aguardando pergunta do jogador...</p>
        </div>
      ) : !game.votes[user!.id] ? (
        <div className="text-center space-y-2">
          <p>Responda a pergunta:</p>
          <p className="text-2xl font-semibold">{game.currentPlayerQuestion}</p>

          <div className="w-full flex justify-around p-6 gap-4">
            <Button
              onClick={() => handleVote(true)}
              className="flex items-center gap-2"
              size="lg"
            >
              <ThumbsUp /> Sim
            </Button>

            <Button
              onClick={() => handleVote(false)}
              className="flex items-center gap-2"
              variant="destructive"
              size="lg"
            >
              <ThumbsDown /> Não
            </Button>
          </div>
        </div>
      ) : (
        <div className="w-full flex justify-around p-6 gap-4 animate-pulse">
          <p>Aguarde o fim do turno de {game.currentPlayer.name}...</p>
        </div>
      )}
    </div>
  );
}
