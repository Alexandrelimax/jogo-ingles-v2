import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Question, QuestionCategory, DifficultyLevel } from '../models/question.model';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class QuizService {
  private allQuestions: Question[] = [];
  private recentIds: string[] = [];
  readonly isLoaded = signal(false);

  constructor(private http: HttpClient) {}

  async loadQuestions(): Promise<void> {
    if (this.isLoaded()) return;
    const data = await firstValueFrom(
      this.http.get<Question[]>('assets/data/questions.json')
    );
    this.allQuestions = data;
    this.isLoaded.set(true);
  }

  getNextQuestion(category?: QuestionCategory, difficulty?: DifficultyLevel): Question | undefined {
    let pool = this.allQuestions;

    if (category) pool = pool.filter(q => q.category === category);
    if (difficulty) pool = pool.filter(q => q.difficulty === difficulty);
    if (pool.length === 0) pool = this.allQuestions;

    const available = pool.filter(q => !this.recentIds.includes(q.id));
    const candidates = available.length > 0 ? available : pool;
    const picked = candidates[Math.floor(Math.random() * candidates.length)];

    this.recentIds.push(picked.id);
    if (this.recentIds.length > Math.floor(this.allQuestions.length * 0.6)) {
      this.recentIds.shift();
    }
    return picked;
  }

  get totalQuestions(): number {
    return this.allQuestions.length;
  }

  reset(): void {
    this.recentIds = [];
  }
}
