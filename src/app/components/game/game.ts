import { Component, inject, output, OnInit, OnDestroy } from '@angular/core';
import { GameStateService } from '../../services/game-state.service';
import { QuizService } from '../../services/quiz.service';
import { StorageService } from '../../services/storage.service';
import { Question } from '../../models/question.model';
import { Hud } from '../hud/hud';
import { Question as QuestionComponent } from '../question/question';
import { Answers } from '../answers/answers';
import { Feedback } from '../feedback/feedback';

@Component({
  selector: 'app-game',
  imports: [Hud, QuestionComponent, Answers, Feedback],
  templateUrl: './game.html',
  styleUrl: './game.scss'
})
export class Game implements OnInit, OnDestroy {
  readonly gameOver = output<void>();
  readonly quitGame = output<void>();

  readonly gs = inject(GameStateService);
  private quiz = inject(QuizService);
  private storage = inject(StorageService);

  currentQuestion: Question | null = null;
  isLocked = false;
  questionIndex = 0;
  waitingForTap = false;

  private timerRef: ReturnType<typeof setInterval> | null = null;

  async ngOnInit(): Promise<void> {
    try {
      await this.quiz.loadQuestions();
      this.nextQuestion();
    } catch (err) {
      console.error('Falha ao carregar questões:', err);
    }
  }

  ngOnDestroy(): void {
    this.clearTimer();
  }

  private nextQuestion(): void {
    if (this.gs.isGameOver()) return;
    this.isLocked = false;
    this.gs.selectedAnswer.set(null);
    this.gs.feedbackState.set(null);
    this.gs.explanation.set(null);
    this.currentQuestion = this.quiz.getNextQuestion() ?? null;
    this.gs.currentQuestion.set(this.currentQuestion);
    this.questionIndex++;
    this.startTimer();
  }

  private startTimer(): void {
    const mode = this.gs.currentMode();
    if (!mode?.timerEnabled) return;

    this.clearTimer();
    const questionTime = Math.min(
      this.currentQuestion?.timeLimit ?? mode.questionTime,
      mode.questionTime
    );
    this.gs.timeRemaining.set(questionTime);

    this.timerRef = setInterval(() => {
      const current = this.gs.timeRemaining();
      if (current <= 1) {
        this.clearTimer();
        this.handleTimeout();
      } else {
        this.gs.timeRemaining.set(current - 1);
      }
    }, 1000);
  }

  private clearTimer(): void {
    if (this.timerRef) {
      clearInterval(this.timerRef);
      this.timerRef = null;
    }
  }

  onAnswerSelected(answer: string): void {
    if (this.isLocked) return;
    this.isLocked = true;
    this.clearTimer();

    const isCorrect = answer === this.currentQuestion?.answer;
    this.gs.feedbackState.set(isCorrect ? 'correct' : 'wrong');

    if (isCorrect) {
      this.gs.onCorrectAnswer(this.currentQuestion?.xp);
    } else {
      this.gs.onWrongAnswer();
      this.showExplanation();
    }

    this.scheduleNext();
  }

  private handleTimeout(): void {
    if (this.isLocked) return;
    this.isLocked = true;
    this.gs.feedbackState.set('timeout');
    this.gs.onTimeout();
    this.showExplanation();
    this.scheduleNext();
  }

  private showExplanation(): void {
    const mode = this.gs.currentMode();
    if (mode?.showExplanation && this.currentQuestion?.explanation) {
      this.gs.explanation.set(this.currentQuestion.explanation);
    }
  }

  quit(): void {
    this.clearTimer();
    this.quitGame.emit();
  }

  onTapToContinue(): void {
    if (!this.waitingForTap) return;
    this.waitingForTap = false;
    this.nextQuestion();
  }

  private scheduleNext(): void {
    if (this.gs.isGameOver()) {
      this.storage.saveHighScore({
        score: this.gs.score(),
        level: this.gs.level(),
        correctCount: this.gs.correctAnswered(),
        streak: this.gs.streak(),
        date: new Date().toLocaleDateString('pt-BR'),
        mode: this.gs.currentMode()?.id
      });
      setTimeout(() => this.gameOver.emit(), 1500);
      return;
    }

    const mode = this.gs.currentMode();
    const state = this.gs.feedbackState();

    if (state === 'correct') {
      const delay = mode?.showExplanation ? 2200 : 1000;
      setTimeout(() => this.nextQuestion(), delay);
    } else {
      if (mode?.showExplanation) {
        this.waitingForTap = true;
      } else {
        setTimeout(() => this.nextQuestion(), 1000);
      }
    }
  }
}
