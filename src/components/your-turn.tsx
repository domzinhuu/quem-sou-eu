import { CheckCircle2, SendIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { useEffect, useState } from "react";
import {
  emitWhoAmIWS,
  gameChangedWS,
  giveATryWS,
  sendCurrentQuestionWS,
} from "@/data/websocket";
import { Room } from "@/models/room";
import { nextTurn } from "@/data/services";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";

const formGuessSchema = z.object({
  whoAmI: z
    .string({ required_error: "Prencha seu palpite!" })
    .min(1, { message: "Prencha seu palpite!" }),
});

type FormGuess = z.infer<typeof formGuessSchema>;

interface Props {
  game: Room;
}

export function YourTurn({ game }: Props) {
  const [question, setQuestion] = useState<string>("");
  const form = useForm<FormGuess>({
    resolver: zodResolver(formGuessSchema),
    defaultValues: {
      whoAmI: "",
    },
  });

  const handleSendQuestion = () => {
    if (question) {
      sendCurrentQuestionWS(game.id, game.currentPlayer.id, question);
    }
  };

  const handleGiveATry = (data: FormGuess) => {
    giveATryWS(game.id, data.whoAmI);
  };

  const handleEndTurn = async () => {
    const res = await nextTurn(game.id);

    if (res.ok) {
      gameChangedWS(game.id);
      emitWhoAmIWS(game.id);
    }
  };

  useEffect(() => {
    emitWhoAmIWS(game.id);
  }, []);

  return (
    <div className="w-full flex justify-evenly flex-col gap-4 items-center border-r p-4">
      <h2 className="text-3xl lg:text-5xl px-4">Agora é a sua vez...</h2>

      {!game.currentPlayerQuestion && (
        <div className="w-full flex items-center flex-col gap-4 p-4">
          <Textarea
            value={question}
            onChange={(el) => setQuestion(el.target.value)}
            placeholder="Faça sua pergunta..."
          />
          <Button
            onClick={handleSendQuestion}
            disabled={!question}
            className="flex items-center gap-2"
          >
            <SendIcon /> Enviar
          </Button>
        </div>
      )}

      <div>
        <p className="p-4">
          Deseja arriscar um chute?
          <small>(Lembre-se se errar perde uma vida!)</small>
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleGiveATry)}>
            <div className="w-full">
              <FormField
                control={form.control}
                name="whoAmI"
                render={({ field }) => (
                  <FormItem className="flex-1 text-center">
                    <div className="flex items-center">
                      <FormControl>
                        <Input
                          placeholder="Precisa ser o nome exato!"
                          className="h-10 rounded-r-none "
                          {...field}
                        />
                      </FormControl>
                      <Button
                        type="submit"
                        variant="success"
                        size="icon"
                        className="h-10 w-20 rounded-l-none"
                      >
                        <CheckCircle2 />
                      </Button>
                    </div>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
      </div>

      <div className="flex items-center gap-4">
        <Button onClick={handleEndTurn} variant="destructive" size="lg">
          Encerrar seu turno
        </Button>
      </div>
    </div>
  );
}
