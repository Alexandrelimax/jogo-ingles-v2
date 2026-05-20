import { Injectable, signal, computed } from '@angular/core';
import { FeedbackState, Question } from '../models/question.model';
import { GameModeConfig } from '../models/game-mode.model';

export const XP_PER_LEVEL = 500;
export const BASE_XP = 100;

@Injectable({ providedIn: 'root' })
export class GameStateService {
  readonly currentMode = signal<GameModeConfig | null>(null);

  readonly lives = signal(5);
  readonly score = signal(0);
  readonly streak = signal(0);
  readonly level = signal(1);
  readonly xp = signal(0);
  readonly timeRemaining = signal(15);
  readonly isGameOver = signal(false);
  readonly isLevelUp = signal(false);
  readonly totalAnswered = signal(0);
  readonly correctAnswered = signal(0);
  readonly currentQuestion = signal<Question | null>(null);
  readonly selectedAnswer = signal<string | null>(null);
  readonly feedbackState = signal<FeedbackState>(null);
  readonly lastXpGained = signal(0);
  readonly explanation = signal<string | null>(null);

  readonly streakMilestone = computed(() => {
    const milestones: Record<number, string> = {
      3:  'NICE!',
      5:  'AWESOME!',
      8:  'INCREDIBLE!',
      12: 'UNSTOPPABLE!',
      15: 'LEGENDARY!',
      20: 'GOD MODE!',
    };
    return milestones[this.streak()] ?? null;
  });

  readonly multiplier = computed(() => {
    if (!this.currentMode()?.comboEnabled) return 1;
    const s = this.streak();
    if (s >= 8) return 5;
    if (s >= 5) return 3;
    if (s >= 3) return 2;
    return 1;
  });

  readonly accuracy = computed(() => {
    const total = this.totalAnswered();
    if (total === 0) return 0;
    return Math.round((this.correctAnswered() / total) * 100);
  });

  readonly xpProgress = computed(() => {
    return (this.xp() % XP_PER_LEVEL / XP_PER_LEVEL) * 100;
  });

  onCorrectAnswer(questionXp?: number): void {
    const mode = this.currentMode();
    const base = questionXp ?? BASE_XP;
    const questionTime = mode?.questionTime || 15;
    const timeBonus = mode?.timerEnabled
      ? this.timeRemaining() / questionTime
      : 1;
    const xpGained = Math.round(base * this.multiplier() * (0.5 + 0.5 * timeBonus));

    this.lastXpGained.set(xpGained);
    this.streak.update(s => s + 1);
    this.score.update(s => s + xpGained);
    this.correctAnswered.update(c => c + 1);
    this.totalAnswered.update(t => t + 1);

    const newXp = this.xp() + xpGained;
    const newLevel = Math.floor(newXp / XP_PER_LEVEL) + 1;
    if (newLevel > this.level()) {
      this.level.set(newLevel);
      this.isLevelUp.set(true);
      setTimeout(() => this.isLevelUp.set(false), 2500);
    }
    this.xp.set(newXp);
  }

  onWrongAnswer(): void {
    this.streak.set(0);
    this.totalAnswered.update(t => t + 1);
    const mode = this.currentMode();
    if (!mode || mode.lives < 999) {
      this.lives.update(l => l - 1);
      if (this.lives() <= 0) {
        this.isGameOver.set(true);
      }
    }
  }

  onTimeout(): void {
    this.onWrongAnswer();
  }

  reset(config: GameModeConfig): void {
    this.currentMode.set(config);
    this.lives.set(config.lives);
    this.score.set(0);
    this.streak.set(0);
    this.level.set(1);
    this.xp.set(0);
    this.timeRemaining.set(config.questionTime || 15);
    this.isGameOver.set(false);
    this.isLevelUp.set(false);
    this.totalAnswered.set(0);
    this.correctAnswered.set(0);
    this.currentQuestion.set(null);
    this.selectedAnswer.set(null);
    this.feedbackState.set(null);
    this.lastXpGained.set(0);
    this.explanation.set(null);
  }
}
