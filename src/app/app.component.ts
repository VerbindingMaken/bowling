import { Component, OnInit } from '@angular/core';

import { PlayerBoard } from './models/player-board';
import { PlayerScore } from './models/player-score';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isGameStarted!: boolean;
  isGameEnded!: boolean;
  canAddPlayer!: boolean;
  fourPlayers!: boolean;
  newPlayer!: string;
  playersIDs!: string[];
  frameNumber!: number;
  currentThrow!: number;
  pinsStanding!: number;
  currentPlayer!: number;
  currentThowOne!: number;
  throwNumber!: number;
  scoreBoard!: PlayerBoard[];
  winMessage!: string;

  onAddPlayer() {
    let currentID!: number;
    if (!this.scoreBoard) {
      currentID = 0
    } 
    else {
      currentID = this.scoreBoard.length;
    }
    this.scoreBoard.push({
      name: this.newPlayer.slice(0,20),
      playerID: this.playersIDs[currentID],
      turn: false,
      playerTotal: 0,
      playerScore: []   
    });
    this.newPlayer = "";
    this.canAddPlayer = false;
    if (currentID === 3) {
      this.fourPlayers = true;
    }
  }

  onAddNextPlayer() {
    this.canAddPlayer = true;
  }

  gameStart(): void {
    this.isGameStarted = true;
    this.throwNumber = 1;
    this.currentPlayer = 0;
    this.frameNumber = 0;
    this.pinsStanding = 10;
    this.scoreBoard[this.currentPlayer].turn = true;
    return;
    //Auto fill
    // return this.onThrow();
  }

  onThrow(): void {
    this.currentThrow = Math.floor(Math.random() * (this.pinsStanding + 1));
    // this.currentThrow = 10
    return this.updateFrameScore(this.currentThrow);
  }

  nextTurn(): void {
    //Reset frame
    this.calculateTotal();
    this.scoreBoard[this.currentPlayer].turn = false;
    this.currentThowOne = 0;
    this.throwNumber = 1
    this.pinsStanding = 10;
    // Check if all players have taken their turn this frame
    if (this.currentPlayer < (this.scoreBoard.length - 1)) {
      this.currentPlayer++;
    } 
    else if (this.frameNumber < 11 ) {
      this.frameNumber++;
      this.currentPlayer = 0;  
    } 
    if (this.frameNumber === 10 ) {
      // Bonus round
      // Check if player has no strike or spare in previous frame
      if (!(this.scoreBoard[this.currentPlayer].playerScore[this.frameNumber - 1].throwTwo === '/' || this.scoreBoard[this.currentPlayer].playerScore[this.frameNumber - 1].throwOne === 'X')) {
        if (this.scoreBoard.length === 1 || this.currentPlayer < (this.scoreBoard.length - 1)) {
          return this.nextTurn();
        } 
        else {
          this.frameNumber++;
        }
      } 
    }
    //Check for end of game
    if (this.frameNumber === 11) {
      return this.showWinner();
    }
    this.scoreBoard[this.currentPlayer].turn = true;
    // return;
    // Auto fill
    return this.onThrow();
  }

  updateFrameScore(currentThrow: number): void {
    //Check if this is second throw
    if (this.throwNumber === 2) {
      // Check for bonus round
      if (this.frameNumber === 10) {
        if (this.currentThowOne !== 0 && (this.currentThowOne + currentThrow) === 10) {
          this.scoreBoard[this.currentPlayer].playerScore[this.frameNumber].throwTwo = '/';
        }
        if (currentThrow === 10) {
          this.scoreBoard[this.currentPlayer].playerScore[this.frameNumber].throwTwo = 'X';
        }
        else {
          this.scoreBoard[this.currentPlayer].playerScore[this.frameNumber].throwTwo = currentThrow;
        }
        this.updateBonusScore(currentThrow);
        return this.nextTurn(); 
      } 
      // Normal round: Check for spare
      else if (this.currentThowOne + currentThrow === 10) {
          this.scoreBoard[this.currentPlayer].playerScore[this.frameNumber].throwTwo = '/';
        } 
      else {
          this.scoreBoard[this.currentPlayer].playerScore[this.frameNumber].throwTwo = currentThrow;
      }
      // Update framescore
      this.scoreBoard[this.currentPlayer].playerScore[this.frameNumber].frameScore += currentThrow;
      // Check for bonus points 
      this.updateBonusScore(currentThrow);
      return this.nextTurn(); 
    }
    else {
        //This is throw one
        this.currentThowOne = currentThrow;
        //Check for bonus round
        if (this.frameNumber === 10) {
          //Normal scoring
          if (currentThrow < 10) {
            this.scoreBoard[this.currentPlayer].playerScore[this.frameNumber] = {
              throwOne: currentThrow,
              throwTwo: '',
              frameScore: 0
            }
            this.pinsStanding -= this.currentThrow;
          }
          //It's a strike
          else {
            this.scoreBoard[this.currentPlayer].playerScore[this.frameNumber] = {
              throwOne: 'X',
              throwTwo: '',
              frameScore: 0
            }
          }
          this.updateBonusScore(currentThrow); 
          //Check for spare in previous turn       
          if (this.scoreBoard[this.currentPlayer].playerScore[this.frameNumber -1].throwTwo === '/') {
            return this.nextTurn();
          } 
          else {
            this.throwNumber = 2;
            // return;
            // //Auto fill
            return this.onThrow();
          }  
        }
        //Normal throw one
        //Normal scoring
        if (currentThrow < 10) {
          this.scoreBoard[this.currentPlayer].playerScore[this.frameNumber] = {
            throwOne: currentThrow,
            throwTwo: '',
            frameScore: currentThrow
          }
          this.updateBonusScore(currentThrow);
          this.pinsStanding -= this.currentThrow;
          this.throwNumber = 2;
          // return;
          // //Auto fill
          return this.onThrow();        
        } 
        else {
          //It's a strike
          this.scoreBoard[this.currentPlayer].playerScore[this.frameNumber] = {
            throwOne: 'X',
            throwTwo: '',
            frameScore: currentThrow
          }
          this.updateBonusScore(currentThrow);
          return this.nextTurn(); 
        }
    }  
  }

  updateBonusScore(currentThrow: number): void { 
    //Only for thow one
    if (this.throwNumber === 1 ) {
      // Check if frame -1 was a strike or spare BONUS for frameScore -1
      if (this.frameNumber > 0 && (this.scoreBoard[this.currentPlayer].playerScore[this.frameNumber - 1].throwTwo === '/' || this.scoreBoard[this.currentPlayer].playerScore[this.frameNumber - 1].throwOne === 'X')) {    
        this.scoreBoard[this.currentPlayer].playerScore[this.frameNumber - 1].frameScore += currentThrow;
      }
      // Check if frame -1 and frame -2 was a strike : BONUS for frameScore -2
      if (this.frameNumber > 1 && (this.scoreBoard[this.currentPlayer].playerScore[this.frameNumber - 1].throwOne === 'X' && this.scoreBoard[this.currentPlayer].playerScore[this.frameNumber - 2].throwOne === 'X')) {
        this.scoreBoard[this.currentPlayer].playerScore[this.frameNumber - 2].frameScore += currentThrow;
      }
    } 
    //Only for throw two
    //Check if frame -1 was a strike
    else if (this.frameNumber > 0 && this.scoreBoard[this.currentPlayer].playerScore[this.frameNumber - 1].throwOne === 'X') {
      this.scoreBoard[this.currentPlayer].playerScore[this.frameNumber - 1].frameScore += this.currentThrow;
    }
  }

  calculateTotal(): void {
    this.scoreBoard[this.currentPlayer].playerTotal = 0;
    this.scoreBoard[this.currentPlayer].playerScore.forEach(frame => 
      this.scoreBoard[this.currentPlayer].playerTotal += frame.frameScore); 
  }
  
  showWinner(): void {
    let winnerBoard: PlayerBoard[] = [...this.scoreBoard];
    
    winnerBoard.sort((playerA, playerB) => {
      return playerB.playerTotal - playerA.playerTotal;
    });
    if (winnerBoard.length === 1) {
      this.winMessage = `${winnerBoard[0].name} has won!`;
    }
    else if (winnerBoard[0].playerTotal > winnerBoard[1].playerTotal) {
      this.winMessage = `${winnerBoard[0].name} has won!`;
    }
    else if (winnerBoard[1].playerTotal > winnerBoard[2].playerTotal) {
      this.winMessage = `${winnerBoard[0].name} and ${winnerBoard[1].name} have won!`;
    }
    else if (winnerBoard[2].playerTotal > winnerBoard[3].playerTotal) {
      this.winMessage = `${winnerBoard[0].name}, ${winnerBoard[1].name} and ${winnerBoard[2].name} have won!`;
    }
    else {
      this.winMessage = `${winnerBoard[0].name}, ${winnerBoard[1].name}, ${winnerBoard[2].name} and ${winnerBoard[3].name} have all won!`;
    }
    this.isGameEnded = true;
    return;
  }

  onNewGame(): void {
    this.scoreBoard.forEach(playerBoard => { 
      playerBoard.playerScore = [];
      playerBoard.playerTotal = 0;
      playerBoard.turn = false;
    });
    this.throwNumber = 1;
    this.currentPlayer = 0;
    this.frameNumber = 0;
    this.pinsStanding = 10;
    this.scoreBoard[this.currentPlayer].turn = true;
    this.isGameEnded = false;
  }

  onReset(): void {
    this.scoreBoard = [];
    this.isGameStarted = false;
    this.canAddPlayer = true;
    this.fourPlayers = false;
    this.isGameEnded = false;
  }

  ngOnInit() {
    this.isGameStarted = false;
    this.isGameEnded = false;
    this.canAddPlayer = true;
    this.fourPlayers = false;
    this.playersIDs = [
      "one",
      "two",
      "three",
      "four"
    ];
    this.scoreBoard = [];
  }
}
