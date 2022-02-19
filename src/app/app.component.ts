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
  scoreBoard!: PlayerBoard[];


  ngOnInit() {
    this.frameNumber = 0;
    this.pinsStanding = 10;
    this.scoreBoard = [{
      name: "Inge",
      turn: false,
      playerScore: [{
        throwOne: 3,
        throwTwo: 4,
        frameScore: 7
      },
      {
        throwOne: 3,
        throwTwo: 4,
        frameScore: 7
      }]
    },
    {
      name: "Arne",
      turn: false,
      playerScore: [{
        throwOne: 0,
        throwTwo: 5
      }]
    }]

  }
}
