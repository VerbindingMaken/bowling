import { PlayerScore } from "./player-score";

export interface PlayerBoard {
  name: string,
  playerID: string;
  turn: boolean,
  playerTotal: number;
  playerScore: PlayerScore[]
}