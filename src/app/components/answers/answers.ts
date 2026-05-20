import { Component, inject, input, output } from '@angular/core';
import { GameStateService } from '../../services/game-state.service';

@Component({
  selector: 'app-answers',
  imports: [],
  templateUrl: './answers.html',
  styleUrl: './answers.scss'
})
export class Answers {
  readonly options = input.required<string[]>();
  readonly locked = input<boolean>(false);
  readonly correctAnswer = input<string | null>(null);
  readonly answerSelected = output<string>();

  readonly gs = inject(GameStateService);

  select(option: string): void {
    if (this.locked()) return;
    this.gs.selectedAnswer.set(option);
    this.answerSelected.emit(option);
  }

  getClass(option: string): string {
    const selected = this.gs.selectedAnswer();
    const correct = this.correctAnswer();
    const feedback = this.gs.feedbackState();

    if (!feedback) {
      return selected === option ? 'selected' : '';
    }
    if (option === correct) return 'correct';
    if (option === selected && option !== correct) return 'wrong';
    return 'dimmed';
  }
}
