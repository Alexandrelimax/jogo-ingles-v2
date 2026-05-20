import { Injectable } from '@angular/core';
import { HighScore } from '../models/question.model';

const STORAGE_KEY = 'english-quest-highscores';

@Injectable({ providedIn: 'root' })
export class StorageService {
  getHighScores(): HighScore[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  saveHighScore(entry: HighScore): HighScore[] {
    const scores = this.getHighScores();
    scores.push(entry);
    scores.sort((a, b) => b.score - a.score);
    const top5 = scores.slice(0, 5);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(top5));
    return top5;
  }

  getBestScore(): number {
    const scores = this.getHighScores();
    return scores.length ? scores[0].score : 0;
  }
}
