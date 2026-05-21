import { Component, input, computed } from '@angular/core';
import { Question as QuestionModel } from '../../models/question.model';

@Component({
  selector: 'app-question',
  imports: [],
  templateUrl: './question.html',
  styleUrl: './question.scss'
})
export class Question {
  readonly question = input.required<QuestionModel>();
  readonly questionIndex = input<number>(0);

  readonly difficultyStars = computed(() => {
    const map: Record<string, number> = { easy: 1, medium: 2, hard: 3, expert: 4 };
    return Array.from({ length: map[this.question().difficulty] ?? 1 });
  });

  readonly difficultyLabel = computed(() => {
    const map: Record<string, string> = { easy: 'FÁCIL', medium: 'MÉDIO', hard: 'DIFÍCIL', expert: 'EXPERT' };
    return map[this.question().difficulty] ?? '';
  });
}
