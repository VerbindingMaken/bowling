import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IPlayerBoard } from './models/player-board';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title: string;
  isGameStarted: boolean;
  isGameEnded: boolean;
  canAddPlayer: boolean;
  playerCount: number;
  newPlayer: string;

  pinsStanding: number;
  frameNumber: number;
  currentPlayer: number;
  scoreBoard: IPlayerBoard[];
  winMessage: string;

  constructor() {
    this.title = 'Bowling game';
    this.currentPlayer = 0;
    this.frameNumber = 0;
    this.pinsStanding = 10;
    this.scoreBoard = [];
    this.isGameStarted = false;
    this.isGameEnded = false;
    this.canAddPlayer = true;
    this.playerCount = 0;
    this.newPlayer = '';
    this.winMessage = '';
  }

  onAddPlayer(): void {
    let playerIDs = ['one', 'two', 'three', 'four'];
    this.scoreBoard.push({
      name: this.newPlayer.slice(0,20),
      playerID: playerIDs[this.playerCount],
      turn: false,
      playerTotal: 0,
      frames: []   
    });
    this.newPlayer = '';
    this.playerCount++;
    this.canAddPlayer = false;
  }

  onAddNextPlayer(): void {
    this.canAddPlayer = true;
  }

  onGameStart(): void {
    this.isGameStarted = true;
    this.scoreBoard[this.currentPlayer].turn = true;
    return;
    //Auto fill
    // return this.onThrow();
  }
  get throwNumber(): string {
    if (!this.scoreBoard[this.currentPlayer].frames[this.frameNumber]) {
      return 'one';
    }
    else {
      return 'two';
    }
  }

  onThrow(): void {
    let currentThrow = Math.floor(Math.random() * (this.pinsStanding + 1));
    // currentThrow = 10
    if (this.frameNumber === 10) {
     return this.updateBonusFrame(currentThrow);
    }
    else {
      return this.updateFrameScore(currentThrow);
    } 
  }
  
  // TEST
  // onThrow(currentThrow: number): void {
  //   if (this.frameNumber === 10) {
  //       return this.updateBonusFrame(currentThrow);
  //     }
  //     else {
  //       return this.updateFrameScore(currentThrow);
  //     }
  // }


  nextTurn(): void {
    //Reset frame
    this.scoreBoard[this.currentPlayer].turn = false;
    this.pinsStanding = 10;
    // Check if all players have taken their turn this frame
    if (this.currentPlayer < (this.playerCount - 1)) {
      this.currentPlayer++;
    } 
    // Else start new frame
    else if (this.frameNumber < 10 ) {
      this.frameNumber++;
      this.currentPlayer = 0;  
    } 
    // Check for game end
    if (this.frameNumber === 11) {
      return this.showWinner();
    }
    // Check for bonus frame
    if (this.frameNumber === 10 ) {
      // Check for spare or strike
      if (!(this.wasSpare(this.frameNumber - 1) || this.wasStrike(this.frameNumber - 1))) {
        if (this.playerCount > 1 && this.currentPlayer < (this.playerCount - 1)) {
          return this.nextTurn();
        }   
        else {
          return this.showWinner();
        } 
      }
    }
    this.scoreBoard[this.currentPlayer].turn = true;
    return;
    // Auto fill
    // return this.onThrow();
  }
  isLastBonusFrame(): boolean {
    return this.playerCount === 1 || this.currentPlayer === this.playerCount - 1;
  }

  updateFrameScore(currentThrow: number): void {
    //Check if this is fist throw
    if (this.throwNumber === 'one') {
      if (currentThrow < 10) {
        this.scoreBoard[this.currentPlayer].frames[this.frameNumber] = {
          throwOne: currentThrow,
          throwTwo: '',
          frameScore: currentThrow
        }
        this.updateBonusPoints(currentThrow, 'one');
        this.pinsStanding -= currentThrow;
        return;
      }
      if (currentThrow === 10) {
        this.scoreBoard[this.currentPlayer].frames[this.frameNumber] = {
          throwOne: 'X',
          throwTwo: '',
          frameScore: currentThrow
        }
        this.updateBonusPoints(currentThrow, 'one');
        this.calculateTotal();
        return this.nextTurn(); 
      }
    }
    //This is second throw
    if (this.throwNumber === 'two') {
      if (this.pinsStanding === currentThrow) {
        this.scoreBoard[this.currentPlayer].frames[this.frameNumber].throwTwo = '/';
      }
      else {
        this.scoreBoard[this.currentPlayer].frames[this.frameNumber].throwTwo = currentThrow;
      }
      // Update framescore
      this.scoreBoard[this.currentPlayer].frames[this.frameNumber].frameScore += currentThrow;
      // Check for bonus points 
      this.updateBonusPoints(currentThrow, 'two');
      this.calculateTotal();
      return this.nextTurn();
    }
  }
 
  wasStrike(frameNumber: number): boolean {
    return this.scoreBoard[this.currentPlayer].frames[frameNumber].throwOne === 'X';
  }
  wasSpare(frameNumber: number): boolean {
    return this.scoreBoard[this.currentPlayer].frames[frameNumber].throwTwo === '/';
  }
  updateBonusPoints(currentThrow: number, throwNumber: string): void { 
    //Only for thow one
    if (throwNumber === 'one')  {
      // Check if frame -1 was a strike or spare BONUS for frameScore -1
      if (this.frameNumber > 0 && (this.wasSpare(this.frameNumber - 1) || this.wasStrike(this.frameNumber - 1))) {    
        this.scoreBoard[this.currentPlayer].frames[this.frameNumber].frameScore += currentThrow;
      }
      // Check if frame -1 and frame -2 was a strike : BONUS for frameScore -2
      if (this.frameNumber > 1 && (this.wasStrike(this.frameNumber - 1) && this.wasStrike(this.frameNumber - 2))) {
        this.scoreBoard[this.currentPlayer].frames[this.frameNumber].frameScore += currentThrow;
      }
    } 
    //Only for throw two
    //Check if frame -1 was a strike
    else if (this.frameNumber > 0 && this.wasStrike(this.frameNumber - 1)) {
      this.scoreBoard[this.currentPlayer].frames[this.frameNumber].frameScore += currentThrow;
    }
  }

  updateBonusFrame(currentThrow: number): void {
    // Check if this is thow one
    if (this.throwNumber === 'one') {
      // No strike
      if (currentThrow < 10) {
        this.scoreBoard[this.currentPlayer].frames[this.frameNumber] = {
          throwOne: currentThrow,
          throwTwo: '',
          frameScore: 0
        }
        this.pinsStanding -= currentThrow;
      }
      // Strike
      else {
        this.scoreBoard[this.currentPlayer].frames[this.frameNumber] = {
          throwOne: 'X',
          throwTwo: '',
          frameScore: 0
        }
      }   
      this.updateBonusPoints(currentThrow, 'one');  
      //Check for spare in previous turn 
      if (this.wasSpare(this.frameNumber -1)) {
        if (this.isLastBonusFrame()) {
          this.calculateTotal();
          this.scoreBoard[this.currentPlayer].turn = false;
          return this.showWinner();
        }
        this.calculateTotal();
        return this.nextTurn();
      } 
      return;
    }
    // Throw number two
    if (this.throwNumber === 'two') {
      if (currentThrow !== 10 && this.pinsStanding === currentThrow) {
        this.scoreBoard[this.currentPlayer].frames[this.frameNumber].throwTwo = '/';
      }
      if (currentThrow === 10) {
        this.scoreBoard[this.currentPlayer].frames[this.frameNumber].throwTwo = 'X';
      }
      else {
        this.scoreBoard[this.currentPlayer].frames[this.frameNumber].throwTwo = currentThrow;
      }
      this.updateBonusPoints(currentThrow, 'two');
      if (this.isLastBonusFrame()) {
        this.calculateTotal();
        return this.showWinner();
      }
      this.calculateTotal();
      return this.nextTurn(); 
    }
  }
  calculateTotal(): void {
    this.scoreBoard[this.currentPlayer].playerTotal += this.scoreBoard[this.currentPlayer].frames[this.frameNumber].frameScore;
  }
  
  showWinner(): void {
    let winnerBoard: IPlayerBoard[] = [...this.scoreBoard]
    winnerBoard.sort((playerA, playerB) => {
      return playerB.playerTotal - playerA.playerTotal;
    });
    switch(this.playerCount) {
      case 1: 
        this.winMessage = `${winnerBoard[0].name} has won!`;
      break;
      case 2:
        if (winnerBoard[0].playerTotal > winnerBoard[1].playerTotal) {
          this.winMessage = `${winnerBoard[0].name} has won!`;
          break;
        }
        else {
          this.winMessage = `${winnerBoard[0].name} and ${winnerBoard[1].name} have won!`;
        }
      break;
      case 3:
        if (winnerBoard[0].playerTotal > winnerBoard[1].playerTotal) {
          this.winMessage = `${winnerBoard[0].name} has won!`;
          break;
        }
        if (winnerBoard[1].playerTotal > winnerBoard[2].playerTotal) {
          this.winMessage = `${winnerBoard[0].name} and ${winnerBoard[1].name} have won!`;
          break;
        }
        else {
          this.winMessage = `${winnerBoard[0].name}, ${winnerBoard[1].name} and ${winnerBoard[2].name} have won!`;
        }
      break;
      case 4: 
        if (winnerBoard[0].playerTotal > winnerBoard[1].playerTotal) {
          this.winMessage = `${winnerBoard[0].name} has won!`;
          break;
        }
        if (winnerBoard[1].playerTotal > winnerBoard[2].playerTotal) {
          this.winMessage = `${winnerBoard[0].name} and ${winnerBoard[1].name} have won!`;
          break;
        }
        if (winnerBoard[2].playerTotal > winnerBoard[3].playerTotal) {
          this.winMessage = `${winnerBoard[0].name}, ${winnerBoard[1].name} and ${winnerBoard[2].name} have won!`;
          break;
        }
        else {
          this.winMessage = "Everybody won!";
        }
      break;
      default:
        this.winMessage = "We could not find a winner.";
    }
    this.isGameEnded = true;
    return;
  }

  onNewGame(): void {
    this.scoreBoard.forEach(playerBoard => { 
      playerBoard.frames = [];
      playerBoard.playerTotal = 0;
      playerBoard.turn = false;
    });
    this.currentPlayer = 0;
    this.frameNumber = 0;
    this.pinsStanding = 10;
    this.scoreBoard[this.currentPlayer].turn = true;
    this.isGameEnded = false;
    }

  onReset(): void {
    this.currentPlayer = 0;
    this.frameNumber = 0;
    this.pinsStanding = 10;
    this.scoreBoard = [];
    this.isGameStarted = false;
    this.isGameEnded = false;
    this.canAddPlayer = true;
    this.playerCount = 0;
    this.newPlayer = '';
    this.winMessage = '';
  }

  ngOnInit() {
   
  
  }
}
