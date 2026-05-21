import { Component, inject, input } from '@angular/core';
import { GameStateService } from '../../services/game-state.service';

@Component({
  selector: 'app-feedback',
  imports: [],
  templateUrl: './feedback.html',
  styleUrl: './feedback.scss'
})
export class Feedback {
  readonly gs = inject(GameStateService);
  readonly showTapHint = input(false);

  get icon(): string {
    switch (this.gs.feedbackState()) {
      case 'correct': return '★';
      case 'wrong':   return '✗';
      case 'timeout': return '!!';
      default:        return '';
    }
  }

  get label(): string {
    switch (this.gs.feedbackState()) {
      case 'correct': return `+${this.gs.lastXpGained()} XP`;
      case 'wrong':   return 'ERROU!';
      case 'timeout': return 'TEMPO ESGOTADO';
      default:        return '';
    }
  }
}
