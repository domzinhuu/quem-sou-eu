import { Question } from "./question";

export type Player = {
  id: string;
  socketId: string;
  name: string;
  life: 5;
  whoAmI?: string;
  questions: Question[];
};
