import { Component, signal } from '@angular/core';
import { AppScreen } from './models/question.model';
import { GameModeConfig } from './models/game-mode.model';
import { Home } from './components/home/home';
import { ModeSelect } from './components/mode-select/mode-select';
import { GameIntro } from './components/game-intro/game-intro';
import { Game } from './components/game/game';
import { GameOver } from './components/game-over/game-over';
import { Hangman } from './components/hangman/hangman';
import { GameStateService } from './services/game-state.service';
import { QuizService } from './services/quiz.service';

@Component({
  selector: 'app-root',
  imports: [Home, ModeSelect, GameIntro, Game, GameOver, Hangman],
  template: `
    @switch (screen()) {
      @case ('home') {
        <app-home (startGame)="onStartGame()" />
      }
      @case ('mode-select') {
        <app-mode-select (modeSelected)="onModeSelected($event)" (back)="onBack()" />
      }
      @case ('game-intro') {
        <app-game-intro
          [mode]="pendingMode()!"
          (startGame)="onBeginGame()"
          (back)="onBackFromIntro()" />
      }
      @case ('game') {
        <app-game (gameOver)="onGameOver()" (quitGame)="onBack()" />
      }
      @case ('gameover') {
        <app-game-over (restart)="onRestart()" />
      }
      @case ('hangman') {
        <app-hangman (quit)="onBack()" />
      }
    }
  `,
  styleUrl: './app.scss'
})
export class App {
  readonly screen = signal<AppScreen>('home');
  readonly pendingMode = signal<GameModeConfig | null>(null);

  constructor(
    private gameState: GameStateService,
    private quiz: QuizService
  ) {}

  onStartGame(): void {
    this.screen.set('mode-select');
  }

  onModeSelected(config: GameModeConfig): void {
    this.pendingMode.set(config);
    this.screen.set(config.kind === 'hangman' ? 'hangman' : 'game-intro');
  }

  onBeginGame(): void {
    this.gameState.reset(this.pendingMode()!);
    this.quiz.reset();
    this.screen.set('game');
  }

  onBack(): void {
    this.screen.set('home');
  }

  onBackFromIntro(): void {
    this.screen.set('mode-select');
  }

  onGameOver(): void {
    this.screen.set('gameover');
  }

  onRestart(): void {
    this.screen.set('home');
  }
}
