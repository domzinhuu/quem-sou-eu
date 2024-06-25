import { Button } from "@/components/ui/button";
import { useAuth } from "@/hoooks/auth";
import { User } from "@/models/user";
import { socketIo } from "@/ws/socket.io";
import { useNavigate } from "react-router-dom";

export function Root() {
  const navigate = useNavigate();
  const { user, login, updateInfo } = useAuth();

  const handleSignIn = () => {
    if (!user) {
      const userName = prompt("Informe seu nome");

      if (!userName) {
        alert("É necessário informar um nome");
        return;
      }

      login(userName);
    } else {
      const updateUser = { ...user, socketId: socketIo.id } as User;
      updateInfo(updateUser);
    }

    navigate("/home");
  };

  return (
    <div className="w-full flex flex-col justify-center space-y-4 bg-white p-4 rounded-b-lg">
      <h2 className="font-bold text-3xl"> Regras do Jogo: Quem Sou Eu?</h2>

      <p className="w-full max-w-[760px]">
        Bem-vindo ao "Quem Sou Eu?", um jogo divertido e envolvente para 2 a 30
        jogadores! Aqui estão as regras para garantir que todos se divirtam e
        tenham uma experiência incrível:
      </p>

      <div className="space-y-2 overflow-y-auto h-[380px]">
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-slate-50 rounded-lg px-4 py-2">
            <h2 className="text-2xl font-bold">Objetivo do Jogo</h2>
            <p>
              Descobrir qual personagem, objeto ou figura você é, fazendo
              perguntas que podem ser respondidas com "sim" ou "não".
            </p>
          </div>

          <div className="bg-slate-50 rounded-lg p-4">
            <h2 className="text-2xl font-bold">Preparação do Jogo</h2>
            <p>
              Cada jogador recebe o nome de um objeto.
              Você saberá a identidade de todos os outros jogadores, exceto a
              sua própria.
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-bold">Jogando</h2>

        <div className="grid grid-cols-1 gap-4">
          <div className="bg-slate-50 rounded-lg p-4">
            <h3 className="font-bold text-lg">Rodada de Perguntas:</h3>
            <p>
              Cada jogador, em sua vez, pode fazer uma pergunta sobre sua
              própria identidade. As perguntas devem ser respondidas com "sim"
              ou "não" pelos outros jogadores.
            </p>
          </div>

          <div className="bg-slate-50 rounded-lg p-4">
            <h3 className="font-bold text-lg">Chutes:</h3>
            <p>
              Se você acha que sabe quem é, pode arriscar um chute dizendo sua
              identidade. Cada jogador tem até 5 chances de chute durante o
              jogo.
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-bold">Eliminação:</h2>

        <div className="grid grid-cols-1 gap-4">
          <div className="bg-slate-50 rounded-lg p-4">
            <h3 className="font-bold text-lg">
              Se você errar um chute, perde uma chance.
            </h3>
            <p>
              Se errar 5 vezes, você é eliminado do jogo, e a partida continua
              sem você.
            </p>
          </div>
          <div className="bg-slate-50 rounded-lg p-4">
            <h3 className="font-bold text-lg">Vencendo o Jogo</h3>
            <p>
              O jogo continua até que um jogador descubra sua própria identidade
              corretamente.
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-bold">
          Esse jogador será o vencedor e o jogo termina.
        </h2>

        <div className="grid grid-cols-1 gap-4">
          <div className="bg-slate-50 rounded-lg p-4">
            <h3 className="font-bold text-lg">Dicas e Estratégias</h3>

            <p>
              Faça perguntas estratégicas que ajudam a eliminar várias
              possibilidades de uma só vez. Observe as respostas e chutes dos
              outros jogadores para ajustar suas perguntas.
            </p>
          </div>
        </div>

        <h2 className="font-bold text-2xl">Divirta-se!</h2>
        <p>
          Lembre-se, o objetivo é se divertir e testar suas habilidades de
          dedução. Boa sorte e que o melhor detetive vença!
        </p>
      </div>

      <div className="w-full flex justify-center">
        <Button size="lg" onClick={handleSignIn}>
          Entrar
        </Button>
      </div>
    </div>
  );
}
