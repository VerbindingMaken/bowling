import { Component, OnInit } from '@angular/core';

import { PlayerBoard } from './models/player-board';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  frameNumber!: number;
  currentThrow!: number;
  pinsStanding!: number;
  currentPlayer!: number;
  currentThowOne!: number;
  scoreBoard!: PlayerBoard[];

  takeTurns(): void {
    // while
    if (this.frameNumber < 10) {
      let length = this.scoreBoard.length;
      for (let i = 0; i < length; i++) {
        console.log(`${this.scoreBoard[i].name} is up!`);
        this.scoreBoard[i].turn = true;
        this.currentPlayer = i;
        this.onThrow()
      }
      console.log(`End of frame ${this.frameNumber}`);
      if (this.frameNumber < 9) {
        this.frameNumber++;
        this.takeTurns();
      }
      else return;
    }
    else return;
  }
  onThrow() {
   this.currentThrow = Math.floor(Math.random() * (this.pinsStanding + 1));
   this.updateFrameScore(this.currentThrow);
  }

  updateFrameScore(currentThrow: number): void {
      if (this.currentThowOne) {
        //This is throw two
        console.log('second throw is: ', currentThrow);
        // Check for spare
        if (this.currentThowOne + currentThrow === 10) {
          this.scoreBoard[this.currentPlayer].playerScore[this.frameNumber].throwTwo = '/';

        } else 
        {
          this.scoreBoard[this.currentPlayer].playerScore[this.frameNumber].throwTwo = currentThrow;
        }
        // Update framescore
        this.scoreBoard[this.currentPlayer].playerScore[this.frameNumber].frameScore += currentThrow;
        // Check for bonus points 
        if (this.frameNumber > 0 && this.scoreBoard[this.currentPlayer].playerScore[this.frameNumber - 1].throwOne === 'X') {
          this.scoreBoard[this.currentPlayer].playerScore[this.frameNumber - 1].frameScore += this.currentThrow;
        }
        // End of turn
        this.scoreBoard[this.currentPlayer].turn = false;
        this.currentThowOne = 0;
      }
      else {
        //This is throw one
        this.currentThowOne = currentThrow;
        if (currentThrow < 10) {
          console.log('Throw one is: ', currentThrow)
          this.scoreBoard[this.currentPlayer].playerScore[this.frameNumber] = {
            throwOne: currentThrow,
            throwTwo: '',
            frameScore: currentThrow
          }
          this.updateBonusScore(currentThrow);        
        } 
        else {
          //It's a strike
          this.scoreBoard[this.currentPlayer].playerScore[this.frameNumber] = {
            throwOne: 'X',
            throwTwo: '',
            frameScore: currentThrow
        }
        this.updateBonusScore(currentThrow);  
        this.scoreBoard[this.currentPlayer].turn = false;
        this.currentThowOne = 0;
      }
      //End of throw one 
      //this.pinsStanding -= this.currentThrow;
    }  
  }

  updateBonusScore(currentThrow: number): void {
    // Check if frame -1 was a strike or spare BONUS for frameScore -1
    if (this.frameNumber > 0 && (this.scoreBoard[this.currentPlayer].playerScore[this.frameNumber - 1].throwTwo === '/' || this.scoreBoard[this.currentPlayer].playerScore[this.frameNumber - 1].throwOne === 'X')) {    
      this.scoreBoard[this.currentPlayer].playerScore[this.frameNumber - 1].frameScore += this.currentThrow;
      // Check if frame -1 and frame -2 was a strike : BONUS for frameScore -2
      if (this.frameNumber > 1 && (this.scoreBoard[this.currentPlayer].playerScore[this.frameNumber - 1].throwOne === 'X' && this.scoreBoard[this.currentPlayer].playerScore[this.frameNumber - 2].throwOne === 'X')) {
        this.scoreBoard[this.currentPlayer].playerScore[this.frameNumber - 2].frameScore += currentThrow;
      }
    } 
  }
    
  


  ngOnInit() {
    this.frameNumber = 0;
    this.pinsStanding = 10;
    this.scoreBoard = [{
      name: "Inge",
      turn: false,
      playerScore: []
    },
    {
      name: "Arne",
      turn: false,
      playerScore: []
    }]
    console.log(this.takeTurns());

  }
}
