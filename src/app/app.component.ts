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
      playerScore: []
    },
    {
      name: "Arne",
      turn: false,
      playerScore: []
    }]

  }
}
