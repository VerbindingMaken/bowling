import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let comp: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let de: DebugElement;
  let el: HTMLElement;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(AppComponent);
      comp = fixture.componentInstance;
      el = fixture.nativeElement as HTMLElement;
      fixture.detectChanges();
    });
  });

  it('should create the app', () => {
    expect(comp).toBeTruthy();
  });

  it(`should have as title 'Bowling game'`, () => {
    expect(comp.title).toEqual('Bowling game');
  });

  it('should render title', () => {
    expect(el.querySelector('header h1')?.textContent).toContain('Bowling game');
  });
  it('should add player to scoreBoard', async () => {
    comp.newPlayer = 'test-player'
    comp.onAddPlayer();
    expect(comp.scoreBoard[0].name).toEqual('test-player');
  });
  it('Should return isGameStarted as true on Game Start',async () => {
    comp.newPlayer = 'test-player'
    comp.onAddPlayer();
    comp.onGameStart();
    expect(comp.isGameStarted).toBeTruthy();
  })
  // it('Should return a playerTotal of 0 when all throws 0',async () => {
  //   comp.newPlayer = 'test-player'
  //   comp.onAddPlayer();
  //   for (let i = 0; i < 30; i++) {
  //     comp.onThrow(0);
  //   }
  //   expect(comp.scoreBoard[0].playerTotal).toEqual(0);  
  // })
  // it('Should return a playerTotal of 20 when all throws 1',async () => {
  //   comp.newPlayer = 'test-player'
  //   comp.onAddPlayer();
  //   for (let i = 0; i < 40; i++) {
  //     comp.onThrow(1);
  //   }
  //   expect(comp.scoreBoard[0].playerTotal).toEqual(20);  
  // })
  // it('Should return a playerTotal of 300 when all throws 10',async () => {
  //   comp.newPlayer = 'test-player'
  //   comp.onAddPlayer();
  //   for (let i = 0; i < 40; i++) {
  //     comp.onThrow(10);
  //   }
  //   expect(comp.scoreBoard[0].playerTotal).toEqual(300);  
  // })

});
