import { PlayerScore } from "./player-score";

export interface PlayerBoard {
  name: string,
  turn: boolean,
  playerScore: PlayerScore[]
}