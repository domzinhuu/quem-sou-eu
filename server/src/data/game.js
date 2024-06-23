import { Context } from "../models/context.js";
import { Player } from "../models/player.js";
import { Question } from "../models/question.js";

const gameItems = [
  "Geladeira",
  "Caneta",
  "Relógio",
  "Telefone",
  "Mesa",
  "Cadeira",
  "Computador",
  "Mouse",
  "Teclado",
  "Monitor",
  "Lâmpada",
  "Livro",
  "Ventilador",
  "Faca",
  "Tesoura",
  "Prato",
  "Copo",
  "Colher",
  "Garfo",
  "Panela",
  "Televisão",
  "Celular",
  "Tablet",
  "Câmera",
  "Bicicleta",
  "Moto",
  "Carro",
  "Avião",
  "Barco",
  "Micro-ondas",
  "Fogão",
  "Forno",
  "Liquidificador",
  "Batedeira",
  "Torradeira",
  "Cafeteira",
  "Ferro de passar",
  "Aspirador de pó",
  "Máquina de lavar",
  "Secadora",
  "Geladeira",
  "Freezer",
  "Ar-condicionado",
  "Chuveiro",
  "Torneira",
  "Pia",
  "Espelho",
  "Janela",
  "Porta",
  "Tapete",
  "Sofá",
  "Poltrona",
  "Cama",
  "Travesseiro",
  "Cobertor",
  "Lençol",
  "Armário",
  "Estante",
  "Gaveta",
  "Prateleira",
  "Rádio",
  "CD Player",
  "DVD Player",
  "Blu-ray Player",
  "Videogame",
  "Controle remoto",
  "Fone de ouvido",
  "Carregador",
  "Bateria",
  "Pilha",
  "Régua",
  "Calculadora",
  "Lápis",
  "Borracha",
  "Apontador",
  "Marcador",
  "Pincel",
  "Tinta",
  "Papel",
  "Caderno",
  "Agulha",
  "Linha",
  "Tesoura",
  "Botão",
  "Zíper",
  "Dedal",
  "Fita métrica",
  "Tesoura de costura",
  "Máquina de costura",
  "Ferro de passar roupas",
  "Cesto de roupas",
  "Cabide",
  "Gaveteiro",
  "Caixa organizadora",
  "Lixeira",
  "Sabão",
  "Detergente",
  "Esponja",
  "Vassoura",
  "Rodo",
  "Pá de lixo",
  "Aspirador de pó",
  "Limpador de vidros",
  "Desinfetante",
  "Álcool",
  "Papel higiênico",
  "Toalha",
  "Sabonete",
  "Shampoo",
  "Condicionador",
  "Escova de cabelo",
  "Pente",
  "Máquina de barbear",
  "Secador de cabelo",
  "Chapinha",
  "Modelador de cachos",
  "Cortador de unhas",
  "Pinça",
  "Lixa de unhas",
  "Creme hidratante",
  "Perfume",
  "Desodorante",
  "Rímel",
  "Batom",
  "Blush",
  "Pincel de maquiagem",
  "Base",
  "Corretivo",
  "Sombras",
  "Delineador",
  "Removedor de maquiagem",
  "Esfoliante",
  "Protetor solar",
  "Bronzeador",
  "Repelente",
  "Mochila",
  "Bolsa",
  "Carteira",
  "Porta-moedas",
  "Chaveiro",
  "Chave",
  "Guarda-chuva",
  "Óculos",
  "Óculos de sol",
  "Relógio de pulso",
  "Pulseira",
  "Anel",
  "Colar",
  "Brinco",
  "Pingente",
  "Aliança",
  "Broche",
  "Gargantilha",
  "Tiara",
  "Presilha",
  "Cinto",
  "Boné",
  "Chapéu",
  "Cachecol",
  "Luvas",
  "Meias",
  "Sapato",
  "Tênis",
  "Chinelo",
  "Sandália",
  "Bota",
  "Sapatilha",
  "Rasteirinha",
  "Mocassim",
  "Pijama",
  "Roupão",
  "Camiseta",
  "Camisa",
  "Blusa",
  "Regata",
  "Jaqueta",
  "Casaco",
  "Suéter",
  "Calça",
  "Bermuda",
  "Shorts",
  "Saia",
  "Vestido",
  "Macacão",
  "Cueca",
  "Calcinha",
  "Sutiã",
  "Meia-calça",
  "Legging",
  "Maiô",
  "Biquíni",
  "Sunga",
  "Óculos de natação",
  "Toca de natação",
  "Prancha de surfe",
  "Bola de futebol",
  "Bola de basquete",
  "Raquete de tênis",
  "Raquete de badminton",
  "Patins",
  "Skate",
  "Bicicleta",
  "Capacete",
  "Joelheira",
  "Cotoveleira",
  "Rede de vôlei",
  "Bola de vôlei",
  "Kite",
  "Dardos",
  "Boia",
  "Baralho",
  "Xadrez",
  "Damas",
  "Dominó",
  "Quebra-cabeça",
];

class Game {
  context = {};
  contextWhoAmIList = {};

  rooms = [];
  listRooms = [];

  addNewMatch(room) {
    this.context[room.id] = new Context({
      ...room,
      gameStatus: "stopped",
      players: [],
    });

    this.listRooms.push({
      id: room.id,
      name: room.name,
      isSecure: room.isSecure,
      gameStatus: room.gameStatus,
    });

    this.rooms.push(room);
  }

  newPlayerJoined(roomId, player) {
    this.context[roomId].players.push(player);
  }

  updateGameStatus(status, roomId) {
    this.context[roomId].gameStatus = status;
  }

  getRoomPlayer(roomId, playerId) {
    return this.context[roomId].players.find(
      (p) => p.id === playerId || p.socketId === playerId
    );
  }

  getCurrentRoomPlayer(roomId) {
    return this.context[roomId].currentPlayer;
  }

  removePlayerFromMatch(roomId, playerId) {
    this.context[roomId].players = this.context[roomId].players.filter(
      (p) => p.id !== playerId
    );
    return this.context[roomId].players.length;
  }

  nextPlayer(roomId) {
    const currentGame = new Context(this.context[roomId]);
    currentGame.setCurrentPlayer();
    currentGame.resetVotes();
    this.context[roomId] = currentGame;
    this.context[roomId].currentPlayerQuestion = "";
  }

  defineWhoAmI(roomId) {
    const players = this.context[roomId].players || [];

    players.map((p) => {
      const random = Math.floor(Math.random() * 100);

      if (!this.contextWhoAmIList[roomId]) {
        this.contextWhoAmIList[roomId] = {};
      }

      this.contextWhoAmIList[roomId][p.id] = gameItems[random];
    });
  }

  setPlayerQuestion(roomId, playerId, question) {
    this.context[roomId].players.map((p) => {
      if (p.id === playerId) {
        p.questions.push(new Question({ text: question }));
      }
      return p;
    });
    this.context[roomId].currentPlayerQuestion = question;
  }

  giveCurrentPlayerVote(roomId, playerId, vote) {
    const currentPlayer = new Player(this.getCurrentRoomPlayer(roomId));
    const player = this.context[roomId].players.find(
      (p) => p.id === currentPlayer.id
    );

    if (vote) {
      player.questions[player.questions.length - 1].positiveVote++;
    } else {
      player.questions[player.questions.length - 1].negativeVote++;
    }
    this.context[roomId].setPlayerVote(playerId);
  }

  endMatch(roomId) {
    const player = game.getCurrentRoomPlayer(roomId);
    this.context[roomId].winner = player;
    this.context[roomId].gameStatus = "finished";
  }

  validateGuess(roomId, guess) {
    const player = this.getCurrentRoomPlayer(roomId);

    if (!player) return;

    const whoAmI = this.contextWhoAmIList[roomId][player.id];

    if (whoAmI.toLowerCase() === guess.toLowerCase()) {
      this.endMatch(roomId, player);
      return true;
    }

    const updatedPlayer = this.context[roomId].players.find(
      (p) => p.id === player.id
    );
    updatedPlayer.life--;
    return false;
  }

  checkIfGameOver(roomId) {
    const player = this.getCurrentRoomPlayer(roomId);
    if (player.life === 0) {
      this.context[roomId].players = this.context[roomId].players.filter(
        (p) => p.id !== player.id
      );
    }

    if (this.context[roomId].players.length === 1) {
      this.context[roomId].gameStatus = "finished";
      return true;
    }

    return false;
  }
}

export const game = new Game();
