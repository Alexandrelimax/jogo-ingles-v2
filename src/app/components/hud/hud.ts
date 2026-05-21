import { Component, inject } from '@angular/core';
import { GameStateService } from '../../services/game-state.service';
import { QuizService } from '../../services/quiz.service';

@Component({
  selector: 'app-hud',
  imports: [],
  templateUrl: './hud.html',
  styleUrl: './hud.scss'
})
export class Hud {
  readonly gs = inject(GameStateService);
  readonly quiz = inject(QuizService);

  get displayMaxLives(): number {
    const lives = this.gs.currentMode()?.lives ?? 5;
    return Math.min(lives, 5);
  }

  get hearts(): number[] {
    return Array.from({ length: this.displayMaxLives }, (_, i) => i);
  }

  get timerEnabled(): boolean {
    return this.gs.currentMode()?.timerEnabled ?? true;
  }

  get timerPercent(): number {
    const questionTime = this.gs.currentMode()?.questionTime || 15;
    return (this.gs.timeRemaining() / questionTime) * 100;
  }

  get timerClass(): string {
    if (!this.timerEnabled) return 'safe';
    const t = this.gs.timeRemaining();
    const questionTime = this.gs.currentMode()?.questionTime || 15;
    if (t <= questionTime * 0.3) return 'danger';
    if (t <= questionTime * 0.6) return 'warning';
    return 'safe';
  }

  get multiplierLabel(): string {
    const m = this.gs.multiplier();
    return m > 1 ? `x${m}` : '';
  }
}
