import { IFrameScore } from "./player-score";

export interface IPlayerBoard {
  name: string,
  playerID: string;
  turn: boolean,
  playerTotal: number;
  frames: IFrameScore[]
}