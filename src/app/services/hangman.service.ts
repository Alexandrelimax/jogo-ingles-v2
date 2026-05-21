import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HangmanWord } from '../models/hangman.model';

export const HANGMAN_MAX_WRONG = 6;
export const HANGMAN_XP_BASE = 50;

@Injectable({ providedIn: 'root' })
export class HangmanService {
  private http = inject(HttpClient);

  private allWords: HangmanWord[] = [];
  private recentIds = new Set<string>();

  readonly isLoaded = signal(false);
  readonly currentWord = signal<HangmanWord | null>(null);
  readonly guessedLetters = signal<Set<string>>(new Set());
  readonly score = signal(0);
  readonly streak = signal(0);
  readonly wordsPlayed = signal(0);
  readonly wordsWon = signal(0);

  readonly wrongLetters = computed(() => {
    const word = this.currentWord();
    if (!word) return [];
    return [...this.guessedLetters()].filter(l => !word.word.includes(l));
  });

  readonly wrongCount = computed(() => this.wrongLetters().length);

  readonly displayWord = computed((): string[] => {
    const word = this.currentWord();
    if (!word) return [];
    return word.word.split('').map(l => this.guessedLetters().has(l) ? l : '_');
  });

  readonly isWon = computed(() => this.displayWord().every(c => c !== '_'));
  readonly isLost = computed(() => this.wrongCount() >= HANGMAN_MAX_WRONG);
  readonly isOver = computed(() => this.isWon() || this.isLost());

  readonly xpEarned = computed(() => {
    if (!this.isWon()) return 0;
    const word = this.currentWord()!;
    const diffMult: Record<string, number> = { easy: 1, medium: 1.5, hard: 2.5 };
    const wrongPenalty = Math.max(0, 1 - this.wrongCount() * 0.1);
    return Math.round(HANGMAN_XP_BASE * (diffMult[word.difficulty] ?? 1) * wrongPenalty);
  });

  loadWords(): void {
    if (this.isLoaded()) return;
    this.http.get<HangmanWord[]>('assets/data/words.json').subscribe(words => {
      this.allWords = words;
      this.isLoaded.set(true);
    });
  }

  nextWord(): void {
    if (!this.allWords.length) return;

    const poolSize = Math.max(1, Math.floor(this.allWords.length * 0.6));
    const available = this.allWords.filter(w => !this.recentIds.has(w.id));
    const pool = available.length >= poolSize ? available : this.allWords;
    const word = pool[Math.floor(Math.random() * pool.length)];

    this.recentIds.add(word.id);
    if (this.recentIds.size > poolSize) {
      const first = this.recentIds.values().next().value;
      if (first) this.recentIds.delete(first);
    }

    this.currentWord.set(word);
    this.guessedLetters.set(new Set());
  }

  guessLetter(letter: string): void {
    if (this.isOver()) return;
    const upper = letter.toUpperCase();
    if (this.guessedLetters().has(upper)) return;
    this.guessedLetters.update(set => new Set([...set, upper]));
  }

  confirmResult(): void {
    if (!this.isOver()) return;
    const won = this.isWon();
    this.wordsPlayed.update(n => n + 1);
    if (won) {
      this.wordsWon.update(n => n + 1);
      this.streak.update(n => n + 1);
      this.score.update(n => n + this.xpEarned());
    } else {
      this.streak.set(0);
    }
  }

  reset(): void {
    this.score.set(0);
    this.streak.set(0);
    this.wordsPlayed.set(0);
    this.wordsWon.set(0);
    this.recentIds.clear();
    this.currentWord.set(null);
    this.guessedLetters.set(new Set());
  }
}
