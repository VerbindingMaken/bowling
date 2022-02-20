import { Component, OnInit } from '@angular/core';

import { PlayerBoard } from './models/player-board';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isGameStarted!: boolean;
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

  onAddPlayer() {
    let currentID!: number;
    if (!this.scoreBoard) {
      currentID = 0
    } 
    else {
      currentID = this.scoreBoard.length;
    }
    this.scoreBoard.push({
      name: this.newPlayer,
      playerID: this.playersIDs[currentID],
      turn: false,
      playerScore: []   
    });
    console.log(this.scoreBoard[currentID]);
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
    this.currentPlayer = 0;
    this.frameNumber = 0;
    this.pinsStanding = 10;
    this.scoreBoard[this.currentPlayer].turn = true;
    console.log(`Game start, frame number = ${this.frameNumber + 1}`);
    return;
  }

  onThrow(): void {
    this.currentThrow = Math.floor(Math.random() * (this.pinsStanding + 1));
    return this.updateFrameScore(this.currentThrow);
  }

  nextTurn(): void {
    //Reset frame
    this.scoreBoard[this.currentPlayer].turn = false;
    this.currentThowOne = 0;
    this.throwNumber = 1
    this.pinsStanding = 10;
    // Check if all players have taken their turn this frame
    if (this.currentPlayer < (this.scoreBoard.length - 1)) {
      this.currentPlayer++;
      console.log('Next turn')
    } 
    else if (this.frameNumber < 11 ) {
      this.frameNumber++;
      this.currentPlayer = 0;  
      console.log(`Next frame, frame number = ${this.frameNumber + 1}`);   
    } 
    if (this.frameNumber === 10 ) {
      // Bonus round
      console.log('Bonus round');
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
      console.log('Game ends at frame 12');
      return;
    }
    this.scoreBoard[this.currentPlayer].turn = true;
    return;
  }

  updateFrameScore(currentThrow: number): void {
    //Check if this is second throw
    if (this.throwNumber === 2) {
      console.log('second throw is: ', currentThrow);
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
            console.log('Throw one is: ', currentThrow)
            this.scoreBoard[this.currentPlayer].playerScore[this.frameNumber] = {
              throwOne: currentThrow,
              throwTwo: '',
              frameScore: currentThrow
            }
            this.pinsStanding -= this.currentThrow;
          }
          //It's a strike
          else {
            this.scoreBoard[this.currentPlayer].playerScore[this.frameNumber] = {
              throwOne: 'X',
              throwTwo: '',
              frameScore: currentThrow
            }
          }
          this.updateBonusScore(currentThrow); 
          //Check for spare in previous turn       
          if (this.scoreBoard[this.currentPlayer].playerScore[this.frameNumber -1].throwTwo === '/') {
            return this.nextTurn();
          } 
          else {
            this.throwNumber = 2;
            return;
          }  
        }
        //Normal throw two
        //Normal scoring
        if (currentThrow < 10) {
          console.log('Throw one is: ', currentThrow)
          this.scoreBoard[this.currentPlayer].playerScore[this.frameNumber] = {
            throwOne: currentThrow,
            throwTwo: '',
            frameScore: currentThrow
          }
          this.updateBonusScore(currentThrow);
          this.pinsStanding -= this.currentThrow;
          this.throwNumber = 2;
          return;        
        } 
        else {
          //It's a strike
          console.log('Throw one is: ', currentThrow)
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
        this.scoreBoard[this.currentPlayer].playerScore[this.frameNumber - 1].frameScore += this.currentThrow;
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
 
    
  


  ngOnInit() {
    this.isGameStarted = false;
    this.canAddPlayer = true;
    this.fourPlayers = false;
    this.playersIDs = [
      "one",
      "two",
      "three",
      "four"
    ];
    this.scoreBoard = [];
    // this.scoreBoard = [{
    //   name: "Inge",
    //   playerID: "one",
    //   turn: false,
    //   playerScore: []
    // },
    // {
    //   name: "Arne",
    //   turn: false,
    //   playerID: "two",
    //   playerScore: [] 
    // },
    // {
    //   name: "Ahmad",
    //   turn: false,
    //   playerID: "three",
    //   playerScore: [] 
    // }
    // {
    //   name: "Suus",
    //   turn: false,
    //   playerID: "four",
    //   playerScore: [] 
    // }
  // ]
  }
}
