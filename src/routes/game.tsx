import { FinishedLobby } from "@/components/finished-lobby";
import { Lobby } from "@/components/lobby";
import { Navbar } from "@/components/navbar";
import { SpecTurn } from "@/components/spec-turn";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { YourTurn } from "@/components/your-turn";
import { getGameSession } from "@/data/services";
import { useAuth } from "@/hoooks/auth";
import { Player } from "@/models/player";
import { Question } from "@/models/question";
import { Room } from "@/models/room";
import { socketIo } from "@/ws/socket.io";
import { CheckCircle2, HeartIcon, ThumbsDown, ThumbsUp } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import errou from "@/assets/errou.mp3";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function GamePage() {
  const { user } = useAuth();
  const [mobileAction, setMobileAction] = useState<
    "player" | "match" | "history"
  >("match");

  const { toast } = useToast();
  const [game, setGame] = useState<Room>({} as Room);
  const [whoAmI, setWhoAmI] = useState<string>("");
  const [myHistory, setMyHistory] = useState<Question[]>([]);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const audio = new Audio(errou);

  useEffect(() => {
    const roomName = searchParams.get("room") || "";
    const userId = user?.id || "";
    getGameSession(userId, roomName)
      .then((result) => {
        setGame(result);

        if (result) {
          const player = result.players?.find((p: Player) => p.id === user?.id);
          setMyHistory(player?.questions || []);
        }

        socketIo.emit("refresh_user", { roomId: result.id });
      })
      .catch(() => navigate("/home"));

    socketIo.on("game_updated", (data: Room) => {
      setGame(data || {});
      if (data) {
        const player = data.players?.find((p) => p.id === user?.id);
        setMyHistory(player?.questions || []);
      }
    });

    socketIo.on("current_player_count", (counter) => {
      console.log(counter);
    });

    socketIo.on("next_turn", (data) => {
      setGame(data);
    });

    socketIo.on("show_whoAmI", (value) => {
      setWhoAmI(value);
    });

    socketIo.on(
      "new_player_joined",
      ({ newPlayerName }: { newPlayerName: string }) => {
        toast({
          description: `${newPlayerName} entrou na sala!`,
        });
      }
    );

    socketIo.on("received_vote", ({ playerName, vote }) => {
      toast({
        variant: `${vote ? "success" : "destructive"}`,
        title: `Jogador ${playerName} respondeu...`,
        description: `${vote ? "SIM" : "NÃO"}`,
      });
    });

    socketIo.on("wrong_guess", ({ guess }) => {
      toast({
        variant: "info",
        title: `${user?.name} errou o chute...`,
        description: `( ${guess} ) foi o palpite!`,
      });
      audio.play();
    });
    return () => {
      socketIo.off("connect");
      socketIo.off("game_update");
      socketIo.off("current_player_count");
      socketIo.off("next_turn");
      socketIo.off("show_whoAmI");
      socketIo.off("new_player_joined");
      socketIo.off("received_vote");
      socketIo.off("wrong_guess");
    };
  }, []);

  const player = game.players?.find((p) => p.id === user!.id);

  return (
    <>
      <Navbar roomId={game.id} />
      <div className="flex flex-col lg:flex-row min-h-[480px] lg:h-full">
        <div
          className={cn(
            "w-96 border-r hidden  flex-1 lg:flex-[0.7] lg:flex flex-col justify-between",
            { flex: mobileAction === "player" }
          )}
        >
          <div className="px-4 py-2 border-b">
            <h2 className="text-2xl ">Jogadores</h2>
          </div>

          <ul className="p-4 space-y-2 overflow-y-auto h-[380px]">
            {game.players &&
              game.players.map((p) => {
                if (p.id !== user!.id) {
                  return (
                    <li
                      key={p.id}
                      data-active={p.id === game.currentPlayer?.id}
                      className="data-[active=true]:bg-slate-100 p-2 rounded-lg data-[active=true]:font-bold"
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          {game.votes[p.id] && (
                            <CheckCircle2
                              className="text-emerald-600"
                              size={16}
                            />
                          )}
                          <p>
                            {p.name}{" "}
                            {game.hostId === p.id ? (
                              <span className="font-bold text-xs">(host)</span>
                            ) : (
                              ""
                            )}
                          </p>
                        </div>
                        {game.gameStatus !== "stopped" && (
                          <div className="flex items-center gap-1">
                            {Array.from({ length: p.life }).map((_, i) => (
                              <HeartIcon key={i} size={16} fill="red" />
                            ))}
                          </div>
                        )}
                      </div>
                    </li>
                  );

                  return null;
                }
              })}
          </ul>

          <div className="flex justify-between items-center p-6 bg-slate-100 border-t">
            <p className="font-bold text-lg">
              Você{" "}
              {game.hostId === user!.id ? (
                <span className="font-bold text-xs">(host)</span>
              ) : (
                ""
              )}
            </p>

            <div className="flex items-center">
              <HeartIcon fill={player?.life ? "red" : "black"} />
              <span className="text-lg">x{player?.life || 0}</span>
            </div>
          </div>
        </div>
        
        <div
          className={cn("flex-1 lg:flex-[1.2] h-full", {
            hidden: mobileAction !== "match",
          })}
        >
          {game.gameStatus === "stopped" ? (
            <Lobby isHost={user?.id === game.hostId} roomId={game.id} />
          ) : game.gameStatus === "finished" ? (
            <FinishedLobby game={game} />
          ) : user?.id === game.currentPlayer?.id ? (
            <YourTurn game={game} />
          ) : (
            <SpecTurn whoAmI={whoAmI} game={game} />
          )}
        </div>

        <div
          className={cn("flex-1 lg:flex-[0.7] hidden lg:flex flex-col border-l", {
            flex: mobileAction === "history",
          })}
        >
          <h2 className="px-4 py-2 border-b text-2xl">Histórico</h2>
          <div className="flex-1 h-full">
            <ul className="space-y-4 p-4 overflow-y-auto h-[480px]">
              {myHistory &&
                myHistory.map((q) => (
                  <li
                    className="flex items-center justify-between"
                    key={q.text}
                  >
                    <p>{q.text}</p>
                    <div className="flex items-center gap-2">
                      {q.positiveVote > q.negativeVote ? (
                        <Badge
                          variant="success"
                          className="flex items-center gap-2 text-sm"
                        >
                          SIM
                          <ThumbsUp size={16} />
                        </Badge>
                      ) : q.positiveVote < q.negativeVote ? (
                        <Badge
                          variant="destructive"
                          className="flex items-center gap-2 text-sm"
                        >
                          NÃO
                          <ThumbsDown size={16} />
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="flex items-center gap-2 text-sm"
                        >
                          {q.positiveVote}
                          <ThumbsUp size={14} />
                          <span> - </span>
                          {q.negativeVote}
                          <ThumbsDown size={14} />
                        </Badge>
                      )}
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="lg:hidden w-full flex items-center">
        <Button
          onClick={() => setMobileAction("player")}
          className="flex-1 rounded-r-none h-14"
          variant="outline"
        >
          Jogadores
        </Button>
        <Button
          onClick={() => setMobileAction("match")}
          className="flex-1 rounded-l-none rounded-r-none h-14"
          variant="outline"
        >
          Partida
        </Button>
        <Button
          onClick={() => setMobileAction("history")}
          className="flex-1 rounded-l-none h-14"
          variant="outline"
        >
          Histórico
        </Button>
      </div>
    </>
  );
}
